import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, Fragment } from "react";
import { Mascot } from "@/components/landing/mascot";
import { buttonPrimary, buttonSecondary } from "@/components/landing/styles";
import { AppWindow, SHOTS } from "@/components/landing/window-frame";

const LEAD = ["Your", "next", "internet", "downloader,"];
const MARK = ["in", "Rust."];

function Word({ word, index }: { word: string; index: number }) {
  return (
    <span className="hero-word" style={{ "--i": index } as CSSProperties}>
      {word}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="hero-dots pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14 lg:pt-16">
        <h1 className="font-display text-balance text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5.25rem] xl:text-[6.25rem]">
          {LEAD.map((word, i) => (
            <Fragment key={word}>
              <Word word={word} index={i} />{" "}
            </Fragment>
          ))}
          <span className="hero-mark">
            {MARK.map((word, i) => (
              <Fragment key={word}>
                {i > 0 ? " " : null}
                <Word word={word} index={LEAD.length + i} />
              </Fragment>
            ))}
          </span>
        </h1>

        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-12 lg:gap-10">
          <div className="hero-copy lg:col-span-5">
            <p className="max-w-[34ch] text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Everything you need to download from the internet, in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://github.com/YueMiyuki/Risuko/releases"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonPrimary}
              >
                <Download className="h-4 w-4" />
                Download Risuko
              </Link>
              <Link href="/docs" className={buttonSecondary}>
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="hero-window relative mt-20 w-[125%] sm:mt-24 sm:w-[112%] lg:mt-6 lg:w-[128%]">
              <div className="hero-peek absolute right-[18%] bottom-full z-0 w-[19%] min-w-20 max-w-36 translate-y-[30%]">
                <Mascot className="block w-full" />
              </div>
              <div className="hero-crop relative z-[1]">
                <AppWindow
                  {...SHOTS.appTasks}
                  alt="Risuko task list with active downloads"
                  preload
                  sizes="(max-width: 640px) 140vw, (max-width: 1024px) 125vw, 75vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
