import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "@/components/landing/copy-command";
import { RisukoLogo } from "@/components/risuko-logo";

const links: Record<
  string,
  { label: string; href: string; external?: boolean }[]
> = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "CLI", href: "/docs/cli" },
    { label: "Node.js API", href: "/docs/node-api" },
    { label: "API status", href: "/status" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Getting Started", href: "/docs/getting-started/installation" },
    { label: "Configuration", href: "/docs/configuration" },
  ],
  Community: [
    {
      label: "GitHub",
      href: "https://github.com/YueMiyuki/Risuko",
      external: true,
    },
    {
      label: "Releases",
      href: "https://github.com/YueMiyuki/Risuko/releases",
      external: true,
    },
    {
      label: "Original (Motrix)",
      href: "https://github.com/agalwood/Motrix",
      external: true,
    },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      {/* CTA */}
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to download faster?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Free and open source. Available for Windows, macOS, Linux, and
          Android.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <CopyCommand command="pnpm install -g @risuko/app" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          or{" "}
          <a
            href="https://github.com/YueMiyuki/Risuko/releases"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
          >
            download from GitHub
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>

      {/* Links */}
      <div className="border-t border-border/30">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="mb-3 flex items-center gap-2">
                <RisukoLogo className="h-5 w-5" />
                <span className="font-semibold">Risuko</span>
              </Link>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                A high-performance download manager built in Rust.
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/30 px-2.5 py-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Built with Rust
              </span>
            </div>

            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h3 className="mb-3 text-xs font-medium">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        {...(item.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Risuko. MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
