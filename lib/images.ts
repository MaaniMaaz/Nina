/** Whether Next should skip its optimizer (unknown remote hosts only). */
export function shouldUnoptimizeImage(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) return false;
  try {
    const host = new URL(src).hostname;
    // Cloudinary is allowlisted in next.config — keep optimization on for CWV.
    if (host === "res.cloudinary.com" || host.endsWith(".cloudinary.com")) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}
