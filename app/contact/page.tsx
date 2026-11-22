import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a consultation with ClassOne Consulting, Chennai. HR consulting and financial advisory for growing businesses.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-12 md:pt-16">
      <Contact index="" headingLevel="h1" />
    </div>
  );
}
