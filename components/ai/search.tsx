"use client";
import type { Tool, UIMessage } from "ai";
import dynamic from "next/dynamic";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { cn } from "../../lib/cn";

export type ChatUIMessage = UIMessage<
  never,
  {
    client: {
      location: string;
    };
  }
>;

export type SearchTool = Tool<{ query: string; limit: number }>;

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const loadPanel = () => import("./panel");
const Panel = dynamic(() => loadPanel().then((m) => m.AISearchPanel), {
  ssr: false,
});

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Context value={useMemo(() => ({ open, setOpen }), [open])}>
      {children}
    </Context>
  );
}

export function AISearchTrigger({
  position = "default",
  className,
  ...props
}: ComponentProps<"button"> & { position?: "default" | "float" }) {
  const { open, setOpen } = useAISearchContext();

  return (
    <button
      data-state={open ? "open" : "closed"}
      className={cn(
        position === "float" && [
          "fixed bottom-4 gap-3 w-24 inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))] shadow-lg z-20 transition-[translate,opacity]",
          open && "translate-y-10 opacity-0",
        ],
        className,
      )}
      onPointerEnter={loadPanel}
      onFocus={loadPanel}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function AISearchPanel() {
  const { open } = useAISearchContext();
  const [opened, setOpened] = useState(false);
  useHotKey();

  useEffect(() => {
    if (open) setOpened(true);
  }, [open]);

  return opened ? <Panel /> : null;
}

function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, []);
}

export function useAISearchContext() {
  return use(Context)!;
}
