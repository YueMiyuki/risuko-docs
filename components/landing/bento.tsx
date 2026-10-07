"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type PointerEvent, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (
      !grid ||
      !matchMedia("(hover: none)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-live", entry.isIntersecting);
        }
      },
      { threshold: 0.7 },
    );
    for (const tile of grid.querySelectorAll(".bento-tile")) io.observe(tile);
    return () => io.disconnect();
  }, []);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const tile = (e.target as HTMLElement).closest<HTMLElement>(".bento-tile");
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--cx", `${e.clientX - r.left}px`);
    tile.style.setProperty("--cy", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={cn("grid gap-3 sm:gap-4", className)}
    >
      {children}
    </div>
  );
}

export function BentoTile({
  href,
  icon,
  title,
  text,
  art,
  tone = "card",
  className,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
  art?: ReactNode;
  tone?: "card" | "accent" | "dots";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("bento-tile group", `bento-${tone}`, className)}
    >
      {art ?? (
        <span className="bento-icon mb-8 flex h-11 w-11 items-center justify-center rounded-2xl [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      )}
      <span className="mt-auto flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.01em]">
        {art ? (
          <span className="bento-icon-inline [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        ) : null}
        {title}
        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100" />
      </span>
      <span className="bento-text mt-1.5 text-sm leading-relaxed">{text}</span>
    </Link>
  );
}
