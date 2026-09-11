import {
  ArrowRight,
  Clipboard,
  Cloud,
  Cookie,
  Cpu,
  HardDrive,
  HeartPulse,
  type LucideIcon,
  Magnet,
  Network,
  Newspaper,
  Package,
  PanelTop,
  Route,
  Rss,
  ScrollText,
  Server,
  Terminal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CopyCommand } from "@/components/landing/copy-command";
import {
  CloudArt,
  RoutingArt,
  RssArt,
  TorrentArt,
} from "@/components/landing/feature-art";
import {
  SpotlightCell,
  SpotlightGrid,
} from "@/components/landing/spotlight-grid";
import {
  GITHUB_FRAME,
  METRICS_FRAME,
  RPC_FRAME,
  SectionHeading,
  Shot,
  Showcase,
  ShowcaseVideo,
  Stack,
} from "@/components/landing/window-frame";
import { cn } from "@/lib/cn";

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
    <section
      id={id}
      className={cn(
        "mx-auto max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2 text-sm text-muted-foreground sm:text-base">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

const PROTOCOLS = [
  "HTTP / HTTPS",
  "BitTorrent v1+v2 + WebSeed",
  "Magnet",
  "FTP / SFTP",
  "M3U8 / HLS",
  "Usenet / NZB",
  "ED2K",
  "ADC / DC",
  "Gnutella / G2",
  "giFT bridge",
];

function MultiProtocolSection() {
  return (
    <Section id="protocols">
      <Showcase
        reverse
        text={
          <div>
            <SectionHeading
              eyebrow="Multi-protocol"
              title="One engine speaks every protocol"
              description="From plain HTTPS to BEP 52 hybrid torrents with WebSeed mirrors, HLS streams, Usenet, and a giFT IPC bridge. Add a URL or a magnet link and Risuko routes it to the right handler, all within a single unified queue."
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {PROTOCOLS.map((p) => (
                <li
                  key={p}
                  className="rounded-md border border-border/60 bg-foreground/10 px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        }
        media={
          <Shot
            pin="top-right"
            src="/showcases/app-tasks.png"
            alt="Task list with tasks"
            width={2272}
            height={1762}
          />
        }
      />
    </Section>
  );
}

const BENCH = [
  { value: "84%", label: "smaller binary", detail: "219.3 MB → 35 MB" },
  { value: "72%", label: "less memory", detail: "~425 MB → ~120 MB" },
  { value: "83%", label: "less peak CPU", detail: "~145% → 25%" },
];

function PerfChart({
  src,
  name,
  size,
  highlight,
}: {
  src: string;
  name: string;
  size: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card",
        highlight ? "border-primary/50" : "border-border/60",
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <span
          className={cn(
            "text-sm font-medium",
            highlight ? "text-primary" : "text-foreground",
          )}
        >
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{size}</span>
      </div>
      <div className="bg-black p-3">
        <Image
          src={src}
          alt={`${name} performance profile`}
          className="block h-auto w-full"
          width={640}
          height={480}
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={90}
        />
      </div>
    </div>
  );
}

function PerformanceSection() {
  return (
    <Section id="performance">
      <div className="rounded-lg bg-section px-6 py-12 sm:px-12 sm:py-16 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <SectionHeading
            className="lg:col-span-7"
            eyebrow="Performance"
            title="A quarter of the memory. A sixth of the CPU."
            description="Risuko replaced the aria2 backend with a native Rust engine. Measured while idle with psrecord over 60 seconds, it uses dramatically less than the original Motrix it is based on — with zero memory leaks."
          />
          <div className="grid grid-cols-3 gap-6 lg:col-span-5">
            {BENCH.map((b) => (
              <div key={b.label}>
                <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {b.value}
                </div>
                <div className="mt-1 text-sm font-medium">{b.label}</div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {b.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <PerfChart
            src="/showcases/motrix-perf.png"
            name="Motrix (original)"
            size="219.3 MB · Electron + aria2"
          />
          <PerfChart
            src="/showcases/risuko-perf.png"
            name="Risuko"
            size="35 MB · native Rust"
            highlight
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
      </div>
    </Section>
  );
}

function ShareSection() {
  return (
    <Section id="share">
      <Stack
        text={
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeading
              eyebrow="Risuko Share"
              title="Send a download to any of your devices"
              description="Push a task from your laptop straight to your phone, or pull a finished file down anywhere. Share syncs through your Risuko account and keeps every device on the same queue."
            />
            <div className="inline-flex shrink-0 items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm text-foreground">
              <User className="h-4 w-4 text-primary" />
              Requires login
            </div>
          </div>
        }
        media={
          <ShowcaseVideo
            src="/showcases/file-share.mp4"
            poster="/showcases/file-share-poster.jpg"
            width={1280}
            height={832}
            label="Risuko Share"
          />
        }
      />
    </Section>
  );
}

const INSTALLS: { label: string; command: string }[] = [
  {
    label: "Homebrew — desktop app",
    command: "brew install --cask yuemiyuki/risuko/risuko-app",
  },
  {
    label: "Homebrew — CLI",
    command: "brew install yuemiyuki/risuko/risuko-cli",
  },
  { label: "npm — app + engine", command: "pnpm install -g @risuko/app" },
  { label: "npm — CLI only", command: "pnpm install -g @risuko/cli" },
];

function InstallSection() {
  return (
    <Section id="install">
      <Showcase
        crop="side"
        text={
          <div>
            <SectionHeading
              eyebrow="Installation"
              title="Install it your way"
              description="Homebrew, npm, or a signed binary for macOS, Windows, Linux, and Android. Every release is published to GitHub with checksums and signatures."
            />
            <div className="mt-8 space-y-4">
              {INSTALLS.map((i) => (
                <div key={i.command}>
                  <div className="mb-1.5 font-mono text-xs text-muted-foreground">
                    {i.label}
                  </div>
                  <CopyCommand command={i.command} />
                </div>
              ))}
            </div>
            <Link
              href="https://github.com/YueMiyuki/Risuko/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Package className="h-4 w-4" />
              Or grab a binary from GitHub Releases
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
        media={
          <Shot
            pin="left"
            frame={GITHUB_FRAME}
            src="/showcases/github-releases.png"
            alt="GitHub releases"
            width={3248}
            height={2122}
          />
        }
      />
    </Section>
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

function CodePane({
  title,
  icon: Icon,
  children,
  href,
  linkText,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border/70 bg-background/60 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-4 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="flex-1 overflow-x-auto p-5">{children}</div>
      <div className="border-t border-border/40 px-4 py-3">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {linkText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ApiSection() {
  return (
    <Section id="api">
      <Stack
        text={
          <SectionHeading
            eyebrow="CLI & Node.js"
            title="Scriptable from the terminal or your code"
            description="The same engine that powers the desktop app is a first-class command-line tool and an embeddable Node.js library. Automate downloads in shell scripts or wire them into your own app."
          />
        }
        media={
          <div className="grid gap-5 lg:grid-cols-2">
            <CodePane
              title="examples/cli.sh"
              icon={Terminal}
              href="/docs/cli"
              linkText="CLI reference"
            >
              <pre className="font-mono text-[13px] leading-relaxed sm:text-sm">
                {CLI_LINES.map((line) => (
                  <div key={line} className="whitespace-pre-wrap break-all">
                    <span className="text-primary">risuko</span>
                    <span className="text-foreground/80">{line.slice(6)}</span>
                  </div>
                ))}
              </pre>
            </CodePane>
            <CodePane
              title="examples/quick.ts"
              icon={Package}
              href="/docs/node-api"
              linkText="Node.js API reference"
            >
              <pre className="whitespace-pre-wrap break-all font-mono text-[13px] leading-relaxed text-foreground/80 sm:text-sm">
                {NODE_CODE}
              </pre>
            </CodePane>
          </div>
        }
      />
    </Section>
  );
}

function RpcSection() {
  return (
    <Section id="rpc">
      <Showcase
        reverse
        crop="side"
        text={
          <div>
            <SectionHeading
              eyebrow="JSON-RPC"
              title="Drop-in Aria2-compatible RPC"
              description="Risuko exposes an Aria2Next-compatible JSON-RPC listener. Point AriaNg, PeerBanHelper, or any Aria2 client you already use straight at Risuko — copy the RPC URL and you are connected."
            />
            <Bullets
              items={[
                "Configurable listen port and secret token",
                "Works with existing Aria2 front-ends and tooling",
                "One-click \u201cCopy RPC URL\u201d and secret manual",
              ]}
            />
          </div>
        }
        media={
          <Shot
            pin="right"
            frame={RPC_FRAME}
            src="/showcases/rpc.png"
            alt="Risuko JSON-RPC"
            width={2272}
            height={1762}
          />
        }
      />
    </Section>
  );
}

function MetricsSection() {
  return (
    <Section id="metrics">
      <Showcase
        crop="side"
        text={
          <div>
            <SectionHeading
              eyebrow="Metrics"
              title="See exactly what you have downloaded"
              description="Break down volume by protocol and month, scrub speed history in adjustable time buckets, and pick any date range. Every byte HTTP, BitTorrent, and Usenet moved is accounted for."
            />
            <Bullets
              items={[
                "Per-protocol and per-month totals",
                "Speed history with adjustable buckets",
                "Custom date ranges: 1d, 7d, 30d, 6mo, 1yr",
              ]}
            />
          </div>
        }
        media={
          <Shot
            pin="left"
            frame={METRICS_FRAME}
            src="/showcases/stats.png"
            alt="Risuko stats page"
            width={2272}
            height={1762}
          />
        }
      />
    </Section>
  );
}

function CopyDownloadSection() {
  return (
    <Section id="copy-to-download">
      <Stack
        text={
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeading
              eyebrow="Copy to download"
              title="Copy a link, start a download"
              description="Risuko watches your clipboard. Copy any supported URL or magnet link and it offers to queue it instantly — no window switching, no pasting. Just copy and go."
            />
            <div className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border/60 bg-background/50 px-4 py-2.5 text-sm text-muted-foreground">
              <Clipboard className="h-4 w-4 text-primary" />
              Clipboard monitoring
            </div>
          </div>
        }
        media={
          <ShowcaseVideo
            src="/showcases/copy-to-download.mp4"
            poster="/showcases/copy-to-download-poster.jpg"
            width={1280}
            height={832}
            label="Copy to download"
          />
        }
      />
    </Section>
  );
}

function FlyoutSection() {
  return (
    <Section id="flyout">
      <Showcase
        crop="bottom"
        minHeightClassName="lg:min-h-[560px]"
        text={
          <div>
            <SectionHeading
              eyebrow="Menu-bar flyout"
              title="Your queue, one click from the tray"
              description="A compact flyout lives in your menu bar. Glance at speeds, pause or resume, filter tasks, and add a new download without ever opening the full window."
            />
          </div>
        }
        media={
          <Shot
            framed
            frame={null}
            src="/showcases/flyout.png"
            alt="Risuko flyout"
            width={980}
            height={1178}
            sizes="(max-width: 640px) 80vw, 440px"
          />
        }
      />
    </Section>
  );
}

const FEATURES: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  art?: ReactNode;
}[] = [
  {
    icon: Rss,
    title: "RSS subscriptions",
    text: "Auto-download new items from any feed you follow.",
    href: "/docs/guides/rss",
    art: <RssArt />,
  },
  {
    icon: Magnet,
    title: "BitTorrent",
    text: "Hybrid v1+v2 torrents, WebSeed mirrors, magnets, and seeding controls.",
    href: "/docs/guides/torrent",
    art: <TorrentArt />,
  },
  {
    icon: Cloud,
    title: "Cloud sinks",
    text: "Push finished files straight to cloud storage.",
    href: "/docs/guides/cloud-uploads",
    art: <CloudArt />,
  },
  {
    icon: Route,
    title: "Task routing",
    text: "Sort downloads into folders by filename.",
    href: "/docs/guides/task-routing",
    art: <RoutingArt />,
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
  },
];

function MoreFeaturesSection() {
  return (
    <Section id="features" className="pt-16 sm:pt-24">
      <SectionHeading
        eyebrow="And more"
        title="Everything else packed into 35 MB"
      />
      <SpotlightGrid className="mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <SpotlightCell
            key={f.title}
            href={f.href}
            icon={<f.icon className="h-5 w-5" />}
            title={f.title}
            text={f.text}
            art={f.art}
          />
        ))}
      </SpotlightGrid>
    </Section>
  );
}

function DocsCta() {
  return (
    <Section className="py-16 sm:py-24">
      <div className="rounded-lg bg-section bg-gradient-to-br from-primary/10 to-section px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Documentation
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to dig in?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Installation guides, protocol details, the CLI command reference,
            and the full Node.js API — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open the docs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/getting-started/installation"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-border/60 bg-background/40 px-6 font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Quick start
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FeatureSections() {
  return (
    <>
      <MultiProtocolSection />
      <PerformanceSection />
      <ShareSection />
      <InstallSection />
      <ApiSection />
      <RpcSection />
      <MetricsSection />
      <CopyDownloadSection />
      <FlyoutSection />
      <MoreFeaturesSection />
      <DocsCta />
    </>
  );
}
