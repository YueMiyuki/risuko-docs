"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CopyHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      title={hash}
      aria-label="Copy SHA-256 checksum"
      onClick={() => {
        navigator.clipboard.writeText(hash).then(
          () => {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
          },
          () => {},
        );
      }}
      className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      sha256:{hash.slice(0, 12)}…
      {copied ? (
        <Check className="size-3 text-primary" aria-hidden />
      ) : (
        <Copy className="size-3" aria-hidden />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}