import type { Metadata } from "next";
import BlogHome from "@/components/blog/BlogHome";
import JsonLd from "@/components/seo/JsonLd";
import { buildBlogJsonLd } from "@/content/blog";

export const metadata: Metadata = {
  title: {
    absolute:
      "The Journal | Functional Medicine Articles, Videos & Guides | Dr. Nina Ross, ND PhD",
  },
  description:
    "Functional medicine explained in plain language by Dr. Nina Ross, ND PhD in Atlanta. Read, watch, or listen to guides on thyroid, hormones, gut health, PCOS, and weight.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Journal | Functional Medicine Articles & Guides | Dr. Nina Ross, ND PhD",
    description:
      "Functional medicine explained in plain language by Dr. Nina Ross, ND PhD. Read, watch, or listen on your commute.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd schema={buildBlogJsonLd()} />
      <BlogHome />
    </>
  );
}
