import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChartColumnBig,
  Check,
  Clipboard,
  Cloud,
  Cookie,
  Cpu,
  FileCode2,
  Gift,
  Globe,
  HardDrive,
  HeartPulse,
  type LucideIcon,
  Magnet,
  MonitorPlay,
  Network,
  Newspaper,
  Orbit,
  Package,
  Plug,
  PlugZap,
  Route,
  Rss,
  ScrollText,
  Server,
  ServerCog,
  Share2,
  Terminal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, Fragment, type ReactNode } from "react";
import { BentoGrid, BentoTile } from "@/components/landing/bento";
import { CopyCommand } from "@/components/landing/copy-command";
import { CountUp } from "@/components/landing/count-up";
import {
  CloudArt,
  RoutingArt,
  RssArt,
  TorrentArt,
} from "@/components/landing/feature-art";
import { InView } from "@/components/landing/in-view";
import { LazyVideo } from "@/components/landing/lazy-video";
import { Mascot } from "@/components/landing/mascot";
import { buttonPrimary, buttonSecondary } from "@/components/landing/styles";
import { AppWindow, SHOTS } from "@/components/landing/window-frame";
import { cn } from "@/lib/cn";

function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-12 sm:py-16", className)}>
      <Container>{children}</Container>
    </section>
  );
}

function Heading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("reveal max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/12 px-3.5 py-1.5 text-sm font-semibold text-primary [&>svg]:h-4 [&>svg]:w-4">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-balance text-4xl font-bold leading-[1.04] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {children ? (
        <p className="mt-5 max-w-[60ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}

function Chip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-primary" />
      {children}
    </span>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5 text-sm sm:text-base">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-foreground/85">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function VideoFrame(props: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "reveal overflow-hidden rounded-3xl bg-black ring-1 ring-border shadow-[0_40px_80px_-40px_oklch(0.25_0.08_290/0.55)]",
        props.className,
      )}
    >
      <LazyVideo
        src={props.src}
        poster={props.poster}
        width={1280}
        height={832}
        label={props.label}
      />
    </div>
  );
}

const PROTOCOLS: { label: string; icon: LucideIcon }[] = [
  { label: "HTTP / HTTPS", icon: Globe },
  { label: "BitTorrent v1+v2 + WebSeed", icon: Share2 },
  { label: "Magnet", icon: Magnet },
  { label: "FTP / SFTP", icon: ServerCog },
  { label: "M3U8 / HLS", icon: MonitorPlay },
  { label: "Usenet / NZB", icon: Newspaper },
  { label: "ED2K", icon: Network },
  { label: "ADC / DC", icon: PlugZap },
  { label: "Gnutella / G2", icon: Orbit },
  { label: "giFT bridge", icon: Gift },
];

const STICKER_TONES = [
  "border-transparent bg-primary text-primary-foreground",
  "border-border bg-card text-foreground",
  "border-primary/25 bg-primary/12 text-foreground",
];
const STICKER_TILTS = [-2.5, 1.5, -1, 2, -1.5, 2.5, -2, 1, -1.5, 2];

