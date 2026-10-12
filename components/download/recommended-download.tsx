"use client";

import { ArrowDown, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonPrimary, buttonSecondary } from "@/components/landing/styles";
import type { RecommendKey } from "@/lib/release";

export type RecommendOption = {
  platform: string;
  detail: string;
  url: string;
};

type Detected = { key: RecommendKey; sure: boolean };

type UserAgentData = {
  getHighEntropyValues?: (
    hints: string[],
  ) => Promise<{ architecture?: string }>;
};

async function detect(): Promise<Detected | null> {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return { key: "android", sure: true };
  if (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  ) {
    return null;
  }

  let arch: string | undefined;
  try {
    const uaData = (navigator as Navigator & { userAgentData?: UserAgentData })
      .userAgentData;
    arch = (await uaData?.getHighEntropyValues?.(["architecture"]))
      ?.architecture;
  } catch {}

  if (/mac/i.test(ua)) {
    if (arch === "x86") return { key: "mac-x64", sure: true };
    return { key: "mac-arm64", sure: arch === "arm" };
  }
  if (/windows/i.test(ua)) return { key: "windows", sure: true };
  if (/linux|x11/i.test(ua)) {
    const arm = arch === "arm" || /aarch64|arm64/i.test(ua);
    return { key: arm ? "linux-arm64" : "linux-x64", sure: true };
  }
  return null;
}

export function RecommendedDownload({
  options,
}: {
  options: Partial<Record<RecommendKey, RecommendOption>>;
}) {
  const [detected, setDetected] = useState<Detected | null>(null);

  useEffect(() => {
    let live = true;
    detect().then((result) => {
      if (live) setDetected(result);
    });
    return () => {
      live = false;
    };
  }, []);

  const option = detected ? options[detected.key] : undefined;
  const intel =
    detected?.key === "mac-arm64" && !detected.sure
      ? options["mac-x64"]
      : undefined;

  if (!option) {
    return (
      <a href="#platforms" className={buttonPrimary}>
        <ArrowDown className="h-4 w-4" />
        Choose your platform
      </a>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a href={option.url} className={buttonPrimary}>
          <Download className="h-4 w-4" />
          Download for {option.platform}
        </a>
        <a href="#platforms" className={buttonSecondary}>
          Other platforms
        </a>
      </div>
      <p className="mt-3 pl-1 text-sm text-muted-foreground">
        {option.detail}
        {intel ? (
          <>
            {" · "}
            <a
              href={intel.url}
              className="font-medium text-primary hover:underline"
            >
              Intel Mac?
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}
