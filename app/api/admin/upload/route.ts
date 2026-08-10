import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdminAuthenticated } from "@/lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const upload = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "nina-cms", resource_type: "image" },
          (err, result) => {
            if (err || !result) reject(err ?? new Error("Upload failed"));
            else
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
          },
        )
        .end(bytes);
    },
  );

  return NextResponse.json({ url: upload.secure_url, publicId: upload.public_id });
}
