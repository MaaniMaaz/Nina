"use client";

import { useEffect } from "react";

/** Legacy URL → homepage patient stories section. */
export default function PatientStoriesRedirect() {
  useEffect(() => {
    window.location.replace("/#patient-stories");
  }, []);

  return (
    <main className="mx-auto max-w-lg px-6 py-20 text-center">
      <p className="font-display text-2xl text-ink">Taking you to patient stories…</p>
      <p className="mt-3 text-[14px] text-muted">
        <a href="/#patient-stories" className="font-semibold text-terracotta">
          Continue
        </a>
      </p>
    </main>
  );
}
