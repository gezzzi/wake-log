import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  return (
    <nav className="px-6 py-4">
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
