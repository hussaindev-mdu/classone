/**
 * Single source of truth for ClassOne contact details and links.
 *
 * TODO before launch: replace every value marked PLACEHOLDER.
 * These values feed the nav, footer, contact section, WhatsApp button,
 * page metadata and the ProfessionalService JSON-LD.
 */

const CITY = "Chennai";

export const siteConfig = {
  name: "ClassOne Consulting",
  shortName: "ClassOne",
  tagline: "People. Performance. Progress.",
  descriptor: "HR Consulting | Financial Advisory",
  description:
    "ClassOne Consulting is an HR consulting and financial advisory firm helping growing businesses hire better, stay compliant and plan with financial clarity.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.classoneconsulting.in", // PLACEHOLDER domain

  city: CITY,

  // PLACEHOLDER: full street address.
  address: {
    street: "[Street address]",
    locality: CITY,
    region: "Tamil Nadu",
    postalCode: "[PIN]",
    country: "IN",
  },

  // PLACEHOLDER: display phone and the tel: version (E.164).
  phone: {
    display: "+91 XXXXX XXXXX",
    tel: "+91XXXXXXXXXX",
  },

  // PLACEHOLDER: public email address shown on the site.
  email: "hello@classoneconsulting.in",

  whatsapp: {
    // Digits only, with country code.
    number: "919025412330",
    message:
      "Hi ClassOne, I'd like to discuss HR / financial advisory services for my business.",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/classone-consulting", // PLACEHOLDER
    instagram: "https://www.instagram.com/classoneconsulting", // PLACEHOLDER
  },

  // Optional: business hours for JSON-LD. PLACEHOLDER.
  hours: "Mo-Sa 09:30-18:30",
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
  siteConfig.whatsapp.message,
)}`;

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;
