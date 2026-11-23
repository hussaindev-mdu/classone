/**
 * Single source of truth for ClassOne contact details and links.
 *
 * Details from the ClassOne company profile. Values marked PLACEHOLDER still need confirming.
 * These values feed the nav, footer, contact section, WhatsApp button,
 * page metadata and the ProfessionalService JSON-LD.
 */

const CITY = "Chennai";

export const siteConfig = {
  name: "ClassOne Consulting",
  legalName: "ClassOne Consulting (OPC) Private Limited",
  shortName: "ClassOne",
  tagline: "People. Performance. Progress.",
  descriptor: "People-Centred HR Consulting",
  description:
    "ClassOne Consulting is a founder-led HR consulting firm in Chennai helping organizations build clear, consistent and people-centred HR practices, shaped by more than 14 years of experience across India and the UAE.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.classoneconsulting.in", // PLACEHOLDER domain

  city: CITY,

  // Add street and postalCode when available; empty values are skipped on the site.
  address: {
    street: "",
    locality: CITY,
    region: "Tamil Nadu",
    postalCode: "",
    country: "IN",
  },

  phone: {
    display: "+91 90254 12330",
    tel: "+919025412330",
  },

  email: "classoneconsult.hr@gmail.com",

  whatsapp: {
    // Digits only, with country code.
    number: "919025412330",
    message:
      "Hi ClassOne, I'd like to discuss HR consulting support for my business.",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/classone-consulting-opc-private-limited",
    instagram: "https://www.instagram.com/classoneconsulting", // PLACEHOLDER
  },

  // Optional: business hours for JSON-LD. PLACEHOLDER.
  hours: "Mo-Sa 09:30-18:30",
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
  siteConfig.whatsapp.message,
)}`;

/** "Chennai, Tamil Nadu, India" plus street / PIN when they are filled in. */
export const addressLine = [
  siteConfig.address.street,
  siteConfig.address.locality,
  [siteConfig.address.region, siteConfig.address.postalCode].filter(Boolean).join(" "),
  "India",
]
  .filter(Boolean)
  .join(", ");

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;
