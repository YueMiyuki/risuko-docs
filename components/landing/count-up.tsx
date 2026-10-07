"use client";

import { useEffect, useRef } from "react";

export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const render = (n: number) => {
      el.textContent = `${n}${suffix}`;
    };
    let raf = 0;
    render(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400);
          render(Math.round((1 - (1 - p) ** 3) * value));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      render(value);
    };
  }, [value, suffix]);

  return (
    <>
      <span ref={ref} aria-hidden className={className}>
        {`${value}${suffix}`}
      </span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </>
  );
}
