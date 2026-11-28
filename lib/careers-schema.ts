import { z } from "zod";

export const EXPERIENCE_OPTIONS = ["Fresher", "Less than 2 years", "2–5 years", "5–10 years", "10+ years"] as const;
export const NOTICE_OPTIONS = ["Immediate", "15 days", "30 days", "60 days", "90 days"] as const;

/** Resume rules. 5 MB matches the Web3Forms Pro single-attachment limit. */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Returns an error message, or null when the file is acceptable. Used on client and server. */
export function resumeError(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || !file.name) return "Please attach your resume.";
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) return "Upload a PDF, DOC or DOCX file.";
  if (file.size === 0) return "This file looks empty. Please choose another.";
  if (file.size > RESUME_MAX_BYTES) return "Your resume must be 5 MB or smaller.";
  return null;
}

/** International-friendly phone: optional +, 7–15 digits, spaces/dashes/brackets allowed. */
const PHONE = /^\+?[\d\s\-()]{7,20}$/;
const digitCount = (v: string) => v.replace(/\D/g, "").length;

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

/** Text fields of the application (the resume file is validated with `resumeError`). */
export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
  email: z.string().trim().min(1, "Please enter your email.").max(160).pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number.")
    .refine((v) => PHONE.test(v) && digitCount(v) >= 7 && digitCount(v) <= 15, {
      message: "Enter a valid phone number, e.g. +91 98765 43210.",
    }),
  location: z.string().trim().min(2, "Please enter your current location.").max(100),
  position: z.string().trim().min(2, "Please tell us the role or area you're interested in.").max(120),
  experience: z.enum(EXPERIENCE_OPTIONS, { message: "Please choose your experience." }),
  noticePeriod: z.enum(NOTICE_OPTIONS).optional().or(z.literal("")),
  linkedin: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), { message: "Enter a full link starting with https://" })
    .optional(),
  message: optionalText(2000),
  consent: z.literal(true, { message: "Please confirm so we can process your application." }),
  // Honeypot: real users never see or fill this.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;

/** Label/value rows for the notification email. */
export function applicationRows(d: ApplicationData): [string, string][] {
  return [
    ["Full name", d.fullName],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Current location", d.location],
    ["Role / area of interest", d.position],
    ["Total experience", d.experience],
    ["Notice period", d.noticePeriod || "—"],
    ["LinkedIn", d.linkedin || "—"],
    ["Message", d.message || "—"],
  ];
}
