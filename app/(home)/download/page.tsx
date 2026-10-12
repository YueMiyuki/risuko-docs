import {
  Apple,
  ArrowUpRight,
  Download,
  Grid2x2,
  type LucideIcon,
  Monitor,
  Package,
  ShieldCheck,
  Smartphone,
  SquareTerminal,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CopyHash } from "@/components/download/copy-hash";
import {
  RecommendedDownload,
  type RecommendOption,
} from "@/components/download/recommended-download";
import { Footer } from "@/components/footer";
import { CopyCommand } from "@/components/landing/copy-command";
import { INSTALLS } from "@/components/landing/feature-sections";
import { displayFont } from "@/components/landing/fonts";
import { buttonPrimary } from "@/components/landing/styles";
import { cn } from "@/lib/cn";
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
import { gitConfig } from "@/lib/shared";
import "../landing.css";

export const metadata: Metadata = {
  title: "Download Risuko",
  description:
    "Download Risuko for macOS, Windows, Linux, and Android from a fast global mirror.",
  alternates: { canonical: "/download" },
};

const releasesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/releases`;

const ICONS: Record<PlatformId, LucideIcon> = {
  macos: Apple,
  windows: Grid2x2,
  linux: Monitor,
  android: Smartphone,
  cli: SquareTerminal,
};

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

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{children}</div>
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
    <li className="flex items-center gap-3 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{item.label}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {item.kind}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
          <span className="tabular-nums">{formatSize(item.asset.size)}</span>
          {item.asset.sha256 ? <CopyHash hash={item.asset.sha256} /> : null}
        </div>
      </div>
      <a
        href={item.asset.url}
        aria-label={`Download ${platform} ${item.label} ${item.kind}`}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-sm font-semibold transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden sm:inline">Download</span>
      </a>
    </li>
  );
}

function Card({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function PlatformCard({ group }: { group: PlatformGroup }) {
  const hint = HINTS[group.id];
  return (
    <Card
      icon={ICONS[group.id]}
      title={group.name}
      subtitle={group.requirement}
    >
      <ul className="mt-6 divide-y divide-border/70 border-y border-border/70">
        {group.items.map((item) => (
          <DownloadRow
            key={item.asset.name}
            item={item}
            platform={group.name}
          />
        ))}
      </ul>
      {hint ? (
        <p className="mt-4 text-pretty text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </Card>
  );
}

function Unavailable() {
  return (
    <Container>
      <div className="rounded-[1.75rem] border border-border bg-card p-8 sm:p-12">
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
          The release list is unavailable right now
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted-foreground">
          Every build is also published on GitHub.
        </p>
        <a
          href={releasesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonPrimary, "mt-8")}
        >
          Open GitHub Releases
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </Container>
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

  return (
    <div
      className={cn(
        "landing min-h-screen bg-background text-foreground",
        displayFont.variable,
      )}
    >
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="hero-dots pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          {release ? (
            <p className="mb-5 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-primary/12 px-3.5 py-1.5 text-sm font-semibold text-primary">
              v{release.version}
              {title ? (
                <span className="font-medium opacity-80">· {title}</span>
              ) : null}
            </p>
          ) : null}
          <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Download Risuko
          </h1>
          <p className="mt-5 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            Free and open source for macOS, Windows, Linux, and Android.
            {release?.source === "mirror"
              ? " Files are served from Cloudflare's global network and mirrored from GitHub Releases."
              : null}
            {released ? ` Released ${released}.` : null}
          </p>
          {release ? (
            <div className="mt-8">
              <RecommendedDownload options={options} />
            </div>
          ) : null}
        </div>
      </section>

      {release ? (
        <>
          <section id="platforms" className="scroll-mt-20">
            <Container>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {apps.map((group) => (
                  <PlatformCard key={group.id} group={group} />
                ))}
              </div>
            </Container>
          </section>

          <section className="pt-5">
            <Container>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {cli ? <PlatformCard group={cli} /> : null}
                <Card
                  icon={Package}
                  title="Package managers"
                  subtitle="Homebrew and npm"
                >
                  <div className="mt-6 space-y-6">
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
                </Card>
              </div>
            </Container>
          </section>

          <section className="pt-5 pb-20 sm:pb-28">
            <Container>
              <div className="grid grid-cols-1 gap-8 rounded-[1.75rem] border border-primary/25 bg-primary/10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
                <div>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <ShieldCheck className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.02em]">
                    Verify your download
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-pretty text-muted-foreground">
                    Click a checksum above to copy it, then compare it with the
                    SHA-256 of the file you downloaded.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                    <a
                      href={`${releasesUrl}/tag/${release.tag}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Release notes
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={releasesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Older versions on GitHub
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <div className="min-w-0 space-y-4 self-center">
                  <div>
                    <div className="mb-1.5 pl-5 font-mono text-xs text-muted-foreground">
                      macOS and Linux
                    </div>
                    <CopyCommand
                      command={`shasum -a 256 Risuko_${release.version}_darwin_arm64.dmg`}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 pl-5 font-mono text-xs text-muted-foreground">
                      Windows PowerShell
                    </div>
                    <CopyCommand
                      command={`Get-FileHash Risuko_${release.version}_win32_x64.setup.exe`}
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </>
      ) : (
        <section className="pb-20 sm:pb-28">
          <Unavailable />
        </section>
      )}

      <Footer cta={false} />
    </div>
  );
}
