import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import "./home.css";
import { baseOptions } from "@/lib/layout.shared";

export const metadata: Metadata = {
  title: "Risuko - High-Performance Download Manager Built in Rust",
  description:
    "Risuko is a blazing-fast download manager built in Rust. Multi-threaded downloads, browser integration, CLI + GUI, and a powerful plugin system.",
  keywords: [
    "download manager",
    "rust",
    "fast downloads",
    "cli",
    "multi-threaded",
    "risuko",
  ],
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-sans antialiased">
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
      {process.env.NODE_ENV === "production" && <Analytics />}
    </div>
  );
}
