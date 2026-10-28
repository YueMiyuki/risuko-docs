import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { docsJsonLd, JsonLd, openGraph } from "@/lib/seo";
import { appName, docsRoute, docsSourceConfig } from "@/lib/shared";
import { getPageImage, getPageMarkdownUrl, source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd
        data={docsJsonLd({
          url: page.url,
          title: page.data.title,
          description: page.data.description,
          image: getPageImage(page).url,
          dateModified: page.data.lastModified,
          crumbs: crumbsFor(page.slugs),
        })}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${docsSourceConfig.user}/${docsSourceConfig.repo}/blob/${docsSourceConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": getPageMarkdownUrl(page).url },
    },
    openGraph: openGraph({
      type: "article",
      url: page.url,
      images: getPageImage(page).url,
      ...(page.data.lastModified
        ? { modifiedTime: page.data.lastModified.toISOString() }
        : {}),
    }),
  };
}

function crumbsFor(slugs: string[]) {
  const trail = slugs.flatMap((_, i) => {
    const page = source.getPage(slugs.slice(0, i + 1));
    return page ? [{ name: page.data.title, url: page.url }] : [];
  });
  return [
    { name: appName, url: "/" },
    { name: "Docs", url: docsRoute },
    ...trail,
  ];
}
