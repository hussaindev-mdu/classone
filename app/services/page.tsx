import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Talent acquisition, HR policies and compliance, performance and employee relations, learning and development, compensation and payroll, and HR operations: HR consulting across the lifecycle.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        title="HR consulting services."
        intro="Practical HR partnership for stronger, more capable workplaces."
        crumbs={[{ label: "Services" }]}
      />
      <Services index="01" id="all-services" />
      <Industries index="02" />
      <CtaBand />
    </>
  );
}
