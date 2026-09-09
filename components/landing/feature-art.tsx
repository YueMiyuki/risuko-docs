import { Cloud, FileDown, Rss } from "lucide-react";
import { cn } from "@/lib/cn";

function ArtFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "feature-art relative mb-5 block h-28 overflow-hidden rounded-md bg-background/40",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* RSS: new feed items keep sliding in from the top ------------------ */
export function RssArt() {
  return (
    <ArtFrame>
      <span className="art-rss-badge absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
        <Rss className="h-3.5 w-3.5" />
        <span className="art-rss-ring absolute inset-0 rounded-md border border-primary/60" />
      </span>
      <span className="art-rss-feed absolute top-3 right-3 left-13 flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "flex h-5 items-center gap-2 rounded-sm border border-border/60 bg-card px-2",
              i === 0 && "art-rss-new border-primary/50",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                i === 0 ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
            <span
              className="h-1.5 rounded-full bg-muted-foreground/30"
              style={{ width: `${[64, 48, 72, 40, 56][i]}%` }}
            />
          </span>
        ))}
      </span>
    </ArtFrame>
  );
}

/* BitTorrent: pieces light up out of order until the bar completes ---- */
const PIECE_ORDER = [
  5, 17, 2, 21, 9, 14, 0, 19, 7, 11, 23, 3, 16, 8, 20, 1, 12, 22, 6, 15, 4, 18,
  10, 13,
];

export function TorrentArt() {
  return (
    <ArtFrame>
      <span className="absolute inset-x-4 top-4 grid grid-cols-12 gap-1">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="art-piece h-3 rounded-[2px] bg-muted-foreground/20"
            style={{ "--i": PIECE_ORDER.indexOf(i) } as React.CSSProperties}
          />
        ))}
      </span>
      <span className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5">
        <span className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span className="art-bt-label">16 peers · downloading</span>
          <span className="art-bt-pct" />
        </span>
        <span className="h-1.5 overflow-hidden rounded-full bg-muted-foreground/20">
          <span className="art-bt-bar block h-full w-0 rounded-full bg-primary" />
        </span>
      </span>
    </ArtFrame>
  );
}
export function CloudArt() {
  return (
    <ArtFrame>
      <span className="absolute top-3 left-1/2 -translate-x-1/2 text-primary">
        <span className="art-cloud block">
          <Cloud className="h-8 w-8" strokeWidth={1.5} />
        </span>
      </span>
      <span className="art-file-lane absolute inset-x-0 top-8 bottom-0">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="art-file absolute bottom-3 flex h-7 w-6 items-center justify-center rounded-sm border border-border/70 bg-card text-muted-foreground"
            style={
              {
                left: `${[28, 46, 64][i]}%`,
                "--d": `${i * 0.5}s`,
              } as React.CSSProperties
            }
          >
            <FileDown className="h-3 w-3" />
          </span>
        ))}
      </span>
      <span className="absolute inset-x-6 bottom-2 h-px bg-border" />
    </ArtFrame>
  );
}

const ROUTES = [
  {
    id: "video",
    label: "Videos",
    row: "row-start-1",
    d: "M0 50 C42 50 58 16.67 100 16.67",
  },
  {
    id: "music",
    label: "Music",
    row: "row-start-2",
    d: "M0 50 C42 50 58 50 100 50",
  },
  {
    id: "zip",
    label: "Archives",
    row: "row-start-3",
    d: "M0 50 C42 50 58 83.33 100 83.33",
  },
] as const;

export function RoutingArt() {
  return (
    <ArtFrame>
      <span className="absolute inset-2 grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-3">
        <span className="relative z-10 isolate col-start-1 row-span-3 flex items-center">
          <span className="art-task inline-flex h-6.5 shrink-0 items-center gap-1.5 rounded-sm border border-primary/60 px-2 font-mono text-[10px] text-primary">
            <span className="art-task-dot h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="art-task-file inline-block w-[8ch] whitespace-nowrap" />
          </span>
        </span>
        <svg
          className="art-routes relative z-0 col-start-2 row-span-3 -ml-2.5 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {ROUTES.map((route) => (
            <path
              key={`ghost-${route.id}`}
              className="art-route-ghost"
              d={route.d}
              vectorEffect="nonScalingStroke"
            />
          ))}
          {ROUTES.map((route) => (
            <path
              key={`wire-${route.id}`}
              className={`art-route-live art-route-${route.id}`}
              d={route.d}
              pathLength={100}
              vectorEffect="nonScalingStroke"
            />
          ))}
          {ROUTES.map((route) => (
            <path
              key={`pkt-${route.id}`}
              className={`art-head art-head-${route.id}`}
              d={route.d}
              pathLength={100}
              vectorEffect="nonScalingStroke"
            />
          ))}
        </svg>
        {ROUTES.map((route) => (
          <span
            key={route.id}
            className={`art-lane art-lane-${route.id} relative z-10 col-start-3 ${route.row} ml-1 inline-flex h-6.5 items-center self-center rounded-sm border border-border/60 px-2 font-mono text-[10px] text-muted-foreground`}
          >
            {route.label}
          </span>
        ))}
      </span>
    </ArtFrame>
  );
}
