"use client";

import { useState, useEffect } from "react";
import { Play, Pause, MoreHorizontal } from "lucide-react";

interface Download {
  id: number;
  name: string;
  size: string;
  speed: string;
  status: "downloading" | "paused" | "complete";
  segments: number[];
}

function SpeedGraph() {
  const [points, setPoints] = useState<number[]>(Array(20).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((p) => [
        ...p.slice(1),
        Math.max(
          30,
          Math.min(85, p[p.length - 1] + (Math.random() - 0.45) * 10),
        ),
      ]);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 19) * 100} ${100 - p}`)
    .join(" ");

  return (
    <div className="h-16 bg-muted/20 rounded-md border border-border/30 relative overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#fill)" />
        <path
          d={path}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="absolute bottom-1.5 right-2 text-[10px] font-mono text-primary">
        {points[points.length - 1].toFixed(0)} MB/s
      </div>
    </div>
  );
}

function DownloadRow({
  item,
  onToggle,
}: {
  item: Download;
  onToggle: () => void;
}) {
  const [segs, setSegs] = useState(item.segments);

  useEffect(() => {
    if (item.status !== "downloading") return;
    const interval = setInterval(() => {
      setSegs((s) => s.map((v) => Math.min(v + Math.random() * 3, 100)));
    }, 150);
    return () => clearInterval(interval);
  }, [item.status]);

  const progress = segs.reduce((a, b) => a + b, 0) / segs.length;

  return (
    <div className="p-3 rounded-md bg-muted/10 border border-border/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggle}
            className="w-6 h-6 rounded bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors"
          >
            {item.status === "downloading" ? (
              <Pause className="w-3 h-3" />
            ) : item.status === "complete" ? (
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
          <div>
            <div className="text-sm truncate max-w-[200px]">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.size}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono text-primary">{item.speed}</div>
            <div className="text-xs text-muted-foreground">
              {progress.toFixed(0)}%
            </div>
          </div>
          <button className="p-1 hover:bg-muted/30 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex gap-0.5 h-1 rounded overflow-hidden bg-muted/30">
        {segs.map((s, i) => (
          <div key={i} className="flex-1 overflow-hidden">
            <div
              className={`h-full transition-all ${
                item.status === "complete"
                  ? "bg-green-500"
                  : item.status === "downloading"
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
              }`}
              style={{ width: `${s}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  const [downloads, setDownloads] = useState<Download[]>([
    {
      id: 1,
      name: "ubuntu-24.04-desktop.iso",
      size: "5.8 GB",
      speed: "142.8 MB/s",
      status: "downloading",
      segments: [85, 72, 65, 58, 70, 62, 78, 55],
    },
    {
      id: 2,
      name: "node-v22.0.0-linux.tar.gz",
      size: "42.3 MB",
      speed: "0 MB/s",
      status: "complete",
      segments: [100, 100, 100, 100],
    },
    {
      id: 3,
      name: "rust-1.80.0-x86_64.tar.gz",
      size: "285 MB",
      speed: "0 MB/s",
      status: "paused",
      segments: [45, 32, 18, 12, 28, 15],
    },
  ]);

  const toggle = (id: number) => {
    setDownloads((d) =>
      d.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "downloading"
                  ? "paused"
                  : item.status === "paused"
                    ? "downloading"
                    : item.status,
              speed: item.status === "downloading" ? "0 MB/s" : "98.2 MB/s",
            }
          : item,
      ),
    );
  };

  return (
    <section className="demo-section py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="section-header text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            See it in Action
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Segmented downloads with real-time progress and speed analytics.
          </p>
        </div>

        <div className="demo-window max-w-2xl mx-auto">
          <div className="rounded-xl border border-border/50 bg-[#0a0a0f] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-muted-foreground/60 font-mono">
                risuko
              </span>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                + Add
              </button>
            </div>

            <div className="p-4 space-y-3">
              <SpeedGraph />
              {downloads.map((d) => (
                <DownloadRow
                  key={d.id}
                  item={d}
                  onToggle={() => toggle(d.id)}
                />
              ))}
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>
                  Active: <span className="text-primary">1</span> | Complete:{" "}
                  <span className="text-green-400">1</span>
                </span>
                <span>6.1 GB total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
