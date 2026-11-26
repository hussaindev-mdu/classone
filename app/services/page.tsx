import type { Metadata } from "next";
import { intro } from "@/lib/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Eleven HR services covering the complete employee lifecycle, from HR strategy, workforce planning and recruitment to payroll, performance, training, engagement and employee separation.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        title="Your complete HR consulting partner."
        intro={intro.positioningText}
        crumbs={[{ label: "Services" }]}
      />
      <Services index="01" id="all-services" />
      <Industries index="02" />
      <CtaBand />
    </>
  );
}