function Marquee({ shift, reverse }: { shift: number; reverse?: boolean }) {
  const items = [...PROTOCOLS.slice(shift), ...PROTOCOLS.slice(0, shift)];
  return (
    <div className="marquee" data-reverse={reverse ? "" : undefined}>
      {[0, 1].map((copy) => (
        <div key={copy} className="marquee-track">
          {items.map(({ label, icon: Icon }, i) => (
            <span
              key={label}
              className={cn(
                "sticker inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border px-5 py-2.5 font-display text-2xl font-semibold tracking-[-0.02em] sm:gap-4 sm:px-7 sm:py-3.5 sm:text-4xl",
                STICKER_TONES[(i + shift) % STICKER_TONES.length],
              )}
              style={
                {
                  "--tilt": `${STICKER_TILTS[(i + shift) % STICKER_TILTS.length]}deg`,
                } as CSSProperties
              }
            >
              <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.25} />
              {label}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProtocolsSection() {
  return (
    <section
      id="protocols"
      className="scroll-mt-20 overflow-hidden py-12 sm:py-16"
    >
      <Container>
        <Heading
          eyebrow={
            <>
              <Globe />
              Multi-protocol
            </>
          }
          title="One engine speaks every protocol"
        >
          From plain HTTPS to BEP 52 hybrid torrents with WebSeed mirrors, HLS
          streams, Usenet, and a giFT IPC bridge. Add a URL or a magnet link and
          Risuko routes it to the right handler, all within a single unified
          queue.
        </Heading>
      </Container>
      <div aria-hidden className="mt-10 flex flex-col gap-2 sm:mt-14 sm:gap-4">
        <Marquee shift={0} />
        <Marquee shift={5} reverse />
      </div>
      <ul className="sr-only">
        {PROTOCOLS.map((p) => (
          <li key={p.label}>{p.label}</li>
        ))}
      </ul>
    </section>
  );
}

function CopyDownloadSection() {
  return (
    <Section id="copy-to-download">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Heading title="Copy a link, start a download">
            Risuko watches your clipboard. Copy any supported URL or magnet link
            and it offers to queue it instantly. No window switching, no
            pasting. Just copy and go.
          </Heading>
          <div className="mt-8">
            <Chip icon={Clipboard}>Clipboard monitoring</Chip>
          </div>
        </div>
        <VideoFrame
          className="lg:col-span-7 lg:-rotate-1"
          src="/showcases/copy-to-download.mp4"
          poster="/showcases/copy-to-download-poster.jpg"
          label="Copy to download"
        />
      </div>
    </Section>
  );
}

function FlyoutSection() {
  return (
    <Section id="flyout">
      <div className="grid overflow-hidden rounded-[2rem] border border-border bg-section lg:grid-cols-2">
        <div className="flyout-stage relative flex h-[340px] justify-center overflow-hidden sm:h-[460px] lg:order-2 lg:h-[560px]">
          <div className="flyout-drop w-[min(440px,84%)]">
            <Image
              src="/showcases/flyout.png"
              alt="Risuko flyout"
              width={980}
              height={1178}
              sizes="(max-width: 640px) 84vw, 440px"
              quality={90}
              className="block h-auto w-full rounded-b-3xl shadow-[0_30px_60px_-30px_oklch(0.2_0.06_290/0.6)] ring-1 ring-border"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-section to-transparent"
          />
        </div>
        <div className="flex flex-col justify-center px-6 pt-8 pb-10 sm:px-12 sm:pb-14 lg:order-1 lg:px-16 lg:py-16">
          <Heading title="Your queue, one click from the tray">
            A compact flyout lives in your menu bar. Glance at speeds, pause or
            resume, filter tasks, and add a new download without ever opening
            the full window.
          </Heading>
        </div>
      </div>
    </Section>
  );
}

function ShareSection() {
  return (
    <Section id="share">
      <Heading
        eyebrow={
          <>
            <Share2 />
            Risuko Share
          </>
        }
        title="Send a download to any of your devices"
      >
        Push a task from your laptop straight to your phone, or pull a finished
        file down anywhere. Share syncs through your Risuko account and keeps
        every device on the same queue.
      </Heading>
      <div className="mt-8">
        <Chip icon={User}>Requires login</Chip>
      </div>
      <div className="dot-field mt-10 rounded-[2rem] border border-border p-3 sm:mt-12 sm:p-8 lg:p-12">
        <VideoFrame
          src="/showcases/file-share.mp4"
          poster="/showcases/file-share-poster.jpg"
          label="Risuko Share"
        />
      </div>
    </Section>
  );
}

const BENCH = [
  { value: 84, label: "smaller binary", detail: "219.3 MB → 35 MB" },
  { value: 72, label: "less memory", detail: "~425 MB → ~120 MB" },
  { value: 83, label: "less peak CPU", detail: "~145% → 25%" },
];

function Contender({
  name,
  size,
  about,
  chart,
  winner,
}: {
  name: string;
  size: string;
  about: (typeof SHOTS)["motrixAbout" | "risukoAbout"];
  chart: string;
  winner?: boolean;
}) {
  return (
    <div
      className={cn(
        "reveal group rounded-3xl border p-4 sm:p-6",
        winner ? "border-primary/50 bg-primary/8" : "border-border bg-card",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
        <span
          className={cn(
            "font-display text-xl font-semibold",
            winner && "text-primary",
          )}
        >
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{size}</span>
      </div>
      <AppWindow
        {...about}
        alt={`${name} app info`}
        sizes="(max-width: 768px) 90vw, 40vw"
        className={cn(
          "relative z-[1] mx-auto mt-5 -mb-8 w-[72%] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-0",
          winner ? "rotate-[1.5deg]" : "-rotate-2 grayscale-[45%]",
        )}
      />
      <div className="overflow-hidden rounded-2xl bg-black p-2 sm:p-3">
        <Image
          src={chart}
          alt={`${name} performance profile`}
          className="block h-auto w-full"
          width={640}
          height={480}
          sizes="(max-width: 768px) 90vw, 40vw"
          quality={90}
        />
      </div>
    </div>
  );
}

function PerformanceSection() {
  return (
    <Section id="performance">
      <Heading title="A quarter of the memory. A sixth of the CPU.">
        Risuko replaced the aria2 backend with a native Rust engine. Measured
        while idle with psrecord over 60 seconds, it uses dramatically less than
        the original Motrix it is based on, with zero memory leaks.
      </Heading>

      <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8">
        {BENCH.map((b) => (
          <div key={b.label} className="reveal flex items-end gap-5 sm:block">
            <CountUp
              value={b.value}
              suffix="%"
              className="block min-w-[2.6em] font-display text-6xl font-extrabold leading-none tracking-[-0.03em] text-primary tabular-nums sm:min-w-0 sm:text-7xl lg:text-8xl"
            />
            <div className="pb-1 sm:pb-0">
              <div className="font-semibold sm:mt-3">{b.label}</div>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                {b.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
        <Contender
          name="Motrix (original)"
          size="219.3 MB · Electron + aria2"
          about={SHOTS.motrixAbout}
          chart="/showcases/motrix-perf.png"
        />
        <Contender
          name="Risuko"
          size="35 MB · native Rust"
          about={SHOTS.risukoAbout}
          chart="/showcases/risuko-perf.png"
          winner
        />
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Baseline: the original{" "}
        <a
          href="https://github.com/agalwood/Motrix"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Motrix
        </a>{" "}
        project. Profiles captured with{" "}
        <a
          href="https://github.com/astrofrog/psrecord"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          psrecord
        </a>
        .
      </p>
    </Section>
  );
}

function ShowcaseTile({
  id,
  icon: Icon,
  title,
  description,
  bullets,
  shot,
  alt,
  tinted,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  shot: (typeof SHOTS)["rpc" | "stats"];
  alt: string;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "reveal group flex scroll-mt-20 flex-col overflow-hidden rounded-[2rem] border px-6 pt-8 sm:px-10 sm:pt-10",
        tinted ? "border-primary/25 bg-primary/10" : "border-border bg-section",
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-6 font-display text-balance text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
        {description}
      </p>
      <CheckList items={bullets} />
      <div className="mt-auto pt-10">
        <AppWindow
          {...shot}
          alt={alt}
          sizes="(max-width: 1024px) 110vw, 55vw"
          className="-mr-[30%] -mb-[12%] w-[130%] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2"
        />
      </div>
    </section>
  );
}

function RpcMetricsSection() {
  return (
    <Container className="grid gap-5 py-12 sm:py-16 lg:grid-cols-2">
      <ShowcaseTile
        id="rpc"
        icon={Plug}
        title="Drop-in Aria2-compatible RPC"
        description="Risuko exposes an Aria2Next-compatible JSON-RPC listener. Point AriaNg, PeerBanHelper, or any Aria2 client you already use straight at Risuko. Copy the RPC URL and you are connected."
        bullets={[
          "Configurable listen port and secret token",
          "Works with existing Aria2 front-ends and tooling",
          "One-click “Copy RPC URL” and secret manual",
        ]}
        shot={SHOTS.rpc}
        alt="Risuko JSON-RPC"
      />
      <ShowcaseTile
        id="metrics"
        icon={ChartColumnBig}
        title="See exactly what you have downloaded"
        description="Break down volume by protocol and month, scrub speed history in adjustable time buckets, and pick any date range. Every byte HTTP, BitTorrent, and Usenet moved is accounted for."
        bullets={[
          "Per-protocol and per-month totals",
          "Speed history with adjustable buckets",
          "Custom date ranges: 1d, 7d, 30d, 6mo, 1yr",
        ]}
        shot={SHOTS.stats}
        alt="Risuko stats page"
        tinted
      />
    </Container>
  );
}

const CLI_LINES = [
  "risuko download https://example.com/file.iso -t 16",
  'risuko download "magnet:?xt=urn:btih:abc123..." --seed-ratio 1.0',
  "risuko status --json",
  "risuko pause a1b2c3d4 && risuko resume a1b2c3d4",
];

const NODE_CODE = `import { startEngine, addUri, tellStatus } from "@risuko/risuko-js";

await startEngine();
const gid = await addUri(["https://example.com/file.zip"], {
  split: "16",
});
const status = await tellStatus(gid);
console.log(\`\${status.completedLength}/\${status.totalLength}\`);`;

const TYPE_MS = 24;
const LINE_PAUSE_MS = 450;

const CLI_TIMING = CLI_LINES.reduce<{ delay: number; at: number }[]>(
  (acc, line) => {
    const at = acc.length ? acc[acc.length - 1].at : 300;
    acc.push({ delay: at, at: at + line.length * TYPE_MS + LINE_PAUSE_MS });
    return acc;
  },
  [],
);

function highlight(code: string) {
  return code
    .split(/("[^"]*"|`[^`]*`|\b(?:import|from|await|const)\b)/)
    .map((part, i) => {
      const key = `${i}-${part}`;
      if (/^(import|from|await|const)$/.test(part))
        return (
          <span key={key} className="text-[oklch(0.8_0.13_293)]">
            {part}
          </span>
        );
      if (/^["`]/.test(part))
        return (
          <span key={key} className="text-[oklch(0.84_0.08_160)]">
            {part}
          </span>
        );
      return <Fragment key={key}>{part}</Fragment>;
    });
}

function CodeCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="ink-card overflow-hidden rounded-3xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <Icon className="h-4 w-4 text-[oklch(0.8_0.13_293)]" />
        <span className="font-mono text-xs text-white/60">{title}</span>
      </div>
      <div className="overflow-x-auto p-5 sm:p-6">{children}</div>
    </div>
  );
}

function DocLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex items-center gap-1.5 rounded-full px-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function ApiSection() {
  const last = CLI_TIMING[CLI_TIMING.length - 1];
  return (
    <Section id="api">
      <Heading
        eyebrow={
          <>
            <Terminal />
            CLI & Node.js
          </>
        }
        title="Scriptable from the terminal or your code"
      >
        The same engine that powers the desktop app is a first-class
        command-line tool and an embeddable Node.js library. Automate downloads
        in shell scripts or wire them into your own app.
      </Heading>

      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-0">
        <div className="reveal min-w-0 lg:col-start-1 lg:col-end-8 lg:row-start-1">
          <CodeCard title="examples/cli.sh" icon={Terminal}>
            <InView className="terminal font-mono text-[13px] leading-[1.9]">
              {CLI_LINES.map((line, i) => (
                <div
                  key={line}
                  className="term-row flex gap-2"
                  style={
                    {
                      "--n": line.length,
                      "--d": `${CLI_TIMING[i].delay}ms`,
                    } as CSSProperties
                  }
                >
                  <span className="select-none text-white/40">$</span>
                  <span className="term-line">
                    <span className="text-[oklch(0.8_0.13_293)]">risuko</span>
                    <span className="text-white/85">{line.slice(6)}</span>
                  </span>
                </div>
              ))}
              <div
                className="term-row flex gap-2"
                style={{ "--d": `${last.at}ms` } as CSSProperties}
              >
                <span className="select-none text-white/40">$</span>
                <span className="term-cursor" />
              </div>
            </InView>
          </CodeCard>
          <DocLink href="/docs/cli">CLI reference</DocLink>
        </div>

        <div className="reveal relative min-w-0 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:mt-44 lg:rotate-[1.5deg]">
          <CodeCard title="examples/quick.ts" icon={FileCode2}>
            <pre className="whitespace-pre font-mono text-[13px] leading-relaxed text-white/85">
              {highlight(NODE_CODE)}
            </pre>
          </CodeCard>
          <DocLink href="/docs/node-api">Node.js API reference</DocLink>
        </div>
      </div>
    </Section>
  );
}

const FEATURES: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  art?: ReactNode;
  tone?: "card" | "accent" | "dots";
  wide?: boolean;
}[] = [
  {
    icon: Rss,
    title: "RSS subscriptions",
    text: "Auto-download new items from any feed you follow.",
    href: "/docs/guides/rss",
    art: <RssArt />,
    wide: true,
  },
  {
    icon: Newspaper,
    title: "Usenet & NZB",
    text: "Native Usenet support with NZB imports.",
    href: "/docs/guides/usenet",
  },
  {
    icon: HeartPulse,
    title: "Health checks",
    text: "Built-in engine and connectivity diagnostics.",
    href: "/docs/guides/health-checks",
  },
  {
    icon: Cookie,
    title: "Browser cookies",
    text: "Import cookies to fetch gated content.",
    href: "/docs/guides/browser-cookies",
  },
  {
    icon: Network,
    title: "Proxy support",
    text: "Route traffic through HTTP or SOCKS proxies.",
    href: "/docs/guides/proxy",
    tone: "dots",
  },
  {
    icon: Magnet,
    title: "BitTorrent",
    text: "Hybrid v1+v2 torrents, WebSeed mirrors, magnets, and seeding controls.",
    href: "/docs/guides/torrent",
    art: <TorrentArt />,
    wide: true,
  },
  {
    icon: Cloud,
    title: "Cloud sinks",
    text: "Push finished files straight to cloud storage.",
    href: "/docs/guides/cloud-uploads",
    art: <CloudArt />,
    wide: true,
  },
  {
    icon: ScrollText,
    title: "Completion scripts",
    text: "Run a script the moment a download finishes.",
    href: "/docs/guides/completion-scripts",
  },
  {
    icon: HardDrive,
    title: "Batch downloads",
    text: "Add hundreds of URLs at once from a list.",
    href: "/docs/guides/batch-downloads",
  },
  {
    icon: Server,
    title: "Headless server",
    text: "Run the engine on a NAS or VPS without a UI.",
    href: "/docs/guides/headless-server",
  },
  {
    icon: Cpu,
    title: "Native Rust core",
    text: "A single dependency-free engine binary.",
    href: "/docs/architecture",
    tone: "accent",
  },
  {
    icon: Route,
    title: "Task routing",
    text: "Sort downloads into folders by filename.",
    href: "/docs/guides/task-routing",
    art: <RoutingArt />,
    wide: true,
  },
];

function FeaturesSection() {
  return (
    <Section id="features">
      <Heading title="Everything else packed into 35 MB" />
      <BentoGrid className="mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <BentoTile
            key={f.title}
            href={f.href}
            icon={<f.icon />}
            title={f.title}
            text={f.text}
            art={f.art}
            tone={f.tone}
            className={f.wide ? "sm:col-span-2" : undefined}
          />
        ))}
      </BentoGrid>
    </Section>
  );
}

const INSTALLS: {
  manager: string;
  items: { label: string; command: string }[];
}[] = [
  {
    manager: "Homebrew",
    items: [
      {
        label: "desktop app",
        command: "brew install --cask yuemiyuki/risuko/risuko-app",
      },
      { label: "CLI", command: "brew install yuemiyuki/risuko/risuko-cli" },
    ],
  },
  {
    manager: "npm",
    items: [
      { label: "app + engine", command: "pnpm install -g @risuko/app" },
      { label: "CLI only", command: "pnpm install -g @risuko/cli" },
    ],
  },
];

function InstallSection() {
  return (
    <Section id="install">
      <div className="grid overflow-hidden rounded-[2rem] border border-border bg-section lg:grid-cols-12">
        <div className="min-w-0 px-6 pt-10 pb-8 sm:px-12 sm:pt-14 lg:col-span-6 lg:py-16 lg:pr-6 lg:pl-14">
          <Heading title="Install it your way">
            Homebrew, npm, or a signed binary for macOS, Windows, Linux, and
            Android. Every release is published to GitHub with checksums and
            signatures.
          </Heading>
          <div className="mt-10 space-y-7">
            {INSTALLS.map((group) => (
              <div key={group.manager}>
                <div className="mb-3 font-display text-lg font-semibold">
                  {group.manager}
                </div>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.command}>
                      <div className="mb-1.5 pl-5 font-mono text-xs text-muted-foreground">
                        {item.label}
                      </div>
                      <CopyCommand command={item.command} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="https://github.com/YueMiyuki/Risuko/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Package className="h-4 w-4" />
            Or grab a binary from GitHub Releases
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="relative min-h-[260px] overflow-hidden sm:min-h-[380px] lg:col-span-6 lg:min-h-0">
          <div className="install-shot absolute top-0 left-6 w-[150%] sm:left-12 lg:top-16 lg:left-4 lg:w-[155%]">
            <AppWindow
              {...SHOTS.github}
              alt="GitHub releases"
              sizes="(max-width: 1024px) 150vw, 75vw"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function DocsFinale() {
  return (
    <Section className="pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-primary/10">
        <div className="grid lg:grid-cols-12">
          <div className="px-6 pt-12 sm:px-12 sm:pt-16 lg:col-span-6 lg:py-20 lg:pl-16">
            <Heading
              eyebrow={
                <>
                  <BookOpen />
                  Documentation
                </>
              }
              title="Ready to dig in?"
            >
              Installation guides, protocol details, the CLI command reference,
              and the full Node.js API, all in one place.
            </Heading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs" className={buttonPrimary}>
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/getting-started/installation"
                className={buttonSecondary}
              >
                Quick start
              </Link>
            </div>
          </div>
          <div className="relative mt-16 pl-6 sm:pl-12 lg:col-span-6 lg:mt-24 lg:pl-4">
            <div className="finale-shot relative">
              <div className="absolute bottom-full left-[12%] w-24 translate-y-[6%] sm:w-32">
                <Mascot className="w-full" />
              </div>
              <AppWindow
                {...SHOTS.appEmpty}
                alt="Empty task list"
                sizes="(max-width: 1024px) 130vw, 65vw"
                className="-mb-[18%] w-[130%] lg:w-[125%]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FeatureSections() {
  return (
    <>
      <ProtocolsSection />
      <CopyDownloadSection />
      <FlyoutSection />
      <ShareSection />
      <PerformanceSection />
      <RpcMetricsSection />
      <ApiSection />
      <FeaturesSection />
      <InstallSection />
      <DocsFinale />
    </>
  );
}
