"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

export function CopyCommand({
  command,
  variant = "pill",
  className,
}: {
  command: string;
  variant?: "pill" | "plain";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const plain = variant === "plain";

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      className={cx(
        "flex items-center gap-3",
        plain
          ? "rounded-md border border-border py-1 pr-1 pl-3.5"
          : "rounded-full border border-border/70 bg-background/60 py-2 pr-2 pl-5",
        className,
      )}
    >
      <span
        className={cx(
          "select-none font-mono text-sm",
          plain ? "text-muted-foreground" : "text-primary",
        )}
        aria-hidden
      >
        $
      </span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap py-1 font-mono text-sm text-foreground/90 [scrollbar-width:none]">
        {command}
      </code>
      <button
        type="button"
        aria-label={`Copy command: ${command}`}
        onClick={() => {
          navigator.clipboard.writeText(command).then(
            () => {
              setCopied(true);
              setBurst((n) => n + 1);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setCopied(false), 2000);
            },
            () => {},
          );
        }}
        className={cx(
          "relative shrink-0 p-2 text-muted-foreground transition-[color,background-color,transform] hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90",
          plain ? "rounded-[5px]" : "rounded-full",
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {burst > 0 && !plain ? (
          <span key={burst} aria-hidden className="copy-burst">
            {SPARKS.map((deg) => (
              <span
                key={deg}
                style={{ "--a": `${deg}deg` } as React.CSSProperties}
              />
            ))}
          </span>
        ) : null}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
