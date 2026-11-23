import { z } from "zod";

export const SERVICE_OPTIONS = [
  "HR diagnostic and roadmap",
  "Defined HR project",
  "Ongoing HR advisory",
  "Not sure yet",
] as const;
export const SIZE_OPTIONS = ["1–10", "11–50", "51–200", "200+"] as const;
export const CONTACT_METHODS = ["Call", "WhatsApp", "Email"] as const;

/**
 * Indian mobile number: optional +91 / 91 / 0 prefix, then 10 digits starting
 * with 6–9. Spaces, dashes and brackets are allowed while typing.
 */
const INDIAN_MOBILE = /^(?:\+?91|0)?[6-9]\d{9}$/;

export function normaliseIndianMobile(raw: string): string {
  const digits = raw.replace(/[\s\-()]/g, "");
  const ten = digits.replace(/^(?:\+?91|0)/, "");
  return `+91${ten}`;
}

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  company: optionalText(120),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number.")
    .refine((v) => INDIAN_MOBILE.test(v.replace(/[\s\-()]/g, "")), {
      message: "Enter a valid Indian mobile number, e.g. +91 98765 43210.",
    }),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your work email.")
    .max(160)
    .pipe(z.email("Enter a valid email address.")),
  service: z.enum(SERVICE_OPTIONS).optional().or(z.literal("")),
  companySize: z.enum(SIZE_OPTIONS).optional().or(z.literal("")),
  message: optionalText(2000),
  contactMethod: z.enum(CONTACT_METHODS, { message: "Choose how we should contact you." }),
  // Honeypot: real users never see or fill this.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
