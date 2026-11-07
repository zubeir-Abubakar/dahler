/**
 * Contact form endpoint (Vercel serverless function).
 *
 * Delivery goes through Resend's HTTP API, configured entirely by environment
 * variables (see .env.example). Without RESEND_API_KEY the endpoint answers 503
 * with code "not_configured" and the form shows the phone number instead of
 * pretending the message was sent.
 */
type ApiRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Best-effort, per-instance throttle. Good enough to stop casual form spam. */
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ code: "method_not_allowed" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return res.status(400).json({ code: "invalid_body" });
  }

  // Honeypot: bots fill hidden fields, people do not. Drop silently.
  if (clean(payload.website, 200).length > 0) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const company = clean(payload.company, 120);
  const email = clean(payload.email, 160);
  const phone = clean(payload.phone, 40);
  const subject = clean(payload.subject, 160);
  const message = clean(payload.message, 4000);
  const locale = clean(payload.locale, 8);
  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : 0;

  if (!name || !subject || !message || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ code: "invalid_input" });
  }

  // Time gate: a human needs more than a second to fill this in.
  if (startedAt > 0 && Date.now() - startedAt < 1500) {
    return res.status(400).json({ code: "invalid_input" });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ code: "rate_limited" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return res.status(503).json({ code: "not_configured" });
  }

  const text = [
    `New enquiry from the website (${locale || "de"})`,
    "",
    `Name:     ${name}`,
    `Company:  ${company || "—"}`,
    `Email:    ${email}`,
    `Phone:    ${phone || "—"}`,
    `Subject:  ${subject}`,
    "",
    message,
  ].join("\n");

  try {
    const delivery = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Website enquiry: ${subject}`,
        text,
      }),
    });

    if (!delivery.ok) {
      console.error("Resend delivery failed", delivery.status, await delivery.text());
      return res.status(502).json({ code: "delivery_failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return res.status(502).json({ code: "delivery_failed" });
  }
}
