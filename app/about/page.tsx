import type { Metadata } from "next";
import { intro } from "@/lib/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { VisionMission } from "@/components/sections/VisionMission";
import { Founder } from "@/components/sections/Founder";
import { WhyClassOne } from "@/components/sections/WhyClassOne";
import { Numbers } from "@/components/sections/Numbers";
import { Industries } from "@/components/sections/Industries";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "ClassOne Consulting is a founder-led HR consulting practice in Chennai, shaped by more than 14 years of HR experience across India and the UAE.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About ClassOne"
        title="People-centred HR consulting."
        intro={intro.experience}
        crumbs={[{ label: "About" }]}
      />
      <About index="01" />
      <VisionMission />
      <Founder index="02" />
      <WhyClassOne index="03" />
      <Numbers />
      <Industries index="04" />
      <Testimonials sectionIndex="05" />
      <CtaBand />
    </>
  );
}
