import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { MotionConfig } from "framer-motion";
import manifest from "@/lib/frames-manifest.json";
import { siteConfig } from "@/lib/site-config";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { JsonLd } from "@/components/ui/JsonLd";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = `ClassOne Consulting | People-Centred HR Consulting in ${siteConfig.city}`;

// Absolute URL: avoids the base path being applied twice on GitHub Pages.
const ogImage = {
  url: `${siteConfig.url}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "The ClassOne Consulting office building at night with red LED lines and the illuminated C1 logo.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "HR consulting",
    "HR advisory",
    "talent acquisition",
    "HR policies",
    "performance management",
    "learning and development",
    "HR operations",
    siteConfig.city,
    "ClassOne Consulting",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: manifest.background,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`} style={{ backgroundColor: manifest.background }}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-red focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <JsonLd />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionConfig>
      </body>
    </html>
  );
}
