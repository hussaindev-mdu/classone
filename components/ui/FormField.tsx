import type { ReactNode } from "react";

/** Shared form building blocks (contact and careers forms). */

const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-3 text-base text-fg placeholder:text-white/30 transition-colors duration-600 ease-brand focus:outline-none focus:ring-0 focus-visible:outline-none";

export function inputClass(invalid: boolean) {
  return `${inputBase} ${invalid ? "border-red-bright" : "border-white/20 hover:border-white/40 focus:border-red"}`;
}

export function Field({
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

export function describedBy(id: string, error?: unknown, hint?: boolean) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

export const SelectChevron = () => (
  <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-fg-body" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m2 4 4 4 4-4" />
  </svg>
);

