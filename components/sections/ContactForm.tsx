"use client";

import { useId, useState, type ReactNode } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  contactSchema,
  CONTACT_METHODS,
  SERVICE_OPTIONS,
  SIZE_OPTIONS,
  type ContactData,
  type ContactInput,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/submit-contact";
import { EASE } from "@/lib/motion";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-3 text-base text-fg placeholder:text-white/30 transition-colors duration-600 ease-brand focus:outline-none focus:ring-0 focus-visible:outline-none";

function inputClass(invalid: boolean) {
  return `${inputBase} ${invalid ? "border-red-bright" : "border-white/20 hover:border-white/40 focus:border-red"}`;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label block !text-fg-body">
        {label}
        {required ? (
          <span className="text-red-bright" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal text-fg-muted"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-bright">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: unknown, hint?: boolean) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

const Chevron = () => (
  <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-fg-body" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m2 4 4 4 4-4" />
  </svg>
);

/** The success panel mounts after the form's exit animation; focus it then so screen readers announce it. */
const focusOnMount = (el: HTMLDivElement | null) => el?.focus();

export function ContactForm() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      company: "",
      phone: "",
      email: "",
      service: "",
      companySize: "",
      message: "",
      contactMethod: "Call",
      website: "",
    },
  });

  const onInvalid = (errs: FieldErrors<ContactInput>) => {
    const first = Object.keys(errs)[0] as keyof ContactInput | undefined;
    if (first) setFocus(first);
  };

  const onSubmit = async (data: ContactData) => {
    setStatus({ state: "submitting" });
    try {
      const body = await submitContact(data);

      if (body.ok) {
        setStatus({ state: "success" });
        reset();
        return;
      }

      if (body.fieldErrors) {
        for (const [name, message] of Object.entries(body.fieldErrors)) {
          if (message) setError(name as keyof ContactInput, { type: "server", message });
        }
      }
      // Input is intentionally kept so nothing has to be retyped.
      setStatus({
        state: "error",
        message: body.error ?? "Something went wrong sending your message. Please try again.",
      });
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
      {/* 45° corner accent */}
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
              <p className="label mb-5 !text-red-bright">Message received</p>
              <h3 className="display text-[clamp(2rem,4vw,3rem)]">Thank you. We&rsquo;ll be in touch.</h3>
              <p className="mt-5 max-w-md text-base leading-relaxed">
                A ClassOne consultant will contact you within one working day using your preferred method.
              </p>
            </div>
            <div className="mt-10">
              <Button type="button" variant="outline" onClick={() => setStatus({ state: "idle" })}>
                Send another message
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
            onSubmit={handleSubmit(onSubmit, onInvalid)}
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
                aria-required
                aria-invalid={!!errors.fullName}
                aria-describedby={describedBy(id("fullName"), errors.fullName)}
                className={inputClass(!!errors.fullName)}
                {...register("fullName")}
              />
            </Field>

            <Field id={id("company")} label="Company name" error={errors.company?.message}>
              <input
                id={id("company")}
                type="text"
                autoComplete="organization"
                aria-invalid={!!errors.company}
                aria-describedby={describedBy(id("company"), errors.company)}
                className={inputClass(!!errors.company)}
                {...register("company")}
              />
            </Field>

            <Field id={id("phone")} label="Mobile number" required error={errors.phone?.message} hint="Indian mobile, e.g. +91 98765 43210">
              <input
                id={id("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91"
                aria-required
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy(id("phone"), errors.phone, true)}
                className={inputClass(!!errors.phone)}
                {...register("phone")}
              />
            </Field>

            <Field id={id("email")} label="Work email" required error={errors.email?.message}>
              <input
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-required
                aria-invalid={!!errors.email}
                aria-describedby={describedBy(id("email"), errors.email)}
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
            </Field>

            <Field id={id("service")} label="Engagement type" error={errors.service?.message}>
              <div className="relative">
                <select
                  id={id("service")}
                  aria-invalid={!!errors.service}
                  aria-describedby={describedBy(id("service"), errors.service)}
                  className={`${inputClass(!!errors.service)} appearance-none pr-6 [&>option]:bg-charcoal`}
                  {...register("service")}
                >
                  <option value="">Select an option</option>
                  {SERVICE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </Field>

            <Field id={id("companySize")} label="Company size" error={errors.companySize?.message}>
              <div className="relative">
                <select
                  id={id("companySize")}
                  aria-invalid={!!errors.companySize}
                  aria-describedby={describedBy(id("companySize"), errors.companySize)}
                  className={`${inputClass(!!errors.companySize)} appearance-none pr-6 [&>option]:bg-charcoal`}
                  {...register("companySize")}
                >
                  <option value="">Select size</option>
                  {SIZE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o} employees
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </Field>

            <Field id={id("message")} label="Message" error={errors.message?.message} className="sm:col-span-2">
              <textarea
                id={id("message")}
                rows={4}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy(id("message"), errors.message)}
                placeholder="What would you like help with?"
                className={`${inputClass(!!errors.message)} resize-y`}
                {...register("message")}
              />
            </Field>

            <fieldset
              className="sm:col-span-2"
              aria-invalid={!!errors.contactMethod}
              aria-describedby={errors.contactMethod ? `${id("contactMethod")}-error` : undefined}
            >
              <legend className="label mb-4 !text-fg-body">
                Preferred contact method <span className="text-red-bright" aria-hidden>*</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {CONTACT_METHODS.map((m) => (
                  <label key={m} className="cursor-pointer">
                    <input type="radio" value={m} className="peer sr-only" {...register("contactMethod")} />
                    <span className="cut-corner block bg-white/[0.06] px-5 py-3 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg-body transition-colors duration-600 ease-brand hover:bg-white/[0.12] peer-checked:bg-red peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red-bright">
                      {m}
                    </span>
                  </label>
                ))}
              </div>
              {errors.contactMethod && (
                <p id={`${id("contactMethod")}-error`} className="mt-2 text-sm text-red-bright">
                  {errors.contactMethod.message}
                </p>
              )}
            </fieldset>

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("website")}>Website</label>
              <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" role="status" className="min-h-[1.5rem] text-sm">
                {status.state === "error" && <p className="text-red-bright">{status.message}</p>}
                {submitting && <span className="sr-only">Sending your message…</span>}
              </div>
              <Button type="submit" arrow={!submitting} disabled={submitting} aria-disabled={submitting} className="sm:min-w-[240px]">
                {submitting ? (
                  <>
                    <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  "Send enquiry"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
