"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3",
        className,
      )}
    >
      <span className="select-none font-mono text-sm text-primary" aria-hidden>
        $
      </span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground/90">
        {command}
      </code>
      <button
        type="button"
        aria-label={`Copy command: ${command}`}
        onClick={() => {
          navigator.clipboard.writeText(command);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
