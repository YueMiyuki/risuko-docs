"use client";

import {
  AlertTriangle,
  Ban,
  Clock,
  Cloud,
  Cookie,
  Database,
  Download,
  EyeOff,
  FileCheck,
  Info,
  Lock,
  type LucideIcon,
  Mail,
  RefreshCw,
  Scale,
  Server,
  Share2,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/cn";

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  "file-check": FileCheck,
  shield: ShieldCheck,
  warning: AlertTriangle,
  ban: Ban,
  refresh: RefreshCw,
  x: XCircle,
  mail: Mail,
  server: Server,
  lock: Lock,
  database: Database,
  "eye-off": EyeOff,
  user: User,
  cloud: Cloud,
  cookie: Cookie,
  download: Download,
  share: Share2,
  clock: Clock,
};

export type Locale = "en" | "zh-CN" | "zh-TW";

export type LegalSection = {
  id: string;
  icon: keyof typeof iconMap;
  title: string;
  summary: string;
  body: React.ReactNode;
};

export type LocaleDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/** One document, translated into each supported locale (same section ids). */
export type LegalContent = Record<Locale, LocaleDoc>;

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];

// UI chrome strings + the authoritative-version notice (only on the translations).
const UI: Record<
  Locale,
  {
    eyebrow: string;
    inShort: string;
    updated: string;
    disclaimer: string;
    notice?: string;
  }
> = {
  en: {
    eyebrow: "Legal",
    inShort: "In short",
    updated: "Last updated",
    disclaimer:
      "This document is provided in good faith for an open-source project and is not legal advice.",
  },
  "zh-CN": {
    eyebrow: "法律",
    inShort: "摘要",
    updated: "最后更新",
    disclaimer: "本文档为开源项目本着诚信提供，不构成法律意见。",
    notice:
      "本中文翻译仅供参考。如中英文版本之间存在任何差异或歧义，概以英文版本为准。",
  },
  "zh-TW": {
    eyebrow: "法律",
    inShort: "摘要",
    updated: "最後更新",
    disclaimer: "本文件為開源專案本著誠信提供，不構成法律意見。",
    notice:
      "本中文翻譯僅供參考。如中英文版本之間存在任何差異或歧義，概以英文版本為準。",
  },
};

function isLocale(v: string | null): v is Locale {
  return v === "en" || v === "zh-CN" || v === "zh-TW";
}

export function LegalDoc({ content }: { content: LegalContent }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  // Honour a ?lang deep link on first load (page itself stays static).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (isLocale(param)) {
      setLocale(param);
    }
  }, []);

  const switchLocale = (next: Locale) => {
    setLocale(next);
    const url = new URL(window.location.href);
    if (next === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", next);
    }
    window.history.replaceState(null, "", url.toString());
  };

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const doc = content[locale];
  const ui = UI[locale];

  // Re-observe when the rendered sections change (locale switch).
  useEffect(() => {
    const sections = content[locale].sections;
    setActiveId(sections[0]?.id ?? "");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [locale, content]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 z-50 h-0.5">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-border pb-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {ui.eyebrow}
            </p>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    locale === l.code
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {doc.intro}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            {ui.updated}: {doc.updated}
          </span>
        </header>

        {ui.notice && (
          <div className="mb-10 flex items-start gap-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{ui.notice}</p>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <nav className="mb-10 hidden lg:block">
            <ul className="sticky top-24 space-y-1">
              {doc.sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors",
                      activeId === section.id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="mr-2 font-mono text-xs opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {doc.sections.map((section, i) => {
              const Icon = iconMap[section.icon] ?? ShieldCheck;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
                      <Icon className="size-4" />
                    </span>
                    <h2 className="text-xl font-semibold tracking-tight">
                      <span className="mr-2 font-mono text-sm text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </h2>
                  </div>
                  <div className="mb-4 rounded-lg bg-muted px-4 py-3">
                    <span className="font-mono text-xs font-medium uppercase tracking-wide text-primary">
                      {ui.inShort}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.summary}
                    </p>
                  </div>
                  <div className="space-y-3 leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_strong]:font-medium [&_strong]:text-foreground">
                    {section.body}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <p className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
          {ui.disclaimer}
        </p>
      </div>
      <Footer />
    </div>
  );
}
