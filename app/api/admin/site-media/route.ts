import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isMongoConfigured } from "@/lib/mongodb";
import {
  ensureSiteMediaDoc,
  getSiteMediaOverrides,
  patchSiteMedia,
  SITE_MEDIA_CATALOG,
  SITE_MEDIA_FALLBACKS,
  DEFAULT_WISTIA,
  PATIENT_MEDIA_KEYS,
} from "@/lib/cms/media";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }

  await ensureSiteMediaDoc();
  const overrides = await getSiteMediaOverrides();
  const resolvedImages: Record<string, string> = { ...SITE_MEDIA_FALLBACKS };
  for (const [k, v] of Object.entries(overrides.images)) {
    if (v?.trim()) resolvedImages[k] = v.trim();
  }
  const resolvedWistia: Record<string, string> = { ...DEFAULT_WISTIA };
  for (const [k, v] of Object.entries(overrides.wistia)) {
    if (v?.trim()) resolvedWistia[k] = v.trim();
  }

  return NextResponse.json({
    catalog: SITE_MEDIA_CATALOG,
    patientKeys: PATIENT_MEDIA_KEYS,
    defaults: { images: SITE_MEDIA_FALLBACKS, wistia: DEFAULT_WISTIA },
    overrides,
    resolved: { images: resolvedImages, wistia: resolvedWistia },
  });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }

  let body: {
    images?: Record<string, string | null | undefined>;
    wistia?: Record<string, string | null | undefined>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const doc = await patchSiteMedia({
    images: body.images,
    wistia: body.wistia,
  });

  // Home + shared surfaces that read site media
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/start");
  revalidatePath("/conditions");
  revalidatePath("/treatments");
  revalidatePath("/blog");

  return NextResponse.json({
    ok: true,
    overrides: { images: doc.images ?? {}, wistia: doc.wistia ?? {} },
  });
}
