"use client";

import Link from "next/link";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import { useEdit } from "./EditContext";
import type { BlogPageContent } from "@/lib/cms/types";

/**
 * In-place blog editor that mirrors the public /blog/[slug] layout so staff
 * edit in the real design. Structure stays locked to the template.
 */
export default function BlogEditable() {
  const edit = useEdit();
  const content = edit?.content as BlogPageContent | undefined;
  if (!content) return null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:px-[clamp(40px,6vw,100px)] md:py-20">
      <Link href="/blog" className="pointer-events-none text-[13px] font-medium text-terracotta no-underline">
        ← The Journal
      </Link>
      <p className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-muted">
        {content.fmt} · {content.cat} · {content.meta}
      </p>
      <h1 className="mt-3 font-display text-[32px] font-medium leading-tight text-ink md:text-[48px]">
        <EditableText path="title" value={content.title} as="span" multiline />
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-body">
        <EditableText path="dek" value={content.dek} multiline />
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-sand">
        <EditableImage
          urlPath="coverImageUrl"
          alt={content.coverAlt}
          placeholder="Cover image"
          className="h-full w-full"
        />
      </div>

      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-body">
        {content.sections.map((section, i) =>
          section.type === "text" ? (
            <p key={i}>
              <EditableText path={`sections.${i}.text`} value={section.text} multiline />
            </p>
          ) : (
            <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand">
              <EditableImage
                urlPath={`sections.${i}.url`}
                alt={section.alt}
                placeholder="Section image"
                className="h-full w-full"
              />
            </div>
          ),
        )}
      </div>
    </article>
  );
}
