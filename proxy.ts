import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";
import { docsContentRoute, docsRoute } from "@/lib/shared";

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    /^\/docs(\/|\.md$|$)/i.test(pathname) &&
    pathname !== pathname.toLowerCase()
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  const result = rewriteSuffix(pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  const negotiated = rewriteDocs(pathname);
  const response =
    negotiated && isMarkdownPreferred(request)
      ? NextResponse.rewrite(new URL(negotiated, request.nextUrl))
      : NextResponse.next();
  if (negotiated) response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/|og/|showcases/|icon\\.svg|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
