"use client";

import { useState } from "react";

/**
 * Public contact form. Posts to `/api/contact`.
 * If CONTACT_WEBHOOK_URL is configured server-side, the API forwards there;
 * otherwise it returns a mailto fallback for the visitor.
 */
export default function ContactForm({
  className = "",
}: {
  className?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    setMailto(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        mailto?: string;
      };
      if (!res.ok) throw new Error(data.error || "Send failed");
      if (data.mailto) {
        setMailto(data.mailto);
        window.location.href = data.mailto;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-3 ${className}`}>
      <div>
        <label htmlFor="contact-name" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Name
        </label>
        <input
          id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-terracotta px-4 py-2.5 text-[13px] font-semibold text-cream disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "ok" ? (
        <p className="text-[13px] text-[#3d5a35]">
          {mailto
            ? "Opening your email app — if nothing appears, email hello@ninarossfm.com."
            : "Thanks — we received your message and will reply soon."}
        </p>
      ) : null}
      {error ? <p className="text-[13px] text-red-700">{error}</p> : null}
    </form>
  );
}
