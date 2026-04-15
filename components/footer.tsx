"use client";

import Link from "next/link";
import { RisukoLogo } from "@/components/risuko-logo";

const links: Record<
  string,
  { label: string; href: string; external?: boolean }[]
> = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "CLI", href: "/docs/cli" },
    { label: "Node.js API", href: "/docs/node-api" },
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
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      {/* CTA */}
      <div className="footer-cta max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Ready to download faster?
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Available for Windows, macOS, and Linux. Free and open source.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <a className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border/50 text-foreground font-medium text-sm hover:bg-muted/30 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 5.548l7.194-1.001v6.948H3V5.548zm0 12.904l7.194 1.001v-6.948H3v5.947zm7.984 1.11l9.016 1.252v-8.321h-9.016v7.069zm0-14.124v7.069h9.016V4.195l-9.016 1.243z" />
            </svg>
            Windows
          </a>
          <a className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border/50 text-foreground font-medium text-sm hover:bg-muted/30 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            macOS
          </a>
          <a className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border/50 text-foreground font-medium text-sm hover:bg-muted/30 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47a2.5 2.5 0 001.208-.946c.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z" />
            </svg>
            Linux
          </a>
        </div>

        <code className="inline-block px-3 py-1.5 text-xs font-mono text-muted-foreground bg-muted/30 border border-border/30 rounded-md">
          pnpm install -g @risuko/risuko-app
        </code>
      </div>

      {/* Links */}
      <div className="border-t border-border/30">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <RisukoLogo className="w-5 h-5" />
                <span className="font-semibold">Risuko</span>
              </Link>
              <p className="text-xs text-muted-foreground mb-3">
                High-performance download manager built in Rust.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-muted-foreground bg-muted/20 border border-border/30">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-orange-500"
                  fill="currentColor"
                >
                  <path d="M23.835 11.703l-1.707-1.12c-.027-.24-.063-.479-.11-.715l1.478-1.416a.496.496 0 00.047-.582l-1.003-1.733a.496.496 0 00-.523-.25l-1.987.372c-.148-.185-.306-.362-.475-.528l.372-1.987a.496.496 0 00-.25-.523l-1.733-1.003a.496.496 0 00-.582.047l-1.416 1.478c-.236-.047-.475-.083-.715-.11l-1.12-1.707a.496.496 0 00-.583-.196l-1.99.662a.496.496 0 00-.345.471l-.002 2.034c-.216.097-.427.205-.631.322l-1.664-1.175a.496.496 0 00-.586.022l-1.51 1.293a.496.496 0 00-.13.571l.848 1.847c-.129.196-.249.399-.359.607l-2.013.26a.496.496 0 00-.422.407l-.388 1.964a.496.496 0 00.257.534l1.786.926c-.007.246-.002.492.016.737l-1.652 1.232a.496.496 0 00-.139.573l.787 1.832a.496.496 0 00.514.288l2.009-.317c.12.197.252.387.393.57l-.606 1.92a.496.496 0 00.164.546l1.612 1.206a.496.496 0 00.585.002l1.558-1.224c.21.096.428.18.65.253l.265 2.012a.496.496 0 00.414.417l1.983.35a.496.496 0 00.545-.254l.903-1.8c.242.007.484.002.724-.016l1.115 1.717a.496.496 0 00.548.19l1.903-.636a.496.496 0 00.335-.477l-.05-2.032c.201-.119.394-.249.58-.389l1.824.853a.496.496 0 00.57-.14l1.206-1.612a.496.496 0 00.002-.585l-1.224-1.558c.096-.21.18-.428.253-.65l2.012-.265a.496.496 0 00.417-.414l.35-1.983a.496.496 0 00-.199-.478zM12 15.67a3.667 3.667 0 110-7.334 3.667 3.667 0 010 7.334z" />
                </svg>
                Built with Rust
              </div>
            </div>

            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h3 className="font-medium text-xs mb-3">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Risuko. MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
