import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { TerminalSession } from "@/components/terminal-session";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <TerminalSession />
      </main>
      <Footer />
    </div>
  );
}
