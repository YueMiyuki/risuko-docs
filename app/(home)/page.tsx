import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { MetricsBanner } from "@/components/metrics-banner";
import { FeaturesGrid } from "@/components/features-grid";
import { CodeShowcase } from "@/components/code-showcase";

import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <MetricsBanner />
        <FeaturesGrid />
        <CodeShowcase />
      </main>
      <Footer />
    </div>
  );
}
