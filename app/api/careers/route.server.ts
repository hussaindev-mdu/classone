import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { applicationRows, applicationSchema, resumeError } from "@/lib/careers-schema";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const FAIL = `We couldn't send your application right now. Please try again, or email your resume to ${siteConfig.email}.`;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`careers:${clientIp(req)}`, 3);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many applications. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (form.get("website")) return NextResponse.json({ ok: true }); // honeypot

  const fields = Object.fromEntries(
    [...form.entries()].filter(([k, v]) => k !== "resume" && typeof v === "string"),
  ) as Record<string, string>;
  const parsed = applicationSchema.safeParse({ ...fields, consent: fields.consent === "true" });

  const resume = form.get("resume");
  const fileError = resume instanceof File ? resumeError(resume) : "Please attach your resume.";

  if (!parsed.success || fileError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.success ? [] : parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    if (fileError) fieldErrors.resume = fileError;
    return NextResponse.json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CAREERS_TO_EMAIL || siteConfig.email;
  if (!apiKey) {
    console.error("[careers] RESEND_API_KEY is not set.");
    return NextResponse.json({ ok: false, error: FAIL }, { status: 503 });
  }

  const d = parsed.data;
  const file = resume as File;
  const rows = applicationRows(d);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;max-width:620px">
      <h2 style="margin:0 0 4px;font-size:18px">New job application</h2>
      <p style="margin:0 0 20px;color:#666;font-size:13px">Submitted via the ClassOne careers page. Resume attached.</p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border-bottom:1px solid #eee;color:#666;width:180px;vertical-align:top">${k}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escape(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "ClassOne Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      replyTo: d.email,
      subject: `Job application: ${d.fullName} (${d.position})`,
      html,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      attachments: [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }],
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[careers] Failed to send email:", err);
    return NextResponse.json({ ok: false, error: FAIL }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
