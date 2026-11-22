import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema, normaliseIndianMobile } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // 1) Rate limit: 5 submissions per IP per 10 minutes (best effort, see lib/rate-limit.ts).
  const limit = rateLimit(`contact:${clientIp(req)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 2) Honeypot: pretend success so bots learn nothing.
  if (json && typeof json === "object" && "website" in json && (json as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  // 3) Server-side validation (same schema as the client).
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return NextResponse.json(
      { ok: false, error: "Our contact form is temporarily unavailable. Please call or WhatsApp us instead." },
      { status: 503 },
    );
  }

  const d = parsed.data;
  const phone = normaliseIndianMobile(d.phone);
  const rows: [string, string][] = [
    ["Full name", d.fullName],
    ["Company", d.company || "—"],
    ["Phone", phone],
    ["Email", d.email],
    ["Service needed", d.service || "—"],
    ["Company size", d.companySize || "—"],
    ["Preferred contact", d.contactMethod],
    ["Message", d.message || "—"],
  ];

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;max-width:620px">
      <h2 style="margin:0 0 4px;font-size:18px">New consultation request</h2>
      <p style="margin:0 0 20px;color:#666;font-size:13px">Submitted via classoneconsulting website</p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border-bottom:1px solid #eee;color:#666;width:160px;vertical-align:top">${k}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escape(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "ClassOne Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      replyTo: d.email,
      subject: `New enquiry: ${d.fullName}${d.company ? ` (${d.company})` : ""}`,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message right now. Please try again, or call or WhatsApp us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
