import { Footer } from "@/components/footer";
import { TerminalSession } from "@/components/terminal-session";

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
