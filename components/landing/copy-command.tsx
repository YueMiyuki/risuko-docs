"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border border-border/70 bg-background/60 py-2 pr-2 pl-5",
        className,
      )}
    >
      <span className="select-none font-mono text-sm text-primary" aria-hidden>
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
        className="relative shrink-0 rounded-full p-2 text-muted-foreground transition-[color,background-color,transform] hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90"
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {burst > 0 ? (
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
