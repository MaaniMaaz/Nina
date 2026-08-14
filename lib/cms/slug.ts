/** Turn a page title into a URL slug segment (no path prefix). */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

export function defaultPathForType(
  type: "condition" | "treatment" | "blog" | "home",
  title: string,
): string {
  if (type === "home") return "/";
  const segment = slugifyTitle(title);
  if (type === "condition") return `/conditions/${segment}`;
  if (type === "treatment") return `/treatments/${segment}`;
  return `/blog/${segment}`;
}

export function publicPath(
  type: "condition" | "treatment" | "blog" | "home",
  slug: string,
): string {
  if (type === "home") return "/";
  if (type === "condition") return `/conditions/${slug}`;
  if (type === "treatment") return `/treatments/${slug}`;
  return `/blog/${slug}`;
}
