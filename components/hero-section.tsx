"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check } from "lucide-react";

function TerminalWindow() {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(37.5);
  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started || completed) return;

    const interval = setInterval(() => {
      progressRef.current = Math.min(
        progressRef.current + (Math.random() * 1.2 + 0.4),
        100,
      );
      setProgress(progressRef.current);
      setSpeed(35 + Math.random() * 8);

      if (progressRef.current >= 100) {
        setCompleted(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [started, completed]);

  const totalBlocks = 50;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);
  const progressBar = Array(totalBlocks)
    .fill(null)
    .map((_, i) => {
      if (i < filledBlocks) return "\u2588";
      if (i === filledBlocks) return "\u2592";
      return "\u2591";
    })
    .join("");

  return (
    <div className="hero-terminal relative w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 to-accent/15 rounded-xl blur-2xl opacity-60" />
      <div className="relative rounded-xl border border-border/40 bg-card overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/20 bg-muted/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/40 font-mono">
            risuko
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                "risuko download https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso",
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="p-4 font-mono text-[13px] leading-relaxed space-y-1.5 text-left">
          <div>
            <span className="text-green-400 font-medium">risuko</span>
            <span className="text-foreground/70 ml-2">
              download https://releases.ubuntu.com/24.04/ubuntu-24.04.iso
            </span>
          </div>
          <div className="text-muted-foreground/50 text-xs">
            No running Risuko instance found. Starting headless engine...
          </div>
          <div className="text-muted-foreground/50 text-xs">
            Download started (GID:{" "}
            <span className="text-foreground/50">a0f8d166e51b2fed</span>)
          </div>
          {!completed ? (
            <div className="flex items-center gap-3 pt-2 text-xs flex-wrap sm:flex-nowrap">
              <span className="text-foreground/60 shrink-0">
                ubuntu-24.04.iso
              </span>
              <span className="text-primary/70 font-mono tracking-tight hidden sm:inline shrink-0">
                [{progressBar}]
              </span>
              <span className="text-primary/70 font-mono tracking-tight sm:hidden shrink-0">
                [{progressBar.slice(0, 25)}]
              </span>
              <span className="text-foreground/70 shrink-0">
                {progress.toFixed(1)}%
              </span>
              <span className="text-foreground/70 shrink-0">
                {speed.toFixed(1)} MB/s
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 pt-2 text-xs flex-wrap sm:flex-nowrap">
                <span className="text-foreground/60 shrink-0">
                  ubuntu-24.04.iso
                </span>
                <span className="text-green-400/70 font-mono tracking-tight hidden sm:inline shrink-0">
                  [{progressBar}]
                </span>
                <span className="text-green-400/70 font-mono tracking-tight sm:hidden shrink-0">
                  [{progressBar.slice(0, 25)}]
                </span>
                <span className="text-green-400/70 shrink-0">100.0%</span>
                <span className="text-muted-foreground/50 shrink-0">-</span>
                <span className="text-green-400/70 shrink-0">[complete]</span>
              </div>
              <div className="text-muted-foreground/50 text-xs pt-1">
                Download complete: ubuntu-24.04.iso
              </div>
              <div className="text-muted-foreground/40 text-xs">
                Size: 5.8 GB Time: 02:38 Avg speed: 36.7 MB/s
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple gradient blur - clean and minimal
function HeroDecoration() {
  return (
    <div className="absolute right-0 top-[10%] w-[600px] h-[600px] pointer-events-none hidden lg:block overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[100px] right-[50px] w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(168, 85, 247, 0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <HeroDecoration />

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Left-aligned hero content */}
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
            the blazing-fast download manager you need.
          </div>

          {/* Headline */}
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Download everything, <br className="hidden sm:block" />
            your <span className="text-primary">speed.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-xl">
            High-performance download manager built in Rust with multi-threaded
            connections, browser integration, and a powerful CLI.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="https://github.com/YueMiyuki/Risuko"
              className="hero-cta inline-flex items-center gap-2 h-12 px-6 rounded-full border-2 border-primary bg-transparent text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="hero-cta inline-flex items-center h-12 px-6 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* Terminal - full width below */}
        <div className="pt-16 lg:pt-20 max-w-4xl">
          <TerminalWindow />
        </div>
      </div>
    </section>
  );
}
