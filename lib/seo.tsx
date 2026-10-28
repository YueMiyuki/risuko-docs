import type { Metadata } from "next";
import type { Release } from "@/lib/release";
import { appName, gitConfig, siteUrl } from "@/lib/shared";

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
const authorUrl = `https://github.com/${gitConfig.user}`;

export const summary =
  "Risuko is a free, open-source (MIT) download manager built in Rust. It downloads HTTP, BitTorrent, Usenet, ED2K, HLS and FTP links from one queue, as a desktop app, a command-line tool or a Node.js library.";

const ids = {
  website: `${siteUrl}/#website`,
  author: `${siteUrl}/#author`,
  software: `${siteUrl}/#software`,
  source: `${siteUrl}/#source`,
};

const absolute = (path: string) => new URL(path, siteUrl).toString();

export function openGraph(
  fields: NonNullable<Metadata["openGraph"]>,
): Metadata["openGraph"] {
  return { siteName: appName, locale: "en_US", type: "website", ...fields };
}

const website = {
  "@type": "WebSite",
  "@id": ids.website,
  url: siteUrl,
  name: appName,
  description: summary,
  inLanguage: "en",
  publisher: { "@id": ids.author },
};

const author = {
  "@type": "Person",
  "@id": ids.author,
  name: gitConfig.user,
  url: authorUrl,
  sameAs: [authorUrl],
};

function software(release: Release | null, downloadUrl: string | string[]) {
  return {
    "@type": "SoftwareApplication",
    "@id": ids.software,
    name: appName,
    url: siteUrl,
    description: summary,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Download manager",
    operatingSystem: "macOS 10.15+, Windows 10+, Linux, Android 7.0+",
    softwareRequirements: "Linux builds need a glibc-based distribution.",
    ...(release
      ? {
          softwareVersion: release.version,
          ...(release.publishedAt
            ? { datePublished: release.publishedAt }
            : {}),
          releaseNotes: `${repoUrl}/releases/tag/${release.tag}`,
        }
      : {}),
    downloadUrl,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    license: "https://opensource.org/licenses/MIT",
    image: absolute("/icon.svg"),
    screenshot: absolute("/showcases/app-tasks.png"),
    featureList: [
      "HTTP/HTTPS, BitTorrent v1 and v2, magnet links, ED2K, Usenet/NZB, M3U8/HLS and FTP/FTPS/SFTP downloads in one queue",
      "aria2-compatible JSON-RPC server",
      "Command-line interface with a headless server mode",
      "Node.js library (@risuko/risuko-js)",
      "Clipboard link detection",
    ],
    author: { "@id": ids.author },
    publisher: { "@id": ids.author },
    sameAs: [repoUrl],
    isBasedOn: {
      "@type": "SoftwareSourceCode",
      name: "Motrix",
      codeRepository: "https://github.com/agalwood/Motrix",
    },
  };
}

const sourceCode = {
  "@type": "SoftwareSourceCode",
  "@id": ids.source,
  name: `${appName} source code`,
  codeRepository: repoUrl,
  programmingLanguage: "Rust",
  license: "https://opensource.org/licenses/MIT",
  author: { "@id": ids.author },
  targetProduct: { "@id": ids.software },
};

type Crumb = { name: string; url: string };

function breadcrumb(id: string, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.url),
    })),
  };
}

const graph = (...nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export function homeJsonLd() {
  return graph(
    website,
    author,
    software(null, absolute("/download")),
    sourceCode,
  );
}

export function downloadJsonLd(release: Release | null, files: string[]) {
  const url = absolute("/download");
  return graph(
    website,
    author,
    software(release, files.length ? files : url),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: `Download ${appName}`,
      inLanguage: "en",
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.software },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    breadcrumb(`${url}#breadcrumb`, [
      { name: appName, url: "/" },
      { name: "Download", url: "/download" },
    ]),
  );
}

export function docsJsonLd(page: {
  url: string;
  title: string;
  description?: string;
  image: string;
  dateModified?: Date;
  crumbs: Crumb[];
}) {
  const url = absolute(page.url);
  return graph(
    website,
    author,
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: page.title,
      ...(page.description ? { description: page.description } : {}),
      url,
      mainEntityOfPage: url,
      image: absolute(page.image),
      ...(page.dateModified
        ? { dateModified: page.dateModified.toISOString() }
        : {}),
      inLanguage: "en",
      isPartOf: { "@id": ids.website },
      about: { "@id": ids.software },
      author: { "@id": ids.author },
      publisher: { "@id": ids.author },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    breadcrumb(`${url}#breadcrumb`, page.crumbs),
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON with < escaped, per the Next.js JSON-LD guide
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
