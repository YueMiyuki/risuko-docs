"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type PointerEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/cn";

export function SpotlightGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const grid = ref.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    grid.style.setProperty("--x", `${e.clientX - rect.left}px`);
    grid.style.setProperty("--y", `${e.clientY - rect.top}px`);
    grid.style.setProperty("--glow", "1");

    const cell = (e.target as HTMLElement).closest<HTMLElement>(
      ".spotlight-cell-inner",
    );
    if (cell) {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--cx", `${e.clientX - r.left}px`);
      cell.style.setProperty("--cy", `${e.clientY - r.top}px`);
    }
  }

  function handleLeave() {
    ref.current?.style.setProperty("--glow", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("spotlight-grid", className)}
    >
      {children}
    </div>
  );
}

export function SpotlightCell({
  href,
  icon,
  title,
  text,
  art,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
  art?: ReactNode;
}) {
  return (
    <Link href={href} className="spotlight-cell group">
      <span className="spotlight-cell-inner">
        {art ?? (
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-background/60 text-primary transition-colors group-hover:border-primary/50">
            {icon}
          </span>
        )}
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          {art ? (
            <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          ) : null}
          {title}
          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
        <span className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {text}
        </span>
      </span>
    </Link>
  );
}
