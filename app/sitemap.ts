import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { siteUrl } from "@/lib/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/legal/privacy", "/legal/terms", "/status"];

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route, siteUrl).toString(),
    })),
    ...source.getPages().map((page) => ({
      url: new URL(page.url, siteUrl).toString(),
    })),
  ];
}
