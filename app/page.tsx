import type { Metadata } from "next";
import { StaticHero } from "@/components/sections/StaticHero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WhyClassOne } from "@/components/sections/WhyClassOne";
import { Numbers } from "@/components/sections/Numbers";
// import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <StaticHero />
      <About index="01" moreLink />
      <Services index="02" />
      <WhyClassOne index="03" />
      <Numbers />
      {/* <Testimonials sectionIndex="04" /> */}
      <CtaBand />
    </>
  );
}
