import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

const LEGAL_UPDATED = new Date("2026-07-04");

const pages: { path: string; lastModified?: Date }[] = [
  { path: "/" },
  { path: "/download" },
  { path: "/legal/privacy", lastModified: LEGAL_UPDATED },
  { path: "/legal/terms", lastModified: LEGAL_UPDATED },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(({ path, lastModified }) => ({
      url: path === "/" ? siteUrl : new URL(path, siteUrl).toString(),
      ...(lastModified ? { lastModified } : {}),
    })),
    ...source.getPages().map((page) => ({
      url: new URL(page.url, siteUrl).toString(),
      ...(page.data.lastModified
        ? { lastModified: page.data.lastModified }
        : {}),
    })),
  ];
}
