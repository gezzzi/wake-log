"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";

export function Nav() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      if (currentY < lastScrollY || currentY < 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(currentY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          <span>ホーム</span>
        </Link>
        <span className="text-lg font-medium tracking-tight">WakeLog</span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
