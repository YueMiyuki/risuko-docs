import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const PAD = { l: 112, t: 76, r: 112, b: 148 };

export function AppWindow({
  src,
  alt,
  width,
  height,
  radius = 48,
  className,
  style,
  preload,
  sizes = "(max-width: 1024px) 100vw, 60vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
  sizes?: string;
}) {
  const ww = width - PAD.l - PAD.r;
  const wh = height - PAD.t - PAD.b;

  return (
    <div
      className={cn("app-window relative isolate overflow-hidden", className)}
      style={{
        aspectRatio: `${ww} / ${wh}`,
        borderRadius: `${(radius / ww) * 100}% / ${(radius / wh) * 100}%`,
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={90}
        preload={preload}
        draggable={false}
        className="absolute max-w-none select-none"
        style={{
          width: `${(width / ww) * 100}%`,
          height: "auto",
          left: `${-(PAD.l / ww) * 100}%`,
          top: `${-(PAD.t / wh) * 100}%`,
        }}
      />
    </div>
  );
}

export const SHOTS = {
  appTasks: { src: "/showcases/app-tasks.png", width: 2272, height: 1762 },
  appEmpty: { src: "/showcases/app-empty.png", width: 2272, height: 1762 },
  rpc: { src: "/showcases/rpc.png", width: 2272, height: 1762 },
  stats: { src: "/showcases/stats.png", width: 2272, height: 1762 },
  github: {
    src: "/showcases/github-releases.png",
    width: 3248,
    height: 2122,
  },
  motrixAbout: {
    src: "/showcases/motrix-about.png",
    width: 1374,
    height: 880,
    radius: 44,
  },
  risukoAbout: {
    src: "/showcases/risuko-about.png",
    width: 1374,
    height: 880,
    radius: 44,
  },
} as const;
