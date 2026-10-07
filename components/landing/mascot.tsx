"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";

export function Mascot({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const gradId = `mascot-grad-${useId()}`;
  const grad = `url(#${gradId})`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const look = () => {
      raf = 0;
      const r = svg.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const dx = x - (r.left + (r.width * 12) / 32);
      const dy = y - (r.top + (r.height * 13) / 24);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 220);
      svg.style.setProperty("--look-x", `${(dx / dist) * 1.15 * reach}px`);
      svg.style.setProperty("--look-y", `${(dy / dist) * 0.95 * reach}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(look);
    };
    const onLeave = () => {
      svg.style.setProperty("--look-x", "0px");
      svg.style.setProperty("--look-y", "0px");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden
      className={cn("mascot", className)}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="4"
          y1="0"
          x2="28"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#818cf8" />
          <stop offset=".5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <g className="mascot-body" stroke={grad} strokeLinecap="round">
        <g className="mascot-tail">
          <path
            d="M22 8c3-2 6-1 7 2s0 6-2 8c-1.5 1.5-3 2-5 2"
            strokeWidth="2.5"
          />
          <path
            d="M24 12c1.5 0 3 1 3 2.5S26 17 24.5 17"
            strokeWidth="1.5"
            opacity=".6"
          />
        </g>
        <circle className="mascot-face" cx="12" cy="14" r="7" stroke="none" />
        <circle cx="12" cy="14" r="8" strokeWidth="2.5" />
        <path
          className="mascot-ear"
          d="M6 8C5 6 6 4 8 4s3 2 2 4"
          strokeWidth="2"
        />
        <path d="M14 6c0-2 1-4 3-4s3 2 2 4" strokeWidth="2" />
        <g className="mascot-look" stroke="none" fill={grad}>
          <g className="mascot-blink">
            <circle cx="9" cy="13" r="1.5" />
            <circle cx="15" cy="13" r="1.5" />
          </g>
        </g>
        <circle cx="12" cy="16" r="1" stroke="none" fill={grad} />
        <path d="M6 16c-1 .5-2 .5-2 .5" opacity=".5" />
        <path d="M18 16c1 .5 2 .5 2 .5" opacity=".5" />
      </g>
    </svg>
  );
}
