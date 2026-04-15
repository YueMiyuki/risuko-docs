"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const tabs = ["CLI", "Node.js API"] as const;

const code = {
  CLI: `# Basic download
$ risuko download https://example.com/large-file.zip

# Multi-threaded with 16 connections
$ risuko download -t 16 https://example.com/file.iso

# Resume interrupted download
$ risuko resume ubuntu-24.04.iso.part`,

  "Node.js API": `import {
  startEngine,
  addUri,
  tellStatus,
  onEvent,
  stopEngine,
} from "risuko-js";

await startEngine({ rpcPort: 16800 });

onEvent((event, gid) => {
  console.log(\`[\${event}] \${gid}\`);
});

const gid = await addUri(
  ["https://example.com/file.zip"],
  { split: "16", dir: "/downloads" }
);

const status = await tellStatus(gid);
console.log(\`Progress: \${status.completedLength}/\${status.totalLength}\`);

await stopEngine();`,
};

function highlightCode(text: string, lang: string) {
  return text.split("\n").map((line, i) => {
    if (lang === "CLI") {
      if (line.startsWith("#")) {
        return (
          <span key={i} className="text-muted-foreground/60">
            {line}
          </span>
        );
      }
      if (line.startsWith("$")) {
        // Parse CLI line into parts to avoid regex conflicts
        const parts: React.ReactNode[] = [];
        const tokens = line.split(/(\s+)/);
        tokens.forEach((token, j) => {
          if (token === "$") {
            parts.push(
              <span key={j} className="text-green-400">
                $
              </span>,
            );
          } else if (token === "risuko") {
            parts.push(
              <span key={j} className="text-primary font-medium">
                risuko
              </span>,
            );
          } else if (token.startsWith("-")) {
            parts.push(
              <span key={j} className="text-accent">
                {token}
              </span>,
            );
          } else {
            parts.push(<span key={j}>{token}</span>);
          }
        });
        return <span key={i}>{parts}</span>;
      }
    }

    if (lang === "Node.js API") {
      const parts: React.ReactNode[] = [];
      // Simple tokenization for JS/TS
      const tokens = line.split(
        /(\s+|[(){}:;,.<>?\[\]]|"[^"]*"|'[^']*'|`[^`]*`|\b\d+\b)/,
      );
      const keywords = [
        "import",
        "from",
        "const",
        "let",
        "await",
        "async",
        "function",
      ];
      const types = [
        "startEngine",
        "addUri",
        "tellStatus",
        "onEvent",
        "stopEngine",
        "console",
        "log",
      ];

      tokens.forEach((token, j) => {
        if (!token) return;
        if (
          (token.startsWith('"') && token.endsWith('"')) ||
          (token.startsWith("'") && token.endsWith("'")) ||
          (token.startsWith("`") && token.endsWith("`"))
        ) {
          parts.push(
            <span key={j} className="text-green-400">
              {token}
            </span>,
          );
        } else if (keywords.includes(token)) {
          parts.push(
            <span key={j} className="text-accent">
              {token}
            </span>,
          );
        } else if (types.includes(token)) {
          parts.push(
            <span key={j} className="text-primary">
              {token}
            </span>,
          );
        } else if (/^\d+$/.test(token)) {
          parts.push(
            <span key={j} className="text-orange-400">
              {token}
            </span>,
          );
        } else {
          parts.push(<span key={j}>{token}</span>);
        }
      });
      return <span key={i}>{parts}</span>;
    }

    return <span key={i}>{line}</span>;
  });
}

export function CodeShowcase() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("CLI");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="code-section py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="code-content">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Simple, Powerful API
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Intuitive interfaces whether you prefer the command line or
              programmatic control via Node.js. Start downloading in seconds.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Full CLI with bash completion
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Node.js SDK with async/await
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Event-driven progress tracking
              </li>
            </ul>
          </div>

          {/* Code block */}
          <div className="code-block rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-border/30 bg-muted/50">
              <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                      tab === t
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={copy}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="min-h-[280px] sm:min-h-[320px]">
              <pre className="p-3 sm:p-4 overflow-x-auto font-mono text-[11px] sm:text-[13px] leading-relaxed text-foreground/80">
                <code className="flex flex-col">
                  {highlightCode(code[tab], tab)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
