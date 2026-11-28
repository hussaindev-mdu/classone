"use client";

import { useId, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  applicationSchema,
  EXPERIENCE_OPTIONS,
  NOTICE_OPTIONS,
  RESUME_ACCEPT,
  resumeError,
  type ApplicationData,
  type ApplicationInput,
} from "@/lib/careers-schema";
import { submitApplication } from "@/lib/submit-application";
import { Button } from "@/components/ui/Button";
import { Field, inputClass, describedBy, SelectChevron } from "@/components/ui/FormField";
import { EASE } from "@/lib/motion";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const focusOnMount = (el: HTMLDivElement | null) => el?.focus();

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function CareersForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeErr, setResumeErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ApplicationInput, unknown, ApplicationData>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      position: "",
      noticePeriod: "",
      linkedin: "",
      message: "",
      website: "",
    },
  });

  const pickFile = (file: File | null) => {
    setResume(file);
    setResumeErr(file ? resumeError(file) : null);
  };

  const clearFile = () => {
    pickFile(null);
    if (fileRef.current) fileRef.current.value = "";
    fileRef.current?.focus();
  };

  const onInvalid = (errs: FieldErrors<ApplicationInput>) => {
    const fileProblem = resumeError(resume);
    setResumeErr(fileProblem);
    const first = Object.keys(errs)[0] as keyof ApplicationInput | undefined;
    if (first) setFocus(first);
    else if (fileProblem) fileRef.current?.focus();
  };

  const onSubmit = async (data: ApplicationData) => {
    const fileProblem = resumeError(resume);
    if (fileProblem || !resume) {
      setResumeErr(fileProblem);
      fileRef.current?.focus();
      return;
    }
    setStatus({ state: "submitting" });
    try {
      const result = await submitApplication(data, resume);
      if (result.ok) {
        setStatus({ state: "success" });
        reset();
        clearFile();
        return;
      }
      for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
        if (name === "resume") setResumeErr(message);
        else setError(name as keyof ApplicationInput, { type: "server", message });
      }
      setStatus({ state: "error", message: result.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({
        state: "error",
        message: "We couldn't reach the server. Check your connection and try again. Your details are still here.",
      });
    }
  };

  const submitting = status.state === "submitting";

  return (
    <div className="relative bg-charcoal p-6 sm:p-10 lg:p-12">
      <span aria-hidden className="absolute right-0 top-0 h-0 w-0 border-l-[28px] border-t-[28px] border-l-transparent border-t-red" />

      <AnimatePresence mode="wait" initial={false}>
        {status.state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex min-h-[420px] flex-col justify-center"
          >
            <div ref={focusOnMount} tabIndex={-1} role="status" aria-live="polite" className="focus:outline-none">
              <p className="label mb-5 !text-red-bright">Application received</p>
              <h3 className="display text-[clamp(2rem,4vw,3rem)]">Thank you for applying.</h3>
              <p className="mt-5 max-w-md text-base leading-relaxed">
                We&rsquo;ve received your details and resume. If your profile matches a current or upcoming opportunity,
                we&rsquo;ll get in touch.
              </p>
            </div>
            <div className="mt-10">
              <Button type="button" variant="outline" onClick={() => setStatus({ state: "idle" })}>
                Submit another application
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            noValidate
            onSubmit={(e) => handleSubmit(onSubmit, onInvalid)(e)}
            aria-describedby={`${uid}-required-note`}
            className="grid gap-x-8 gap-y-8 sm:grid-cols-2"
          >
            <p id={`${uid}-required-note`} className="text-xs text-fg-muted sm:col-span-2">
              Fields marked <span className="text-red-bright">*</span> are required.
            </p>

            <Field id={id("fullName")} label="Full name" required error={errors.fullName?.message}>
              <input
                id={id("fullName")}
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                aria-describedby={describedBy(id("fullName"), errors.fullName)}
                className={inputClass(!!errors.fullName)}
                {...register("fullName")}
              />
            </Field>

            <Field id={id("email")} label="Email" required error={errors.email?.message}>
              <input
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy(id("email"), errors.email)}
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
            </Field>

            <Field id={id("phone")} label="Mobile number" required error={errors.phone?.message} hint="Include country code, e.g. +91 98765 43210">
              <input
                id={id("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy(id("phone"), errors.phone, true)}
                className={inputClass(!!errors.phone)}
                {...register("phone")}
              />
            </Field>

            <Field id={id("location")} label="Current location" required error={errors.location?.message}>
              <input
                id={id("location")}
                type="text"
                autoComplete="address-level2"
                placeholder="City, Country"
                aria-invalid={!!errors.location}
                aria-describedby={describedBy(id("location"), errors.location)}
                className={inputClass(!!errors.location)}
                {...register("location")}
              />
            </Field>

            <Field id={id("position")} label="Role / area of interest" required error={errors.position?.message} className="sm:col-span-2">
              <input
                id={id("position")}
                type="text"
                placeholder="e.g. HR Executive, Payroll Specialist, Sales Manager"
                aria-invalid={!!errors.position}
                aria-describedby={describedBy(id("position"), errors.position)}
                className={inputClass(!!errors.position)}
                {...register("position")}
              />
            </Field>

            <Field id={id("experience")} label="Total experience" required error={errors.experience?.message}>
              <div className="relative">
                <select
                  id={id("experience")}
                  defaultValue=""
                  aria-invalid={!!errors.experience}
                  aria-describedby={describedBy(id("experience"), errors.experience)}
                  className={`${inputClass(!!errors.experience)} appearance-none pr-6 [&>option]:bg-charcoal`}
                  {...register("experience")}
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>

            <Field id={id("noticePeriod")} label="Notice period" error={errors.noticePeriod?.message}>
              <div className="relative">
                <select
                  id={id("noticePeriod")}
                  aria-invalid={!!errors.noticePeriod}
                  aria-describedby={describedBy(id("noticePeriod"), errors.noticePeriod)}
                  className={`${inputClass(!!errors.noticePeriod)} appearance-none pr-6 [&>option]:bg-charcoal`}
                  {...register("noticePeriod")}
                >
                  <option value="">Select notice period</option>
                  {NOTICE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </Field>

            <Field id={id("linkedin")} label="LinkedIn profile" error={errors.linkedin?.message} className="sm:col-span-2">
              <input
                id={id("linkedin")}
                type="url"
                inputMode="url"
                placeholder="https://www.linkedin.com/in/your-name"
                aria-invalid={!!errors.linkedin}
                aria-describedby={describedBy(id("linkedin"), errors.linkedin)}
                className={inputClass(!!errors.linkedin)}
                {...register("linkedin")}
              />
            </Field>

            {/* Resume upload: the native input covers the drop zone, so click, keyboard and drag-and-drop all work. */}
            <div className="sm:col-span-2">
              <p id={id("resume-label")} className="label block !text-fg-body">
                Resume <span className="text-red-bright" aria-hidden>*</span>
              </p>
              <div
                className={`relative mt-3 flex flex-col gap-3 border border-dashed px-5 py-6 transition-colors duration-600 ease-brand focus-within:border-red sm:flex-row sm:items-center sm:justify-between ${
                  resumeErr ? "border-red-bright" : "border-white/25 hover:border-white/50"
                }`}
              >
                <input
                  ref={fileRef}
                  id={id("resume")}
                  type="file"
                  accept={RESUME_ACCEPT}
                  aria-labelledby={id("resume-label")}
                  aria-invalid={!!resumeErr}
                  aria-describedby={resumeErr ? `${id("resume")}-error` : `${id("resume")}-hint`}
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div className="pointer-events-none flex items-center gap-4">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-red" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                    <path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3" />
                  </svg>
                  {resume ? (
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] text-fg">{resume.name}</span>
                      <span className="block text-xs text-fg-muted">{formatSize(resume.size)}</span>
                    </span>
                  ) : (
                    <span className="text-[15px] text-fg-body">
                      <span className="text-fg">Choose a file</span> or drag it here
                    </span>
                  )}
                </div>
                {resume && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="relative z-10 self-start font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg-body hover:text-red-bright sm:self-auto"
                  >
                    Remove
                  </button>
                )}
              </div>
              {resumeErr ? (
                <p id={`${id("resume")}-error`} className="mt-2 text-sm text-red-bright">
                  {resumeErr}
                </p>
              ) : (
                <p id={`${id("resume")}-hint`} className="mt-2 text-xs text-fg-muted">
                  PDF, DOC or DOCX, up to 5 MB.
                </p>
              )}
            </div>

            <Field id={id("message")} label="Anything else we should know?" error={errors.message?.message} className="sm:col-span-2">
              <textarea
                id={id("message")}
                rows={3}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy(id("message"), errors.message)}
                className={`${inputClass(!!errors.message)} resize-y`}
                {...register("message")}
              />
            </Field>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed">
                <input
                  type="checkbox"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#CD171F]"
                  {...register("consent")}
                />
                <span>
                  I agree to ClassOne Consulting storing and using my details and resume to contact me about job
                  opportunities. <span className="text-red-bright" aria-hidden>*</span>
                </span>
              </label>
              {errors.consent && (
                <p id={`${id("consent")}-error`} className="mt-2 text-sm text-red-bright">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("website")}>Website</label>
              <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" role="status" className="min-h-[1.5rem] text-sm">
                {status.state === "error" && <p className="text-red-bright">{status.message}</p>}
                {submitting && <span className="sr-only">Sending your application…</span>}
              </div>
              <Button type="submit" arrow={!submitting} disabled={submitting} aria-disabled={submitting} className="sm:min-w-[240px]">
                {submitting ? (
                  <>
                    <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  "Submit application"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
