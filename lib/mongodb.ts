import { MongoClient, Db, type Collection } from "mongodb";
import type { CmsPageDocument } from "@/lib/cms/types";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesReady: Promise<void> | undefined;
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
    maxPoolSize: 10,
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

async function ensurePageIndexes(col: Collection<CmsPageDocument>) {
  await col.createIndex({ type: 1, slug: 1 }, { unique: true });
  await col.createIndex({ type: 1, status: 1 });
}

export async function pagesCollection(): Promise<Collection<CmsPageDocument>> {
  const db = await getDb();
  const col = db.collection<CmsPageDocument>("pages");
  if (!global._mongoIndexesReady) {
    global._mongoIndexesReady = ensurePageIndexes(col).catch((err) => {
      console.error("Failed to ensure MongoDB page indexes", err);
      global._mongoIndexesReady = undefined;
    });
  }
  try {
    await global._mongoIndexesReady;
  } catch {
    // Indexes are best-effort; collection is still usable.
  }
  return col;
}
