import { llms } from "fumadocs-core/source";
import { repoUrl, summary } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export const revalidate = false;

const markdownLinks = (index: string) =>
  index.replace(
    /\]\((\/docs[^)]*)\)/g,
    (_, path: string) => `](${new URL(`${path}.md`, siteUrl)})`,
  );

export async function GET() {
  const docs = markdownLinks(await llms(source).index()).replace(
    /^# .*$/m,
    "## Documentation",
  );

  const body = `# Risuko

> ${summary}

- [Homepage](${siteUrl}): what Risuko does, with benchmarks against Motrix
- [Download](${new URL("/download", siteUrl)}): installers for macOS, Windows, Linux and Android, the standalone CLI, and SHA-256 checksums
- [Source code](${repoUrl}): MIT-licensed repository
- [Releases](${repoUrl}/releases): changelogs and every past version

${docs}

## Optional

- [Full documentation](${new URL("/llms-full.txt", siteUrl)}): every docs page in one file
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
