import { SiteMediaProvider } from "@/components/media/SiteMediaContext";
import { getResolvedSiteMedia } from "@/lib/cms/media";

/** Server wrapper that loads CMS/static media once per request for client trees. */
export default async function SiteMediaShell({ children }: { children: React.ReactNode }) {
  const media = await getResolvedSiteMedia();
  return <SiteMediaProvider media={media}>{children}</SiteMediaProvider>;
}
