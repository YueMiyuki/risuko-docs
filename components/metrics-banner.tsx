"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedValue({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 1200;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="metrics-card text-center px-6 py-8">
      <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function MetricsBanner() {
  return (
    <section className="metrics-section py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-border/40 bg-card/30 divide-x divide-y lg:divide-y-0 divide-border/30">
          <AnimatedValue value={90} suffix="%" label="Smaller binary" />
          <div className="metrics-card text-center px-6 py-8">
            <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
              Zero
            </div>
            <div className="text-sm text-muted-foreground">Memory leaks</div>
          </div>
          <AnimatedValue value={70} suffix="%" label="Less memory" />
          <AnimatedValue value={71} suffix="%" label="Less peak CPU" />
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          Compared with original project{" "}
          <a
            href="https://github.com/agalwood/Motrix"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground transition-colors"
          >
            Motrix
          </a>
        </p>
      </div>
    </section>
  );
}
