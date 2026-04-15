"use client";

import Link from "fumadocs-core/link";
import type { ComponentProps } from "react";
import { RisukoLogo } from "@/components/risuko-logo";
import { appName } from "@/lib/shared";

export function NavTitle(props: ComponentProps<"a">) {
  return (
    <Link href="/" {...props}>
      <RisukoLogo className="size-5" />
      {appName}
    </Link>
  );
}
