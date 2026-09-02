"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Client search control used where a GET form is awkward (optional). */
export default function NotFoundSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const href = q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search";
    router.push(href);
  }

  return (
    <form onSubmit={submit} className="mt-6 flex max-w-md items-center gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search conditions, treatments, or the Journal"
        className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-[14px]"
      />
      <button type="submit" className="rounded bg-terracotta px-4 py-2 font-semibold text-cream">
        Search
      </button>
    </form>
  );
}
