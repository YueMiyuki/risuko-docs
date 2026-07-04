import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";
import { termsContent } from "../terms.content";

export const metadata: Metadata = {
  title: "Terms of Service — Risuko",
  description:
    "The terms that govern your use of Risuko, the open-source download manager.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return <LegalDoc content={termsContent} />;
}
