import { applicationRows, type ApplicationData } from "./careers-schema";
import { IS_STATIC_EXPORT } from "./base-path";
import { siteConfig } from "./site-config";

export type ApplicationResult = { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

const FALLBACK = `We couldn't send your application right now. Please try again, or email your resume to ${siteConfig.email}.`;

/**
 * Sends a job application with the resume attached.
 *  - Server builds (Vercel): multipart POST to /api/careers (Resend with attachment).
 *  - Static export (GitHub Pages): multipart POST to Web3Forms. File attachments
 *    need a Web3Forms Pro access key; the key's inbox (info@) receives it.
 */
export async function submitApplication(data: ApplicationData, resume: File): Promise<ApplicationResult> {
  if (data.website) return { ok: true }; // honeypot

  if (!IS_STATIC_EXPORT) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) fd.append(k, String(v ?? ""));
    fd.append("resume", resume, resume.name);
    const res = await fetch("/api/careers", { method: "POST", body: fd });
    const body = (await res.json().catch(() => ({}))) as ApplicationResult;
    return res.ok && body.ok ? { ok: true } : { ok: false, error: body.error ?? FALLBACK, fieldErrors: body.fieldErrors };
  }

  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) {
    console.error("[careers] NEXT_PUBLIC_WEB3FORMS_KEY is not set for the static build.");
    return { ok: false, error: FALLBACK };
  }

  const fd = new FormData();
  fd.append("access_key", key);
  fd.append("subject", `Job application: ${data.fullName} (${data.position})`);
  fd.append("from_name", "ClassOne Website – Careers");
  fd.append("replyto", data.email);
  fd.append("botcheck", "");
  for (const [label, value] of applicationRows(data)) fd.append(label, value);
  fd.append("attachment", resume, resume.name);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    });
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (res.ok && body.success) return { ok: true };
    console.error("[careers] Web3Forms rejected the submission:", body.message);
  } catch (err) {
    console.error("[careers] Web3Forms request failed:", err);
  }
  return { ok: false, error: FALLBACK };
}
