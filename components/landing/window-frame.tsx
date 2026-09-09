import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Frame = { x: number; y: number; w: number; b?: number };

const APP_FRAME: Frame = { x: 4.89, y: 4.26, w: 90.18, b: 8.35 };
export const RPC_FRAME: Frame = APP_FRAME;
export const METRICS_FRAME: Frame = APP_FRAME;
export const HERO_FRAME: Frame = APP_FRAME;
export const GITHUB_FRAME: Frame = { x: 3.42, y: 3.53, w: 91.5, b: 7.0 };

export function Shot({
  src,
  alt,
  width,
  height,
  frame = APP_FRAME,
  framed,
  fit = "width",
  pin,
  className,
  priority,
  sizes = "(max-width: 1024px) 100vw, 60vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  frame?: Frame | null;
  framed?: boolean;
  fit?: "width" | "height";
  pin?: "left" | "right" | "top-left" | "top-right";
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  let style: CSSProperties | undefined;
  if (frame) {
    if (fit === "height") {
      const visible = 100 - frame.y - (frame.b ?? frame.y);
      style = {
        height: `${(100 / visible) * 100}%`,
        width: "auto",
        maxWidth: "none",
        transform: `translate(${-frame.x}%, ${-frame.y}%)`,
      };
    } else {
      const scale = 100 / frame.w;
      const yShift = frame.y * (height / width) * scale;
      const bShift = (frame.b ?? frame.y) * (height / width) * scale;
      style = {
        width: `${scale * 100}%`,
        height: "auto",
        maxWidth: "none",
        marginLeft: frame.x ? `-${frame.x * scale}%` : undefined,
        marginTop: yShift ? `-${yShift}%` : undefined,
        marginBottom: bShift ? `-${bShift}%` : undefined,
      };
    }
  }

  return (
    <div
      className={cn(
        framed
          ? "overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          : "isolate w-full overflow-hidden",
        !framed && pin === "left" && "rounded-l-[10px]",
        !framed && pin === "right" && "rounded-r-[10px]",
        !framed && pin === "top-left" && "rounded-tl-[10px]",
        !framed && pin === "top-right" && "rounded-tr-[10px]",
        fit === "height" && "h-full",
        className,
      )}
      style={
        !framed && pin
          ? {
              clipPath: {
                left: "inset(0 round 10px 0 0 10px)",
                right: "inset(0 round 0 10px 10px 0)",
                "top-left": "inset(0 round 10px 0 0 0)",
                "top-right": "inset(0 round 0 10px 0 0)",
              }[pin],
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={cn("block", frame ? "max-w-none" : "w-full")}
        sizes={sizes}
        quality={90}
        priority={priority}
      />
    </div>
  );
}

export function ShowcaseVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
      <video
        className="block h-auto w-full"
        width={width}
        height={height}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

/**
 * A Cursor-style stage: a rounded panel with copy on one side and an
 * oversized piece of media on the other that bleeds off the panel edge.
 */
/**
 * crop
 *  - "corner": media bleeds off the outer side AND the bottom edge
 *  - "side":   media bleeds off the outer side only; its full height shows
 *  - "bottom": media is centered and bleeds off the bottom edge only
 * bleed controls how far the media overshoots the panel on the cropped side.
 */
export function Showcase({
  reverse,
  text,
  media,
  crop = "corner",
  bleed = "md",
  className,
  minHeightClassName = "lg:min-h-[600px]",
  flush,
}: {
  reverse?: boolean;
  text: ReactNode;
  media: ReactNode;
  crop?: "corner" | "side" | "bottom";
  bleed?: "none" | "sm" | "md";
  className?: string;
  minHeightClassName?: string;
  flush?: boolean;
}) {
  const overshoot =
    bleed === "none" ? "w-full" : bleed === "sm" ? "w-[108%]" : "w-[118%]";
  const pullBack =
    bleed === "none" ? undefined : bleed === "sm" ? "-ml-[8%]" : "-ml-[18%]";

  return (
    <div
      className={cn(
        "relative flex flex-col",
        flush ? "overflow-visible" : "overflow-hidden rounded-lg bg-section",
        crop !== "side" && minHeightClassName,
        className,
      )}
    >
      <div className="grid min-h-0 flex-1 lg:grid-cols-12 lg:grid-rows-1">
        <div
          className={cn(
            "flex h-full flex-col justify-center px-6 pt-10 pb-6 sm:px-12 sm:pt-14 lg:col-span-5 lg:py-20",
            reverse ? "lg:order-2 lg:pr-14 lg:pl-8" : "lg:pr-8 lg:pl-14",
          )}
        >
          {text}
        </div>

        {crop === "side" ? (
          <div
            className={cn(
              "flex h-full flex-col justify-center px-6 pb-10 pt-4 sm:px-12 sm:pb-14 sm:pt-6 lg:col-span-7 lg:py-16",
              bleed === "none" ? "lg:px-10" : "lg:px-0",
              reverse && "lg:order-1",
            )}
          >
            <div className={cn("max-w-none", overshoot, reverse && pullBack)}>
              {media}
            </div>
          </div>
        ) : flush ? (
          <div
            className={cn(
              "relative flex min-h-[280px] items-center sm:min-h-[360px] lg:col-span-7 lg:min-h-0",
              reverse && "lg:order-1",
            )}
          >
            <div className={cn("shrink-0", overshoot, reverse && "ml-auto")}>
              {media}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative min-h-[320px] sm:min-h-[420px] lg:col-span-7 lg:min-h-0",
              reverse && "lg:order-1",
            )}
          >
            <div
              className={cn(
                "absolute",
                crop === "bottom"
                  ? "top-6 bottom-0 left-1/2 w-[min(440px,80%)] -translate-x-1/2 sm:top-10 lg:top-16"
                  : cn(
                      "top-6 bottom-0 sm:top-10 lg:top-16",
                      reverse
                        ? cn("right-6 sm:right-10 lg:right-0", overshoot)
                        : cn("left-6 sm:left-10 lg:left-0", overshoot),
                    ),
              )}
            >
              {media}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Stack({
  text,
  media,
  className,
}: {
  text: ReactNode;
  media: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-section",
        className,
      )}
    >
      <div className="px-6 pt-10 sm:px-12 sm:pt-14 lg:px-14 lg:pt-16">
        {text}
      </div>
      <div className="mt-8 px-6 pb-10 sm:mt-10 sm:px-12 sm:pb-14 lg:px-14 lg:pb-16">
        {media}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
