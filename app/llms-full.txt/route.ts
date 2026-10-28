import { getLLMText, source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const ordered = [
    ...pages.filter((page) => page.slugs.length === 0),
    ...pages.filter((page) => page.slugs.length > 0),
  ];
  const scan = ordered.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
