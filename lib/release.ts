import { z } from "zod";
import { downloadsUrl, gitConfig } from "./shared";

const REVALIDATE_SECONDS = 300;

export type ReleaseAsset = {
  name: string;
  size: number;
  sha256: string | null;
  url: string;
};

export type Release = {
  version: string;
  tag: string;
  name: string;
  publishedAt: string | null;
  source: "mirror" | "github";
  assets: ReleaseAsset[];
};

export type RecommendKey =
  | "mac-arm64"
  | "mac-x64"
  | "windows"
  | "linux-x64"
  | "linux-arm64"
  | "android";

export type PlatformId = "macos" | "windows" | "linux" | "android" | "cli";

export type DownloadItem = {
  label: string;
  kind: string;
  asset: ReleaseAsset;
  recommend?: RecommendKey;
};

export type PlatformGroup = {
  id: PlatformId;
  name: string;
  requirement: string;
  items: DownloadItem[];
};

type CatalogEntry = {
  label: string;
  kind: string;
  suffix: string;
  recommend?: RecommendKey;
};

const CATALOG: {
  id: PlatformId;
  name: string;
  requirement: string;
  entries: CatalogEntry[];
}[] = [
  {
    id: "macos",
    name: "macOS",
    requirement: "macOS 10.15 or later",
    entries: [
      {
        label: "Apple Silicon",
        kind: "DMG",
        suffix: "_darwin_arm64.dmg",
        recommend: "mac-arm64",
      },
      {
        label: "Intel",
        kind: "DMG",
        suffix: "_darwin_x64.dmg",
        recommend: "mac-x64",
      },
    ],
  },
  {
    id: "windows",
    name: "Windows",
    requirement: "Windows 10 or later",
    entries: [
      {
        label: "x64",
        kind: "Installer",
        suffix: "_win32_x64.setup.exe",
        recommend: "windows",
      },
      { label: "x64", kind: "Portable", suffix: "_win32_x64.portable.exe" },
      { label: "x86", kind: "Installer", suffix: "_win32_ia32.setup.exe" },
      { label: "x86", kind: "Portable", suffix: "_win32_ia32.portable.exe" },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    requirement: "glibc-based distributions",
    entries: [
      {
        label: "x64",
        kind: "AppImage",
        suffix: "_linux_x64.AppImage",
        recommend: "linux-x64",
      },
      { label: "x64", kind: "DEB", suffix: "_linux_x64.deb" },
      { label: "x64", kind: "RPM", suffix: "_linux_x64.rpm" },
      {
        label: "arm64",
        kind: "AppImage",
        suffix: "_linux_arm64.AppImage",
        recommend: "linux-arm64",
      },
      { label: "arm64", kind: "DEB", suffix: "_linux_arm64.deb" },
      { label: "arm64", kind: "RPM", suffix: "_linux_arm64.rpm" },
    ],
  },
  {
    id: "android",
    name: "Android",
    requirement: "Android 7.0 or later",
    entries: [
      {
        label: "arm64-v8a",
        kind: "APK",
        suffix: "_android_arm64.apk",
        recommend: "android",
      },
      { label: "armeabi-v7a", kind: "APK", suffix: "_android_arm.apk" },
      { label: "x86_64", kind: "APK", suffix: "_android_x64.apk" },
      { label: "x86", kind: "APK", suffix: "_android_x86.apk" },
    ],
  },
  {
    id: "cli",
    name: "Command line",
    requirement: "Standalone risuko binary",
    entries: [
      {
        label: "macOS Apple Silicon",
        kind: "tar.gz",
        suffix: "risuko-cli-darwin-arm64.tar.gz",
      },
      {
        label: "macOS Intel",
        kind: "tar.gz",
        suffix: "risuko-cli-darwin-x64.tar.gz",
      },
      {
        label: "Linux x64",
        kind: "tar.gz",
        suffix: "risuko-cli-linux-x64.tar.gz",
      },
      {
        label: "Linux arm64",
        kind: "tar.gz",
        suffix: "risuko-cli-linux-arm64.tar.gz",
      },
      { label: "Windows x64", kind: "zip", suffix: "risuko-cli-win32-x64.zip" },
    ],
  },
];

const mirrorManifest = z.object({
  version: z.string(),
  tag: z.string(),
  name: z.string(),
  pub_date: z.string(),
  assets: z.array(
    z.object({ name: z.string(), size: z.number(), sha256: z.string() }),
  ),
});

const githubRelease = z.object({
  tag_name: z.string(),
  name: z.string().nullable(),
  published_at: z.string().nullable(),
  assets: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      browser_download_url: z.string(),
      digest: z.string().nullish(),
    }),
  ),
});

async function fetchJson(url: string, headers?: HeadersInit) {
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

async function fromMirror(): Promise<Release | null> {
  const parsed = mirrorManifest.safeParse(
    await fetchJson(`${downloadsUrl}/manifest.json`),
  );
  if (!parsed.success) return null;
  const m = parsed.data;
  return {
    version: m.version,
    tag: m.tag,
    name: m.name,
    publishedAt: m.pub_date,
    source: "mirror",
    assets: m.assets.map((a) => ({
      ...a,
      url: `${downloadsUrl}/${m.tag}/${encodeURIComponent(a.name)}`,
    })),
  };
}

async function fromGitHub(): Promise<Release | null> {
  const parsed = githubRelease.safeParse(
    await fetchJson(
      `https://api.github.com/repos/${gitConfig.user}/${gitConfig.repo}/releases/latest`,
      { Accept: "application/vnd.github+json", "User-Agent": "risuko-docs" },
    ),
  );
  if (!parsed.success) return null;
  const r = parsed.data;
  return {
    version: r.tag_name.replace(/^v/i, ""),
    tag: r.tag_name,
    name: r.name || r.tag_name,
    publishedAt: r.published_at,
    source: "github",
    assets: r.assets.map((a) => ({
      name: a.name,
      size: a.size,
      sha256: a.digest?.startsWith("sha256:") ? a.digest.slice(7) : null,
      url: a.browser_download_url,
    })),
  };
}

export async function getLatestRelease(): Promise<Release | null> {
  return (await fromMirror()) ?? (await fromGitHub());
}

export function groupDownloads(release: Release): PlatformGroup[] {
  return CATALOG.map(({ entries, ...group }) => ({
    ...group,
    items: entries.flatMap(({ suffix, ...entry }) => {
      const asset = release.assets.find((a) => a.name.endsWith(suffix));
      return asset ? [{ ...entry, asset }] : [];
    }),
  })).filter((group) => group.items.length > 0);
}

export function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
