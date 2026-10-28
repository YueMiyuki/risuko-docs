const CALLOUT_LABELS: Record<string, string> = {
  info: "Note",
  warn: "Warning",
  warning: "Warning",
  error: "Important",
  success: "Tip",
  tip: "Tip",
};

const attr = (tag: string, name: string) =>
  new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];

export function cleanMarkdown(markdown: string): string {
  const out: string[] = [];
  let inFence = false;
  let dedent = 0;
  let inTabList = false;
  let inCallout = false;
  let htmlDepth = 0;

  for (const raw of markdown.split("\n")) {
    const line =
      dedent > 0 && raw.startsWith(" ".repeat(dedent))
        ? raw.slice(dedent)
        : raw.trimStart() === ""
          ? ""
          : dedent > 0
            ? raw.trimStart()
            : raw;
    const trimmed = line.trim();

    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inFence = !inFence;
      out.push(inCallout ? `> ${line}` : line);
      continue;
    }
    if (inFence) {
      out.push(inCallout ? `> ${line}` : line);
      continue;
    }

    if (/^<CodeBlockTabs\b/.test(trimmed)) {
      dedent = 4;
      continue;
    }
    if (trimmed === "</CodeBlockTabs>") {
      dedent = 0;
      continue;
    }
    if (trimmed === "<CodeBlockTabsList>") {
      inTabList = true;
      continue;
    }
    if (trimmed === "</CodeBlockTabsList>") {
      inTabList = false;
      continue;
    }
    if (inTabList) continue;
    if (/^<CodeBlockTab\b/.test(trimmed)) {
      out.push(`**${attr(trimmed, "value") ?? "Example"}**`, "");
      continue;
    }
    if (trimmed === "</CodeBlockTab>") continue;

    if (/^<Callout\b/.test(trimmed)) {
      const type = attr(trimmed, "type") ?? "info";
      const title = attr(trimmed, "title");
      out.push(`> **${title ?? CALLOUT_LABELS[type] ?? "Note"}:**`, ">");
      inCallout = true;
      dedent = 2;
      continue;
    }
    if (trimmed === "</Callout>") {
      inCallout = false;
      dedent = 0;
      continue;
    }

    if (trimmed === "<Cards>" || trimmed === "</Cards>") continue;
    if (/^<Card\b/.test(trimmed)) {
      const title = attr(trimmed, "title");
      const href = attr(trimmed, "href");
      if (title && href) out.push(`- [${title}](${href})`);
      continue;
    }

    if (/^<\/?(div|p|span)\b[^>]*>/.test(trimmed) || trimmed === "<br />") {
      htmlDepth +=
        (trimmed.match(/<div\b/g)?.length ?? 0) -
        (trimmed.match(/<\/div>/g)?.length ?? 0);
      const text = trimmed
        .replace(/<br\s*\/>/g, " ")
        .replace(/<\/?(div|p|span)\b[^>]*>/g, "")
        .trim();
      if (text) out.push(text);
      continue;
    }

    const content = (htmlDepth > 0 ? trimmed : line).replace(
      /^(#{1,6} .*?) \[#[^\]]+\]$/,
      "$1",
    );
    out.push(inCallout ? (content ? `> ${content}` : ">") : content);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
