"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Moon, Sun, Menu, X, Star } from "lucide-react";
import { RisukoLogo } from "@/components/risuko-logo";

export function Navigation() {
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : ""}`}
    >
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <RisukoLogo className="w-7 h-7" />
            <span className="font-semibold tracking-tight text-lg">Risuko</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 h-8 px-3 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border/50 rounded-md transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="ml-2 text-[10px] bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <a
            href="https://github.com/risuko/risuko"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-sm bg-muted/50 hover:bg-muted border border-border/50 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">2.8k</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-background/95 backdrop-blur-lg border-b border-border/50">
          <div className="flex flex-col gap-2">
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="py-2 text-sm text-muted-foreground"
            >
              Features
            </Link>
            <Link
              href="#docs"
              onClick={() => setIsOpen(false)}
              className="py-2 text-sm text-muted-foreground"
            >
              Docs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
