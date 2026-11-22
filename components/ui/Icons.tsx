/** Simple 1.5px line icons. */
type P = { className?: string };
const base = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

export const PartnerIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="10" r="4" />
    <circle cx="21" cy="10" r="4" />
    <path d="M3 26c0-4.4 3.6-8 8-8 2 0 3.8.7 5 1.9A7.9 7.9 0 0 1 21 18c4.4 0 8 3.6 8 8" />
  </svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M16 3 5 7v8c0 7 4.7 11.8 11 14 6.3-2.2 11-7 11-14V7Z" />
    <path d="m11 16 3.5 3.5L21 13" />
  </svg>
);
export const ChartIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 28h24M8 23v-6M14 23V12M20 23v-8M26 23V6" />
  </svg>
);
export const PersonIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="16" cy="10" r="5" />
    <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    <path d="m22 4 3 3-3 3" />
  </svg>
);

export const LinkedInIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm7 0h3.8v1.6h.06c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.5 4.79 5.76V21h-4v-5.15c0-1.23-.02-2.8-1.75-2.8-1.75 0-2.02 1.33-2.02 2.71V21H10V9.75Z" />
  </svg>
);
export const InstagramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
    <path d="M16.004 3C8.832 3 3.002 8.83 3.002 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.004 29C23.17 29 29 23.17 29 16S23.17 3 16.004 3Zm0 23.73c-1.98 0-3.92-.53-5.61-1.53l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.67 10.67 0 0 1 5.27 16c0-5.92 4.82-10.73 10.74-10.73 5.91 0 10.72 4.81 10.72 10.73 0 5.92-4.81 10.73-10.73 10.73Zm5.88-8.03c-.32-.16-1.91-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);
