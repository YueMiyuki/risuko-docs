import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { FeatureSections } from "@/components/landing/feature-sections";
import { displayFont } from "@/components/landing/fonts";
import { Hero } from "@/components/landing/hero";
import { cn } from "@/lib/cn";
import "./landing.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div
      className={cn(
        "landing min-h-screen bg-background text-foreground",
        displayFont.variable,
      )}
    >
      <Hero />
      <FeatureSections />
      <Footer cta={false} />
    </div>
  );
}
