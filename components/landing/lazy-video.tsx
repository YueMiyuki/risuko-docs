"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";

export function LazyVideo({
  src,
  poster,
  width,
  height,
  label,
  className,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        video.poster = poster;
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(video);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      return () => near.disconnect();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {
            video.controls = true;
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => {
      near.disconnect();
      io.disconnect();
    };
  }, [poster]);

  return (
    <video
      ref={ref}
      className={cx("block h-auto w-full", className)}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
