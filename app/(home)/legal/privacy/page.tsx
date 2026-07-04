import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";
import { privacyContent } from "../privacy.content";

export const metadata: Metadata = {
  title: "Privacy Policy — Risuko",
  description:
    "How Risuko handles your data: local-first with no telemetry, plus optional account-based cloud sync and peer-to-peer file sharing.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return <LegalDoc content={privacyContent} />;
}
