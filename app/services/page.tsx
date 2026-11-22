import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Recruitment, assessment, learning & development, engagement, payroll, financial planning, compliance and performance strategy: eight services from one partner.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        title="Everything your business needs to grow."
        intro="We combine people strategy with financial clarity, so hiring, pay and planning move in the same direction."
        crumbs={[{ label: "Services" }]}
      />
      <Services index="01" id="all-services" />
      <Industries index="02" />
      <CtaBand />
    </>
  );
}
