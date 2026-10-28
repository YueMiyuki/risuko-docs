import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, Fragment, type ReactNode } from "react";
import { CopyCommand } from "@/components/landing/copy-command";
import { LazyVideo } from "@/components/landing/lazy-video";
import { Mascot } from "@/components/landing/mascot";
import { DRAWING } from "@/components/landing/teardown/engine-stack.generated";
import {
  figureRef,
  PartFigure,
  type PartOf,
  TeardownFigure,
  TeardownSprite,
} from "@/components/landing/teardown/figure";
import { Spine } from "@/components/landing/teardown/spine";
import { AppWindow, SHOTS } from "@/components/landing/window-frame";
import { cn } from "@/lib/cn";
import { INSTALLS } from "@/lib/installs";

type PartId = PartOf<typeof DRAWING>;

const COLUMN = "(min-width: 1024px) 56vw, 100vw";

function Section({
  id,
  no,
  eyebrow,
  title,
  lede,
  parts,
  reference,
  reassemble,
  children,
}: {
  id: string;
  no: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  parts?: PartId[];
  reference?: string;
  reassemble?: boolean;
  children?: ReactNode;
}) {
  const ref = parts?.length ? figureRef(DRAWING, parts) : reference;
  return (
    <section
      id={id}
      data-spine-section
      data-parts={parts?.join(" ") ?? ""}
      data-reassemble={reassemble ? "" : undefined}
      className="sec"
    >
      <header>
        <p className="sec-meta">
          <span className="sec-no">{no}</span>
          {eyebrow ? <span>{eyebrow}</span> : null}
          {ref ? <span className="sec-ref">{ref}</span> : null}
        </p>
        {parts?.length ? <PartFigure drawing={DRAWING} parts={parts} /> : null}
        <h2 className="sec-title">{title}</h2>
        {lede ? <p className="sec-lede">{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

function Tag({ children }: { children: string }) {
  return <p className="tag">{children}</p>;
}

function VideoPlate(props: { src: string; poster: string; label: string }) {
  return (
    <div className="plate plate-dark">
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

function Hero() {
  return (
    <section data-spine-section data-parts="" className="hero">
      <h1 className="hero-title">
        Your next internet download manager,{" "}
        <span className="text-primary">in Rust.</span>
      </h1>
      <p className="hero-lede">
        Everything you need to download from the internet, in one place.
      </p>
      <p className="hero-note">
        Risuko is a free, open-source (MIT) download manager for macOS, Windows,
        Linux and Android.
      </p>
      <div className="actions">
        <Link href="/download" className="btn btn-ink">
          <Download aria-hidden />
          Download Risuko
        </Link>
        <Link href="/docs" className="btn btn-line">
          Read the docs
          <ArrowRight aria-hidden />
        </Link>
      </div>
      <AppWindow
        {...SHOTS.appTasks}
        alt="Risuko’s main window: the All task list with a multi-file Big Buck Bunny download and a 5 GB file downloading at 13.9 MB/s"
        preload
        fetchPriority="high"
        sizes={COLUMN}
        className="hero-shot"
      />
    </section>
  );
}

const PROTOCOLS = [
  "HTTP / HTTPS",
  "BitTorrent v1+v2 + WebSeed",
  "Magnet",
  "FTP / FTPS / SFTP",
  "M3U8 / HLS",
  "Usenet / NZB",
  "ED2K",
  "ADC / DC (links only)",
  "Gnutella / G2",
  "giFT bridge (needs giftd)",
];

const BENCH = [
  { value: 84, label: "smaller binary", detail: "219.3 MB → 35 MB" },
  { value: 72, label: "less memory", detail: "~425 MB → ~120 MB" },
  { value: 83, label: "less peak CPU", detail: "~145% → 25%" },
];

function Contender({
  name,
  size,
  about,
  aboutAlt,
  chart,
  chartAlt,
  winner,
}: {
  name: string;
  size: string;
  about: (typeof SHOTS)["motrixAbout" | "risukoAbout"];
  aboutAlt: string;
  chart: string;
  chartAlt: string;
  winner?: boolean;
}) {
  return (
    <div className="contender">
      <div className="contender-head">
        <span className={cn("font-medium", winner && "text-primary")}>
          {name}
        </span>
        <span className="mono-note">{size}</span>
      </div>
      <AppWindow
        {...about}
        alt={aboutAlt}
        sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
        className="mx-auto mt-6 w-[78%]"
      />
      <div className="plate plate-dark mt-6 p-2 sm:p-3">
        <Image
          src={chart}
          alt={chartAlt}
          className="block h-auto w-full"
          width={640}
          height={480}
          sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
          quality={90}
        />
      </div>
    </div>
  );
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="ticks">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const CLI_LINES = [
  "risuko download https://example.com/file.iso -t 16",
  'risuko download "magnet:?xt=urn:btih:abc123..." --seed-ratio 1.0',
  "risuko status --json",
  "risuko pause a1b2c3d4 && risuko resume a1b2c3d4",
];

const NODE_CODE = `import risuko from "@risuko/risuko-js";

const { startEngine, addUri, tellStatus } = risuko;

await startEngine();
const gid = await addUri(["https://example.com/file.zip"], {
  split: "16",
});
const status = await tellStatus(gid);
console.log(\`\${status.completedLength}/\${status.totalLength}\`);`;

function highlight(code: string) {
  return code
    .split(/("[^"]*"|`[^`]*`|\b(?:import|from|await|const)\b)/)
    .map((part, i) => {
      const key = `${i}-${part}`;
      if (/^(import|from|await|const)$/.test(part))
        return (
          <span key={key} className="tok-key">
            {part}
          </span>
        );
      if (/^["`]/.test(part))
        return (
          <span key={key} className="tok-str">
            {part}
          </span>
        );
      return <Fragment key={key}>{part}</Fragment>;
    });
}

function Code({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="code">
      <div className="code-head">{title}</div>
      <pre>{children}</pre>
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="text-link">
      {children}
      <ArrowRight aria-hidden />
    </Link>
  );
}

const FEATURES: {
  title: string;
  text: string;
  href: string;
  parts: PartId[];
}[] = [
  {
    title: "RSS subscriptions",
    text: "Auto-download new items from any feed you follow.",
    href: "/docs/guides/rss",
    parts: ["handlers"],
  },
  {
    title: "Usenet & NZB",
    text: "Native Usenet support with NZB imports.",
    href: "/docs/guides/usenet",
    parts: ["handlers"],
  },
  {
    title: "Health checks",
    text: "Built-in engine and connectivity diagnostics.",
    href: "/docs/guides/health-checks",
    parts: ["core"],
  },
  {
    title: "Browser cookies",
    text: "Import cookies to fetch gated content.",
    href: "/docs/guides/browser-cookies",
    parts: ["handlers"],
  },
  {
    title: "Proxy support",
    text: "Route traffic through HTTP or SOCKS proxies.",
    href: "/docs/guides/proxy",
    parts: ["handlers"],
  },
  {
    title: "BitTorrent",
    text: "Hybrid v1+v2 torrents, WebSeed mirrors, magnets, and seeding controls.",
    href: "/docs/guides/torrent",
    parts: ["handlers"],
  },
  {
    title: "Cloud sinks",
    text: "Push finished files straight to cloud storage.",
    href: "/docs/guides/cloud-uploads",
    parts: ["cloud"],
  },
  {
    title: "Completion scripts",
    text: "Run a script the moment a download finishes.",
    href: "/docs/guides/completion-scripts",
    parts: ["queue"],
  },
  {
    title: "Batch downloads",
    text: "Add hundreds of URLs at once from a list.",
    href: "/docs/guides/batch-downloads",
    parts: ["queue"],
  },
  {
    title: "Headless server",
    text: "Run the engine on a NAS or VPS without a UI.",
    href: "/docs/guides/headless-server",
    parts: ["rpc"],
  },
  {
    title: "Native Rust core",
    text: "A single native engine binary, no aria2 or Electron.",
    href: "/docs/architecture",
    parts: ["core"],
  },
  {
    title: "Task routing",
    text: "Sort downloads into folders by filename.",
    href: "/docs/guides/task-routing",
    parts: ["queue", "disk"],
  },
];

function Sections() {
  return (
    <>
      <Section
        id="protocols"
        no="01"
        eyebrow="Multi-protocol"
        title="One engine for HTTP, BitTorrent, Usenet and more"
        parts={["handlers"]}
        lede="From plain HTTPS to BEP 52 hybrid torrents with WebSeed mirrors, HLS streams, Usenet, and a giFT IPC bridge. Add a URL or a magnet link and Risuko routes it to the right handler, all within a single unified queue."
      >
        <ol className="spec-list">
          {PROTOCOLS.map((protocol, i) => (
            <li key={protocol}>
              <span className="spec-no">{String(i + 1).padStart(2, "0")}</span>
              {protocol}
            </li>
          ))}
        </ol>
        <TextLink href="/docs/architecture/protocols">
          How each protocol handler works
        </TextLink>
      </Section>

      <Section
        id="copy-to-download"
        no="02"
        title="Copy a link, start a download"
        parts={["desktop"]}
        lede="Risuko watches your clipboard. Copy any supported URL or magnet link and it offers to queue it instantly. No window switching, no pasting. Just copy and go."
      >
        <Tag>Clipboard monitoring</Tag>
        <VideoPlate
          src="/showcases/copy-to-download.mp4"
          poster="/showcases/copy-to-download-poster.jpg"
          label="Screen recording: copying a link makes Risuko offer to download it"
        />
      </Section>

      <Section
        id="flyout"
        no="03"
        title="Your queue, one click from the tray"
        parts={["flyout"]}
        lede="A compact flyout lives in your menu bar. Glance at speeds, pause or resume, filter tasks, and add a new download without ever opening the full window."
      >
        <div className="plate plate-soft flyout-plate">
          <Image
            src="/showcases/flyout.png"
            alt="Risuko’s tray flyout under the macOS menu bar, with download and upload speeds, task filters, a search field, and pause, resume and add buttons"
            width={980}
            height={1178}
            sizes="(min-width: 640px) 380px, 80vw"
            quality={90}
            className="block h-auto w-full"
          />
        </div>
      </Section>

      <Section
        id="share"
        no="04"
        eyebrow="Risuko Share"
        title="Send a download to any of your devices"
        parts={["share"]}
        lede="Push a task from your laptop straight to your phone, or pull a finished file down anywhere. Share syncs through your Risuko account and keeps every device on the same queue."
      >
        <Tag>Requires login</Tag>
        <VideoPlate
          src="/showcases/file-share.mp4"
          poster="/showcases/file-share-poster.jpg"
          label="Screen recording: sending a download to another device with Risuko Share"
        />
        <TextLink href="/docs/guides/share">How Risuko Share works</TextLink>
      </Section>

      <Section
        id="performance"
        no="05"
        title="A quarter of Motrix’s memory. A sixth of its CPU."
        parts={["core"]}
        lede="Risuko replaced the aria2 backend with a native Rust engine. Measured while idle with psrecord over 60 seconds, it uses dramatically less than the original Motrix it is based on, and its memory stays flat for the whole run."
      >
        <dl className="bench">
          {BENCH.map((b) => (
            <div key={b.label}>
              <dt className="bench-value">{b.value}%</dt>
              <dd>
                <span className="block font-medium">{b.label}</span>
                <span className="mono-note">{b.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="contenders">
          <Contender
            name="Motrix (original)"
            size="219.3 MB · Electron + aria2"
            about={SHOTS.motrixAbout}
            aboutAlt="macOS info panel for Motrix 1.8.19: 219.3 MB"
            chart="/showcases/motrix-perf.png"
            chartAlt="psrecord chart of Motrix idling for 60 seconds: memory flat near 430 MB, with CPU spikes up to about 140%"
          />
          <Contender
            name="Risuko"
            size="35 MB · native Rust"
            about={SHOTS.risukoAbout}
            aboutAlt="macOS info panel for Risuko 0.2.0: 19.6 MB"
            chart="/showcases/risuko-perf.png"
            chartAlt="psrecord chart of Risuko idling for 60 seconds: memory flat near 128 MB, with CPU mostly under 2% and one spike to about 27%"
            winner
          />
        </div>
        <p className="footnote">
          Baseline: the original{" "}
          <a
            href="https://github.com/agalwood/Motrix"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motrix
          </a>{" "}
          project. The info panels above show the versions compared, Motrix
          1.8.19 and Risuko 0.2.0, both on macOS. Profiles captured with{" "}
          <a
            href="https://github.com/astrofrog/psrecord"
            target="_blank"
            rel="noopener noreferrer"
          >
            psrecord
          </a>
          .
        </p>
      </Section>

      <Section
        id="rpc"
        no="06"
        title="Drop-in Aria2-compatible RPC"
        parts={["rpc"]}
        lede="Risuko exposes an Aria2Next-compatible JSON-RPC listener. Point AriaNg, PeerBanHelper, or any Aria2 client you already use straight at Risuko. Copy the RPC URL and you are connected."
      >
        <Ticks
          items={[
            "Configurable listen port and secret token",
            "Works with existing Aria2 front-ends and tooling",
            "One-click “Copy RPC URL” and secret manual",
          ]}
        />
        <AppWindow
          {...SHOTS.rpc}
          alt="Risuko Preferences, Advanced tab: RPC listen port 16800, the RPC secret, a Copy RPC URL button, and the PeerBanHelper listener option"
          sizes={COLUMN}
          className="shot"
        />
        <TextLink href="/docs/architecture/rpc">
          RPC protocol reference
        </TextLink>
      </Section>

      <Section
        id="metrics"
        no="07"
        title="See exactly what you have downloaded"
        parts={["stats"]}
        lede="Break down volume by protocol and month, scrub speed history in adjustable time buckets, and pick any date range. Every byte HTTP, BitTorrent, and Usenet moved is accounted for."
      >
        <Ticks
          items={[
            "Per-protocol and per-month totals",
            "Speed history with adjustable buckets",
            "Custom date ranges: 1d, 7d, 30d, 6mo, 1yr",
          ]}
        />
        <AppWindow
          {...SHOTS.stats}
          alt="Risuko’s Stats page: data received per month by protocol (HTTP, BitTorrent, Usenet), a date range picker and a speed history chart"
          sizes={COLUMN}
          className="shot"
        />
      </Section>

      <Section
        id="api"
        no="08"
        eyebrow="CLI & Node.js"
        title="Scriptable from the terminal or your code"
        parts={["cli", "node"]}
        lede="The same engine that powers the desktop app is a first-class command-line tool and an embeddable Node.js library. Automate downloads in shell scripts or wire them into your own app."
      >
        <div className="space-y-8">
          <div>
            <Code title="examples/cli.sh">
              {CLI_LINES.map((line) => (
                <span key={line} className="block">
                  <span className="tok-mute select-none">$ </span>
                  <span className="tok-key">risuko</span>
                  {line.slice(6)}
                </span>
              ))}
            </Code>
            <TextLink href="/docs/cli">CLI reference</TextLink>
          </div>
          <div>
            <Code title="examples/quick.ts">{highlight(NODE_CODE)}</Code>
            <TextLink href="/docs/node-api">Node.js API reference</TextLink>
          </div>
        </div>
      </Section>

      <Section
        id="features"
        no="09"
        title="Everything else packed into 35 MB"
        reference="Fig. 1 — hover an item to find it"
      >
        <ul className="index-list">
          {FEATURES.map((f) => (
            <li key={f.title} data-hover-parts={f.parts.join(" ")}>
              <Link href={f.href}>
                <span className="index-title">
                  {f.title}
                  <ArrowUpRight aria-hidden />
                </span>
                <span className="index-text">{f.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="install"
        no="10"
        title="Install Risuko your way"
        reference="Fig. 1 — assembled"
        reassemble
        lede="Homebrew, npm, or a signed binary for macOS, Windows, Linux, and Android. Every release is published to GitHub with checksums and signatures."
      >
        <div className="installs">
          {INSTALLS.map((group) => (
            <div key={group.manager}>
              <h3 className="installs-head">{group.manager}</h3>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.command}>
                    <div className="mono-note mb-1.5">{item.label}</div>
                    <CopyCommand command={item.command} variant="plain" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link href="/download" className="text-link">
          Or grab a binary from the download page
          <ArrowRight aria-hidden />
        </Link>
        <AppWindow
          {...SHOTS.github}
          alt="Risuko’s GitHub Releases page: a release changelog, contributors and the list of assets with SHA-256 checksums"
          sizes={COLUMN}
          className="shot"
        />
      </Section>
    </>
  );
}

function Finale() {
  return (
    <section className="finale">
      <div className="finale-copy">
        <p className="sec-meta">
          <span className="sec-no">11</span>
          <span>Documentation</span>
        </p>
        <h2 className="sec-title">Ready to dig in?</h2>
        <p className="sec-lede">
          Installation guides, protocol details, the CLI command reference, and
          the full Node.js API, all in one place.
        </p>
        <div className="actions">
          <Link href="/docs" className="btn btn-ink">
            Read the docs
            <ArrowRight aria-hidden />
          </Link>
          <Link
            href="/docs/getting-started/installation"
            className="btn btn-line"
          >
            Quick start
          </Link>
        </div>
      </div>
      <div className="finale-shot">
        <Mascot className="finale-mascot" />
        <AppWindow
          {...SHOTS.appEmpty}
          alt="Risuko’s main window with an empty task list and an Add Task button"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Spine className="spine">
        <Hero />
        <div
          data-spine-figure
          className="spine-fig"
          style={{ "--rows": 11 } as CSSProperties}
        >
          <div className="spine-sticky">
            <TeardownFigure drawing={DRAWING} />
          </div>
        </div>
        <Sections />
      </Spine>
      <Finale />
      <TeardownSprite drawing={DRAWING} />
    </>
  );
}
