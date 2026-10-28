import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { appName } from "@/lib/shared";

export const alt = "Download Risuko for macOS, Windows, Linux and Android";
export const size = { width: 1200, height: 630 };
export const contentType = "image/webp";

export default function Image() {
  return new ImageResponse(
    <DefaultImage
      title="Download Risuko"
      description="Free and open source for macOS, Windows, Linux and Android, with SHA-256 checksums for every release."
      site={appName}
    />,
    { ...size, format: "webp" },
  );
}
