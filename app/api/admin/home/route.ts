import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureHomePage } from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";

/** Ensure + return the single homepage CMS document. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }
  try {
    const page = await ensureHomePage();
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load homepage" },
      { status: 500 },
    );
  }
}
