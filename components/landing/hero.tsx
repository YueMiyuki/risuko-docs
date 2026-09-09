import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { HERO_FRAME, Shot, Showcase } from "@/components/landing/window-frame";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Showcase
          flush
          className="flex flex-1 flex-col"
          minHeightClassName="min-h-[280px] sm:min-h-[360px] flex-1"
          text={
            <div className="flex h-full flex-col justify-center">
              <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Your next internet downloader, in Rust.
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Everything you need to download from the internet, in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="https://github.com/YueMiyuki/Risuko/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="h-4 w-4" />
                  Download Risuko
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-border/60 bg-background/40 px-6 font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Read the docs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          }
          media={
            <Shot
              priority
              pin="left"
              frame={HERO_FRAME}
              src="/showcases/app-empty.png"
              alt="Empty task list"
              width={2272}
              height={1762}
            />
          }
        />
      </div>
    </section>
  );
}
