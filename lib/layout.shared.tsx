import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Download } from "lucide-react";
import { NavTitle } from "@/components/nav-title";
import { gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: NavTitle,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        icon: <BookOpen />,
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        icon: <Download />,
        text: "Download",
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}/releases`,
        external: true,
      },
    ],
  };
}
