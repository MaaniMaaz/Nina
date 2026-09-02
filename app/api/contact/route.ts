import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO = "hello@ninarossfm.com";

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

/**
 * Contact intake. Prefer CONTACT_WEBHOOK_URL (Formspree / Zapier / custom).
 * Without it, returns a mailto link so the visitor can still send from their client.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  const message = String(body.message || "").trim().slice(0, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          source: "ninarossfm.com/contact",
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("CONTACT_WEBHOOK_URL failed", res.status, text.slice(0, 200));
        return NextResponse.json({ error: "Could not deliver message. Try emailing hello@ninarossfm.com." }, { status: 502 });
      }
      return NextResponse.json({ ok: true, delivered: "webhook" });
    } catch (err) {
      console.error("CONTACT_WEBHOOK_URL error", err);
      return NextResponse.json({ error: "Could not deliver message. Try emailing hello@ninarossfm.com." }, { status: 502 });
    }
  }

  const subject = encodeURIComponent(`Website inquiry from ${name}`);
  const bodyText = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
  return NextResponse.json({
    ok: true,
    delivered: "mailto",
    mailto: `mailto:${TO}?subject=${subject}&body=${bodyText}`,
  });
}
