import { MongoClient, Db, type Collection } from "mongodb";
import type { CmsPageDocument } from "@/lib/cms/types";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient(): MongoClient {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  return new MongoClient(uri, {
    // Serverless: give up quickly so an unreachable cluster degrades to the
    // static fallback instead of hanging the request for the default 30s.
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    // Every warm lambda holds its own pool, so the cluster-wide socket count is
    // maxPoolSize x concurrent instances. Keep it small and let idle sockets go
    // to stay under the shared-tier connection cap.
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 15000,
    waitQueueTimeoutMS: 5000,
  });
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.length > 0);
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!isMongoConfigured()) {
    throw new Error("MONGODB_URI is not set");
  }
  // Reuse one client across invocations that share a warm lambda; a new client
  // per request re-runs the TLS + replica-set handshake on every page view.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient()
      .connect()
      .catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "nina");
}

/**
 * Indexes are created by `npm run seed`, not here: doing it on the request path
 * spent two extra operations on every cold start against a rate-limited tier.
 */
export async function pagesCollection(): Promise<Collection<CmsPageDocument>> {
  const db = await getDb();
  return db.collection<CmsPageDocument>("pages");
}

/** Singleton site photography overrides (images + wistia ids). */
export async function siteMediaCollection(): Promise<Collection<Record<string, unknown>>> {
  const db = await getDb();
  return db.collection("site_media");
}
