"use client";

import { Layers, Globe, Terminal, Puzzle, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Multi-threaded Downloads",
    description:
      "Split files into segments and download simultaneously with intelligent chunk management.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Browser Integration",
    description:
      "Capture downloads from Chrome, Firefox, and Edge with one-click interception.",
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: "CLI + GUI",
    description:
      "Powerful command-line interface for automation or native GUI for visual management.",
  },
  {
    icon: <Puzzle className="w-5 h-5" />,
    title: "Node.JS API",
    description:
      "Programmatic control with a full-featured Node.js SDK for automation and scripting.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Resume Support",
    description:
      "Never lose progress. Resume interrupted downloads exactly where they left off.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Multi-protocol Support",
    description:
      "Download via HTTP, HTTPS, FTP, SFTP, BitTorrent, and magnet links.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="features-section py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="section-header text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Built for Performance
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Every feature designed with speed and reliability in mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group p-5 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                {feature.icon}
              </div>
              <h3 className="font-medium mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
