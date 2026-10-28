import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/lib/layout.shared";

export const metadata: Metadata = {
  title: "Page not found",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/download", label: "Download" },
];

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-24">
        <p className="font-mono text-sm text-fd-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          This page doesn't exist
        </h1>
        <p className="mt-3 text-fd-muted-foreground">
          The link may be old, or the page may have moved. These are good places
          to start:
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-fd-primary hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </HomeLayout>
  );
}
