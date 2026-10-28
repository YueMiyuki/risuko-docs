import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CopyHash } from "@/components/download/copy-hash";
import {
  RecommendedDownload,
  type RecommendOption,
} from "@/components/download/recommended-download";
import { Footer } from "@/components/footer";
import { CopyCommand } from "@/components/landing/copy-command";
import { Paper } from "@/components/landing/paper";
import {
  figureRef,
  PartFigure,
  type PartOf,
  TeardownFigure,
  TeardownSprite,
} from "@/components/landing/teardown/figure";
import { DRAWING } from "@/components/landing/teardown/release-kit.generated";
import { Spine } from "@/components/landing/teardown/spine";
import { INSTALLS } from "@/lib/installs";
import {
  type DownloadItem,
  formatSize,
  getLatestRelease,
  groupDownloads,
  type PlatformGroup,
  type PlatformId,
  type RecommendKey,
  type Release,
} from "@/lib/release";
import { downloadJsonLd, JsonLd, openGraph } from "@/lib/seo";
import { gitConfig } from "@/lib/shared";
import "../paper.css";

const title = "Download Risuko for macOS, Windows, Linux & Android";
const description =
  "Download the latest Risuko release for macOS, Windows, Linux and Android, or the standalone CLI. Free and open source, with SHA-256 checksums to verify each file.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/download" },
  openGraph: openGraph({ url: "/download", title, description }),
};

type PartId = PartOf<typeof DRAWING>;

const releasesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/releases`;

const HINTS: Partial<Record<PlatformId, string>> = {
  macos: "Not sure which chip you have? Apple menu → About This Mac.",
  windows:
    "The installer sets Risuko up for your account only. The portable build runs without installing.",
  linux:
    "The AppImage runs on most distributions. Use the DEB or RPM package to install system-wide.",
  android: "Most phones and tablets need arm64-v8a.",
  cli: "Unpack the archive and put the risuko binary on your PATH.",
};

function codename(release: Release) {
  const name = release.name.replace(/^Risuko\s+v?\S+\s*[-–—]\s*/i, "");
  return name === release.name ? null : name;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function Section({
  id,
  no,
  title,
  lede,
  parts,
  reassemble,
  children,
}: {
  id: string;
  no: number;
  title: string;
  lede?: ReactNode;
  parts?: PartId[];
  reassemble?: boolean;
  children: ReactNode;
}) {
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
          <span className="sec-no">{String(no).padStart(2, "0")}</span>
          {parts?.length ? (
            <span className="sec-ref">{figureRef(DRAWING, parts)}</span>
          ) : null}
        </p>
        {parts?.length ? <PartFigure drawing={DRAWING} parts={parts} /> : null}
        <h2 className="sec-title">{title}</h2>
        {lede ? <p className="sec-lede">{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

function DownloadRow({
  item,
  platform,
}: {
  item: DownloadItem;
  platform: string;
}) {
  return (
    <li className="dl-row">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-medium">{item.label}</span>
          <span className="tag">{item.kind}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted-foreground">
          <span className="tabular-nums">{formatSize(item.asset.size)}</span>
          {item.asset.sha256 ? (
            <CopyHash hash={item.asset.sha256} file={item.asset.name} />
          ) : null}
        </div>
      </div>
      <a
        href={item.asset.url}
        aria-label={`Download ${platform} ${item.label} ${item.kind}`}
        className="btn btn-line btn-sm"
      >
        <Download aria-hidden />
        <span className="max-sm:hidden">Download</span>
      </a>
    </li>
  );
}

function Platform({
  group,
  no,
  id,
}: {
  group: PlatformGroup;
  no: number;
  id: string;
}) {
  const hint = HINTS[group.id];
  return (
    <Section
      id={id}
      no={no}
      title={group.name}
      lede={group.requirement}
      parts={[group.id]}
    >
      <ul className="dl-list">
        {group.items.map((item) => (
          <DownloadRow
            key={item.asset.name}
            item={item}
            platform={group.name}
          />
        ))}
      </ul>
      {hint ? <p className="footnote">{hint}</p> : null}
    </Section>
  );
}

function OutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      {children}
      <ArrowUpRight aria-hidden />
    </a>
  );
}

export default async function DownloadPage() {
  const release = await getLatestRelease();
  const groups = release ? groupDownloads(release) : [];
  const apps = groups.filter((group) => group.id !== "cli");
  const cli = groups.find((group) => group.id === "cli");

  const options: Partial<Record<RecommendKey, RecommendOption>> = {};
  for (const group of apps) {
    for (const item of group.items) {
      if (item.recommend) {
        options[item.recommend] = {
          platform: group.name,
          detail: `${item.label} · ${item.kind} · ${formatSize(item.asset.size)}`,
          url: item.asset.url,
        };
      }
    }
  }

  const released = release ? formatDate(release.publishedAt) : null;
  const title = release ? codename(release) : null;
  const platforms = cli ? [...apps, cli] : apps;
  const rows = release ? platforms.length + 3 : 2;

  return (
    <Paper>
      <JsonLd
        data={downloadJsonLd(
          release,
          Object.values(options).map((option) => option.url),
        )}
      />
      <Spine className="spine">
        <section data-spine-section data-parts="" className="hero">
          {release ? (
            <p className="tag">
              v{release.version}
              {title ? ` · ${title}` : null}
            </p>
          ) : null}
          <h1 className="hero-title">Download Risuko</h1>
          <p className="hero-lede">
            Free and open source for macOS, Windows, Linux, and Android.
            {release?.source === "mirror"
              ? " Files are served from Cloudflare's global network and mirrored from GitHub Releases."
              : null}
            {released ? ` Released ${released}.` : null}
          </p>
          {release ? (
            <div className="actions">
              <RecommendedDownload options={options} />
            </div>
          ) : null}
        </section>

        <div
          data-spine-figure
          className="spine-fig"
          style={{ "--rows": rows } as CSSProperties}
        >
          <div className="spine-sticky">
            <TeardownFigure drawing={DRAWING} />
          </div>
        </div>

        {release ? (
          <>
            {platforms.map((group, i) => (
              <Platform
                key={group.id}
                group={group}
                no={i + 1}
                id={i === 0 ? "platforms" : group.id}
              />
            ))}

            <Section
              id="package-managers"
              no={platforms.length + 1}
              title="Package managers"
              lede="Homebrew and npm"
              parts={["packages"]}
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
            </Section>

            <Section
              id="verify"
              no={platforms.length + 2}
              title="Verify your download"
              lede="Click a checksum above to copy it, then compare it with the SHA-256 of the file you downloaded."
              parts={["seal"]}
              reassemble
            >
              <div className="installs">
                <div>
                  <div className="mono-note mb-1.5">macOS and Linux</div>
                  <CopyCommand
                    command={`shasum -a 256 Risuko_${release.version}_darwin_arm64.dmg`}
                    variant="plain"
                  />
                </div>
                <div>
                  <div className="mono-note mb-1.5">Windows PowerShell</div>
                  <CopyCommand
                    command={`Get-FileHash Risuko_${release.version}_win32_x64.setup.exe`}
                    variant="plain"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6">
                <OutLink href={`${releasesUrl}/tag/${release.tag}`}>
                  Release notes
                </OutLink>
                <OutLink href={releasesUrl}>Older versions on GitHub</OutLink>
                <Link
                  href="/docs/getting-started/quick-start"
                  className="text-link"
                >
                  Quick start guide
                  <ArrowRight aria-hidden />
                </Link>
              </div>
            </Section>
          </>
        ) : (
          <section data-spine-section data-parts="" className="sec">
            <header>
              <p className="sec-meta">
                <span className="sec-no">01</span>
              </p>
              <h2 className="sec-title">
                The release list is unavailable right now
              </h2>
              <p className="sec-lede">
                Every build is also published on GitHub.
              </p>
            </header>
            <a
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ink"
            >
              Open GitHub Releases
              <ArrowUpRight aria-hidden />
            </a>
          </section>
        )}
      </Spine>
      <TeardownSprite drawing={DRAWING} />
      <Footer cta={false} wide />
    </Paper>
  );
}
