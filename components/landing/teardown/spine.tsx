"use client";

import { type ReactNode, useEffect, useRef } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export function Spine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const figure = root?.querySelector<HTMLElement>("[data-teardown]");
    const chapter = root?.querySelector<HTMLElement>("[data-spine-figure]");
    if (!root || !figure || !chapter) return;

    const sections = [
      ...root.querySelectorAll<HTMLElement>("[data-spine-section]"),
    ];
    const finish = root.querySelector<HTMLElement>("[data-reassemble]");
    const parts = [...figure.querySelectorAll<SVGElement>("[data-part]")];
    const labels = [...figure.querySelectorAll<HTMLElement>("[data-parts]")];
    const status = figure.querySelector<HTMLElement>("[data-status]");
    const wide = matchMedia("(min-width: 64rem)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");

    let hover: string | null = null;
    let marked: string | null = null;
    let raf = 0;

    const mark = (ids: string) => {
      if (ids === marked) return;
      marked = ids;
      const on = new Set(ids.split(" ").filter(Boolean));
      figure.toggleAttribute("data-marking", on.size > 0);
      for (const part of parts) {
        part.toggleAttribute("data-on", on.has(part.dataset.part ?? ""));
      }
      for (const label of labels) {
        const ids = label.dataset.parts?.split(" ") ?? [];
        label.toggleAttribute(
          "data-on",
          ids.some((id) => on.has(id)),
        );
      }
      if (status) {
        status.textContent = parts
          .filter((part) => on.has(part.dataset.part ?? ""))
          .map((part) => part.dataset.name)
          .reverse()
          .join(" · ");
      }
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let t = 1;
      let ids = "";

      if (wide.matches) {
        const line = vh * 0.45;
        const current = sections.find((section) => {
          const r = section.getBoundingClientRect();
          return r.top <= line && r.bottom > line;
        });
        ids = hover ?? current?.dataset.parts ?? "";

        if (!still.matches) {
          const hero = sections[0].getBoundingClientRect();
          const open = clamp(-hero.top / (hero.height * 0.6));
          const end = finish?.getBoundingClientRect();
          const close = end ? clamp((vh * 0.85 - end.top) / (vh * 0.55)) : 0;
          t = ease(open) * (1 - ease(close));
        }
      } else if (!still.matches) {
        const r = chapter.getBoundingClientRect();
        t = ease(clamp(-r.top / ((r.height - vh) * 0.8)));
      }

      figure.style.setProperty("--t", t.toFixed(4));
      mark(ids);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const hoverFrom = (target: EventTarget | null) => {
      const item =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-hover-parts]")
          : null;
      const next = item?.dataset.hoverParts ?? null;
      if (next === hover) return;
      hover = next;
      schedule();
    };
    const onOver = (e: Event) => hoverFrom(e.target);
    const onLeave = () => hoverFrom(null);
    const onFocusOut = (e: FocusEvent) => hoverFrom(e.relatedTarget);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    still.addEventListener("change", schedule);
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onOver);
    root.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
      still.removeEventListener("change", schedule);
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onOver);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
