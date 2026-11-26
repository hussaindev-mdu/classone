import { siteConfig } from "@/lib/site-config";
import { allServices, founder } from "@/lib/content";

/** ProfessionalService structured data built from site-config.ts. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    taxID: siteConfig.registration.gstin,
    identifier: { "@type": "PropertyValue", propertyID: "CIN", value: siteConfig.registration.cin },
    foundingDate: siteConfig.registration.incorporated,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og-image.jpg`,
    telephone: siteConfig.phone.tel,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      ...(siteConfig.address.postalCode ? { postalCode: siteConfig.address.postalCode } : {}),
      addressCountry: siteConfig.address.country,
    },
    areaServed: { "@type": "Country", name: "India" },
    openingHours: siteConfig.hours,
    founder: { "@type": "Person", name: founder.name, jobTitle: founder.role },
    sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: allServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
