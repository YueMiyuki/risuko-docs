import { NextResponse } from "next/server";

// Tauri desktop updater endpoint

const MANIFEST_URL =
  "https://github.com/YueMiyuki/Risuko/releases/latest/download/latest.json";

const MANIFEST_TTL_SECONDS = 300;

type Platform = { signature: string; url: string };
type Manifest = {
  version: string;
  notes?: string;
  pub_date?: string;
  platforms?: Record<string, Platform>;
};

/** True when `latest` is a strictly higher x.y.z than `current`. */
function isNewer(latest: string, current: string): boolean {
  const parse = (v: string) =>
    v
      .replace(/^v/i, "")
      .split(/[-+]/)[0]
      .split(".")
      .map((n) => Number.parseInt(n, 10) || 0);
  const a = parse(latest);
  const b = parse(current);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return false;
}

// 204 = "you're up to date" in the Tauri updater protocol.
const upToDate = () => new NextResponse(null, { status: 204 });

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ target: string; arch: string; current_version: string }>;
  },
) {
  const { target, arch, current_version } = await params;

  let manifest: Manifest;
  try {
    const res = await fetch(MANIFEST_URL, {
      headers: { "User-Agent": "risuko-updater" },
      next: { revalidate: MANIFEST_TTL_SECONDS },
    });
    // 404 = no published release yet → nothing to update to.
    if (!res.ok) return upToDate();
    manifest = (await res.json()) as Manifest;
  } catch {
    return upToDate();
  }

  if (!manifest?.version || !isNewer(manifest.version, current_version)) {
    return upToDate();
  }

  const platform = manifest.platforms?.[`${target}-${arch}`];
  if (!platform?.url || !platform?.signature) {
    // Newer version exists, but not for this platform/arch.
    return upToDate();
  }

  // Flat per-platform response shape the Tauri v2 dynamic updater expects.
  return NextResponse.json(
    {
      version: manifest.version,
      notes: manifest.notes ?? "",
      pub_date: manifest.pub_date,
      url: platform.url,
      signature: platform.signature,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
