import type { Metadata } from "next";
import { FeatureSections } from "@/components/landing/feature-sections";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <FeatureSections />
      </main>
      <Footer />
    </div>
  );
}
