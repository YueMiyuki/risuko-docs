import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { appName } from "@/lib/shared";

export const alt = "Risuko, an open-source download manager built in Rust";
export const size = { width: 1200, height: 630 };
export const contentType = "image/webp";

export default function Image() {
  return new ImageResponse(
    <DefaultImage
      title="Open-source download manager built in Rust"
      description="HTTP, BitTorrent, Usenet, ED2K, HLS and FTP in one queue: desktop app, CLI and Node.js API."
      site={appName}
    />,
    { ...size, format: "webp" },
  );
}
