"use client";

import { type ComponentProps, useEffect, useRef } from "react";

export function InView({
  threshold = 0.35,
  ...props
}: ComponentProps<"div"> & { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.inview = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.inview = "true";
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return <div ref={ref} {...props} />;
}
