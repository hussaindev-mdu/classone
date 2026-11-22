import type { ContactData, ContactInput } from "./contact-schema";
import { normaliseIndianMobile } from "./contact-schema";
import { IS_STATIC_EXPORT } from "./base-path";

export type SubmitResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
};

const UNAVAILABLE = "Our contact form is temporarily unavailable. Please call or WhatsApp us instead.";

/**
 * Sends a validated enquiry.
 *  - Server builds (Vercel): POST /api/contact (Resend, server validation, rate limit).
 *  - Static export (GitHub Pages): no server, so POST to Web3Forms, which emails
 *    the owner. NEXT_PUBLIC_WEB3FORMS_KEY is a public access key by design.
 */
export async function submitContact(data: ContactData): Promise<SubmitResult> {
  if (!IS_STATIC_EXPORT) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as SubmitResult;
    return { ...body, ok: res.ok && !!body.ok };
  }

  // Honeypot filled: pretend success, send nothing.
  if (data.website) return { ok: true };

  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) {
    console.error("[contact] NEXT_PUBLIC_WEB3FORMS_KEY is not set for the static build.");
    return { ok: false, error: UNAVAILABLE };
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `New enquiry: ${data.fullName}${data.company ? ` (${data.company})` : ""}`,
      from_name: "ClassOne Website",
      replyto: data.email,
      botcheck: "",
      "Full name": data.fullName,
      Company: data.company || "—",
      Phone: normaliseIndianMobile(data.phone),
      Email: data.email,
      "Service needed": data.service || "—",
      "Company size": data.companySize || "—",
      "Preferred contact": data.contactMethod,
      Message: data.message || "—",
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (res.ok && body.success) return { ok: true };
  return { ok: false, error: "We couldn't send your message right now. Please try again, or call or WhatsApp us." };
}
