"use client";

import { Download, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const plugins = [
  {
    name: "pikari-youtube",
    desc: "YouTube video and playlist downloader",
    downloads: "124.5k",
    stars: 892,
    tag: "extractor",
  },
  {
    name: "pikari-ffmpeg",
    desc: "Post-processing with FFmpeg conversion",
    downloads: "98.2k",
    stars: 654,
    tag: "processor",
  },
  {
    name: "pikari-aria2",
    desc: "BitTorrent and Metalink support",
    downloads: "67.8k",
    stars: 423,
    tag: "integration",
  },
  {
    name: "pikari-notify",
    desc: "Desktop notifications and webhooks",
    downloads: "45.3k",
    stars: 312,
    tag: "utility",
  },
  {
    name: "pikari-scheduler",
    desc: "Schedule downloads for off-peak hours",
    downloads: "38.1k",
    stars: 278,
    tag: "utility",
  },
  {
    name: "pikari-s3",
    desc: "Direct upload to S3, R2 and MinIO",
    downloads: "32.6k",
    stars: 245,
    tag: "integration",
  },
];

const tagColors: Record<string, string> = {
  extractor: "text-blue-400 bg-blue-500/10",
  processor: "text-green-400 bg-green-500/10",
  integration: "text-purple-400 bg-purple-500/10",
  utility: "text-yellow-400 bg-yellow-500/10",
};

export function PluginEcosystem() {
  return (
    <section id="plugins" className="py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Plugin Ecosystem
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Extend Pikari with community plugins or build your own.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {plugins.map((p, i) => (
            <div
              key={i}
              className="group p-4 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                  {p.name}
                </span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded ${tagColors[p.tag]}`}
                >
                  {p.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {p.desc}
              </p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {p.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {p.stars}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/plugins"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse All Plugins <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
