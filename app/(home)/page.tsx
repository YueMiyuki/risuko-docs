import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Home } from "@/components/landing/home";
import { Paper } from "@/components/landing/paper";
import { homeJsonLd, JsonLd, openGraph } from "@/lib/seo";
import "./paper.css";

const title = "Risuko — Open-Source Download Manager Built in Rust";
const description =
  "Free, open-source download manager built in Rust. HTTP, BitTorrent, Usenet, ED2K, HLS and FTP in one queue, with a desktop app, CLI and Node.js API.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: openGraph({ url: "/", title, description }),
};

export default function HomePage() {
  return (
    <Paper>
      <JsonLd data={homeJsonLd()} />
      <Home />
      <Footer cta={false} wide />
    </Paper>
  );
}
