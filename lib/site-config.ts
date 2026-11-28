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
    "ClassOne Consulting is your complete HR consulting partner in Chennai. We help startups, SMEs and established organisations build structured HR functions and compliant, efficient people management practices.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.classoneconsulting.in", // PLACEHOLDER domain

  city: CITY,

  // Registered office / principal place of business (GST REG-06, MCA record).
  address: {
    street: "No. 4/568, 1st Cross Street, Lakshmi Nagar, Thoraipakkam",
    locality: CITY,
    region: "Tamil Nadu",
    postalCode: "600097",
    country: "IN",
  },

  // Statutory registration numbers (public; verifiable on mca.gov.in and gst.gov.in).
  // Do not publish PAN/TAN or certificate scans.
  registration: {
    cin: "U78300TN2026OPC200036",
    gstin: "33AAOCC4123B1Z7",
    incorporated: "2026-11-12",
  },

  phone: {
    display: "+91 90254 12330",
    tel: "+919025412330",
  },

  // General enquiries.
  email: "info@class1consulting.com",
  // Founder's direct address. Client wrote "class1conssulting.com" (double s); assumed typo. CONFIRM.
  founderEmail: "kumaran@class1consulting.com",

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
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;
