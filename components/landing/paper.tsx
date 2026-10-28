import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const GeistMono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const GeistPixelLine = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Line.woff2",
  variable: "--font-geist-pixel-line",
  weight: "500",
  fallback: ["Geist Mono", "ui-monospace", "Menlo", "monospace"],
});

export function Paper({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "paper",
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelLine.variable,
      )}
    >
      <style>{`html:has(.paper){--font-inter:${GeistSans.style.fontFamily};--font-jetbrains:${GeistMono.style.fontFamily}}html:has(.paper) body{font-family:${GeistSans.style.fontFamily}}`}</style>
      {children}
    </div>
  );
}
