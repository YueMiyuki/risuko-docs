"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------- */
/* shared bits                                                       */
/* ---------------------------------------------------------------- */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function Cmd({ text, copyable }: { text: string; copyable?: boolean }) {
  return (
    <div className="flex items-start gap-2 group">
      <span className="text-green-400 font-medium select-none" aria-hidden>
        ❯
      </span>
      <span className="text-foreground/90 break-all flex-1">{text}</span>
      {copyable && (
        <span className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <CopyButton text={text} label={`Copy command: ${text}`} />
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 1 — version / identity                                      */
/* ---------------------------------------------------------------- */

function VersionBlock() {
  return (
    <div className="space-y-4">
      <Cmd text="risuko --version" />
      <div
        aria-hidden
        className="text-primary font-bold tracking-tight leading-none flex items-baseline"
        style={{ fontSize: "clamp(3.5rem, 9vw, 6rem)" }}
      >
        risuko
        <span className="animate-blink ml-2 inline-block w-[0.5em] h-[0.85em] bg-primary/80 self-center" />
      </div>
      <div className="space-y-2">
        <h1 className="font-bold text-2xl sm:text-4xl tracking-tight text-balance">
          Eleven protocols. One engine.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-[62ch] leading-relaxed">
          Rust-powered download engine — desktop app, CLI, and Node.js library
          sharing one queue. From plain HTTPS to BEP 52 hybrid torrents to a
          giFT IPC bridge.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 2 — live download demo                                      */
/* ---------------------------------------------------------------- */

type Job = {
  tag: string;
  tagClass: string;
  barClass: string;
  name: string;
  extra: (p: number) => string;
  start: number;
  rate: number;
  speed: [number, number];
};

const JOBS: Job[] = [
  {
    tag: "HTTP",
    tagClass: "text-chart-1",
    barClass: "text-chart-1/80",
    name: "dataset.tar.zst",
    extra: () => "16 conns",
    start: 24,
    rate: 1.4,
    speed: [38, 44],
  },
  {
    tag: "BT",
    tagClass: "text-chart-2",
    barClass: "text-chart-2/80",
    name: "debian-13.0.0-amd64.iso",
    extra: () => "61 peers",
    start: 11,
    rate: 1.0,
    speed: [30, 39],
  },
  {
    tag: "HLS",
    tagClass: "text-chart-3",
    barClass: "text-chart-3/80",
    name: "lecture-04/master.m3u8",
    extra: (p) => `seg ${Math.floor((p / 100) * 630)}/630`,
    start: 5,
    rate: 0.6,
    speed: [10, 14],
  },
];

const BLOCKS = 16;

function bar(progress: number) {
  const filled = Math.floor((progress / 100) * BLOCKS);
  return Array(BLOCKS)
    .fill(null)
    .map((_, i) => (i < filled ? "█" : i === filled ? "▒" : "░"))
    .join("");
}

function DownloadBlock() {
  const [progress, setProgress] = useState(() => JOBS.map((j) => j.start));
  const [speeds, setSpeeds] = useState(() =>
    JOBS.map((j) => (j.speed[0] + j.speed[1]) / 2),
  );
  const progressRef = useRef(JOBS.map((j) => j.start));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(JOBS.map(() => 100));
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const delay = setTimeout(() => {
      interval = setInterval(() => {
        progressRef.current = progressRef.current.map((p, i) =>
          Math.min(p + JOBS[i].rate * (0.6 + Math.random() * 0.8), 100),
        );
        setProgress([...progressRef.current]);
        setSpeeds(
          JOBS.map((job) => {
            const [lo, hi] = job.speed;
            return lo + Math.random() * (hi - lo);
          }),
        );
        if (progressRef.current.every((p) => p >= 100)) {
          clearInterval(interval);
        }
      }, 120);
    }, 700);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, []);

  const allDone = progress.every((p) => p >= 100);

  return (
    <div className="space-y-1">
      <Cmd text="risuko download https://data.example.org/ml/dataset.tar.zst -t 16" />
      <div className="text-muted-foreground text-xs pl-5">
        Queued a1f8d166 — no engine found, starting headless
      </div>
      <Cmd text={'risuko download "magnet:?xt=urn:btih:9f86d081884c7d65"'} />
      <div className="text-muted-foreground text-xs pl-5">
        Queued b7c22e01 — metadata from DHT (42 nodes)
      </div>
      <Cmd text="risuko download https://vod.example.net/lecture-04/master.m3u8" />
      <div className="text-muted-foreground text-xs pl-5">
        Queued c93aa4f0 — playlist parsed: 630 segments, AES-128
      </div>

      <div className="pt-3 space-y-1" aria-hidden>
        {JOBS.map((job, i) => {
          const p = progress[i];
          const done = p >= 100;
          return (
            <div
              key={job.tag}
              className="flex items-center gap-2 text-xs flex-wrap sm:flex-nowrap"
            >
              <span className={`${job.tagClass} font-medium w-11 shrink-0`}>
                [{job.tag}]
              </span>
              <span className="text-foreground/70 shrink-0 w-36 truncate">
                {job.name}
              </span>
              <span
                className={`${done ? "text-green-400/80" : job.barClass} tracking-tight hidden sm:inline shrink-0`}
              >
                [{bar(p)}]
              </span>
              <span className="text-foreground/70 shrink-0 w-12 text-right tabular-nums">
                {p.toFixed(1).padStart(5)}%
              </span>
              {done ? (
                <span className="text-green-400/80 shrink-0">complete</span>
              ) : (
                <>
                  <span className="text-muted-foreground shrink-0">
                    {job.extra(p)}
                  </span>
                  <span className="text-foreground/70 shrink-0 tabular-nums">
                    {speeds[i].toFixed(1)} MB/s
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div
        className={`text-xs pt-1 transition-opacity ${allDone ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-green-400/90">✓</span>
        <span className="text-muted-foreground ml-2">
          All jobs complete — 16.4 GB in 06:12 (avg 45.1 MB/s)
        </span>
      </div>
      <p className="sr-only">
        Demo: risuko downloading over HTTP, BitTorrent, and HLS simultaneously.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 3 — protocol list                                           */
/* ---------------------------------------------------------------- */

const FAMILIES = [
  {
    family: "web",
    labelClass: "text-chart-1",
    rows: [
      [
        "https://",
        "HTTP/HTTPS",
        "multi-threaded range downloads, connection pooling",
      ],
      [
        "youtube",
        "YouTube",
        "bundled yt-dlp child process, progress integration",
      ],
      ["rss", "RSS", "feed subscription with automatic download"],
    ],
  },
  {
    family: "swarm",
    labelClass: "text-chart-2",
    rows: [
      [
        "magnet:",
        "BitTorrent",
        "v1 + v2 hybrid (BEP 52), dual-stack DHT, LSD, MSE/PE, UPnP, seeding control",
      ],
      ["ed2k://", "ED2K", "eDonkey2000 network protocol"],
      ["adcs://", "ADC/DC", "adc(s)://, dchub://, nmdc:// — ADC + legacy NMDC"],
      ["gnet://", "Gnutella", "0.6 handshake, GWebCache bootstrap"],
      ["g2://", "Gnutella2", "SHA-1 URN via Gnutella's HTTP peer endpoint"],
      ["gift://", "giFT", "IPC bridge to a locally-running giftd daemon"],
    ],
  },
  {
    family: "stream",
    labelClass: "text-chart-3",
    rows: [[".m3u8", "M3U8/HLS", "segment downloads, AES-128-CBC decryption"]],
  },
  {
    family: "transfer",
    labelClass: "text-chart-4",
    rows: [
      ["sftp://", "FTP/SFTP", "TLS support, SFTP host keys pinned via TOFU"],
    ],
  },
];

function ProtocolBlock() {
  return (
    <div id="protocols" className="space-y-3">
      <h2 className="sr-only">Supported protocols</h2>
      <Cmd text="risuko protocols --list" />
      <div className="pl-5 space-y-4">
        {FAMILIES.map((fam) => (
          <div key={fam.family}>
            {fam.rows.map(([scheme, name, detail], i) => (
              <div
                key={scheme}
                className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[5rem_6rem_7rem_1fr] gap-x-4 gap-y-0.5 py-1 text-[13px] items-baseline"
              >
                <span
                  className={`${fam.labelClass} uppercase text-xs tracking-wide`}
                >
                  {i === 0 ? fam.family : ""}
                </span>
                <span className={`${fam.labelClass} font-medium`}>
                  {scheme}
                </span>
                <span className="text-foreground/90 col-start-2 sm:col-start-3">
                  {name}
                </span>
                <span className="text-muted-foreground col-start-2 col-span-1 sm:col-start-4 text-xs sm:text-[13px] leading-relaxed">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="text-muted-foreground text-xs">
          11 protocols · one queue · one engine
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 4 — benchmark vs Motrix                                     */
/* ---------------------------------------------------------------- */

const BENCH = [
  { label: "binary size", pct: 90, text: "90% smaller" },
  { label: "memory", pct: 70, text: "70% less" },
  { label: "peak cpu", pct: 71, text: "71% less" },
];

function BenchBlock() {
  return (
    <div id="benchmarks" className="space-y-3">
      <h2 className="sr-only">Benchmarks compared with Motrix</h2>
      <Cmd text="risuko bench --vs motrix" />
      <div className="pl-5 space-y-2">
        {BENCH.map((row) => (
          <div key={row.label} className="flex items-center gap-3 text-[13px]">
            <span className="w-24 shrink-0 text-foreground/90">
              {row.label}
            </span>
            <span
              className="h-3 bg-primary/80 rounded-[2px]"
              style={{ width: `${row.pct * 0.55}%`, maxWidth: "55%" }}
              aria-hidden
            />
            <span className="text-primary font-medium whitespace-nowrap tabular-nums">
              {row.text}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 text-[13px]">
          <span className="w-24 shrink-0 text-foreground/90">mem leaks</span>
          <span className="text-green-400/90 font-medium">zero</span>
        </div>
        <div className="text-muted-foreground text-xs pt-1">
          # baseline: original project{" "}
          <a
            href="https://github.com/agalwood/Motrix"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Motrix
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 5 — install doors                                           */
/* ---------------------------------------------------------------- */

const DOORS = [
  {
    comment: "# Desktop — macOS (Windows/Linux below)",
    cmd: "brew install --cask yuemiyuki/risuko/risuko-app",
    href: "https://github.com/YueMiyuki/risuko/releases",
    linkText: ".dmg / .msi / .AppImage",
    external: true,
  },
  {
    comment: "# CLI",
    cmd: "npm install -g @risuko/cli",
    href: "/docs/getting-started/installation",
    linkText: "install guide",
    external: false,
  },
  {
    comment: "# Node.js",
    cmd: "npm install @risuko/risuko-js",
    href: "/docs/node-api",
    linkText: "API reference",
    external: false,
  },
];

function InstallBlock() {
  return (
    <div id="install" className="space-y-3">
      <h2 className="sr-only">Install</h2>
      <Cmd text="cat INSTALL" />
      <div className="pl-5 space-y-3">
        {DOORS.map((door) => (
          <div key={door.cmd} className="space-y-0.5">
            <div className="text-muted-foreground text-xs">{door.comment}</div>
            <div className="flex items-center gap-2">
              <code className="text-foreground/90 text-[13px] break-all">
                {door.cmd}
              </code>
              <CopyButton text={door.cmd} label={`Copy: ${door.cmd}`} />
              <Link
                href={door.href}
                {...(door.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="hidden sm:inline-flex items-center gap-0.5 text-xs text-primary hover:underline underline-offset-4 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {door.linkText}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 6 — code examples                                           */
/* ---------------------------------------------------------------- */

const NODE_LINES: [string, string][] = [
  ["import", ' { startEngine, addUri, tellStatus } from "@risuko/risuko-js";'],
  ["", ""],
  ["await", " startEngine();"],
  [
    "const",
    ' gid = await addUri(["https://example.com/file.zip"], { split: "16" });',
  ],
  ["const", " status = await tellStatus(gid);"],
  ["", "console.log(`${status.completedLength}/${status.totalLength}`);"],
];

function CodeBlock() {
  return (
    <div id="examples" className="space-y-6">
      <h2 className="sr-only">Code examples</h2>
      <div className="space-y-1.5">
        <Cmd text="tail -n 4 examples/cli.sh" />
        <div className="pl-5 text-[13px] space-y-0.5">
          {[
            "risuko download https://example.com/file.iso -t 16",
            'risuko download "magnet:?xt=urn:btih:abc123..." --seed-ratio 1.0',
            "risuko status --json",
            "risuko pause a1b2c3d4 && risuko resume a1b2c3d4",
          ].map((line) => (
            <div key={line} className="break-all">
              <span className="text-primary font-medium">risuko</span>
              <span className="text-foreground/80">{line.slice(6)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Cmd text="head -n 6 examples/quick.ts" />
        <div className="pl-5 text-[13px] space-y-0.5">
          {NODE_LINES.map(([kw, rest], i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <div key={i} className="break-all min-h-[1.2em]">
              {kw && <span className="text-accent">{kw}</span>}
              <span className="text-foreground/80">{rest}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* block 7 — exit prompt                                             */
/* ---------------------------------------------------------------- */

function ExitBlock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-green-400 font-medium select-none" aria-hidden>
          ❯
        </span>
        <span className="text-foreground/90">risuko docs</span>
      </div>
      <div className="pl-5">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          → Opening the documentation
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex items-center gap-2 pt-2" aria-hidden>
        <span className="text-green-400 font-medium select-none">❯</span>
        <span className="animate-blink w-[7px] h-[15px] bg-foreground/80 inline-block" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* the session                                                       */
/* ---------------------------------------------------------------- */

export function TerminalSession() {
  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-accent/10 rounded-2xl blur-2xl opacity-60 pointer-events-none" />
        <div className="relative rounded-xl border border-border/40 bg-card shadow-2xl overflow-hidden">
          <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 border-b border-border/20 bg-muted backdrop-blur">
            <div className="flex gap-2" aria-hidden>
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
              risuko — session
            </div>
            <div className="w-14" aria-hidden />
          </div>

          <div className="p-4 sm:p-8 font-mono text-[13px] leading-relaxed space-y-12 sm:space-y-14">
            <VersionBlock />
            <DownloadBlock />
            <ProtocolBlock />
            <BenchBlock />
            <InstallBlock />
            <CodeBlock />
            <ExitBlock />
          </div>
        </div>
      </div>
    </section>
  );
}
