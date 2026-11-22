import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { WhyClassOne } from "@/components/sections/WhyClassOne";
import { Numbers } from "@/components/sections/Numbers";
import { Industries } from "@/components/sections/Industries";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "ClassOne Consulting brings HR consulting and financial advisory together under one accountable partner for growing businesses in Chennai.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About ClassOne"
        title="Built on strong foundations."
        intro="Strategy, structure and compliance sit behind every engagement, so the decisions you build on them hold."
        crumbs={[{ label: "About" }]}
      />
      <About index="01" />
      <WhyClassOne index="02" />
      <Numbers />
      <Industries index="03" />
      <Testimonials sectionIndex="04" />
      <CtaBand />
    </>
  );
}
