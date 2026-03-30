import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-foreground/10 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg tracking-tight">
        WakeLog
      </Link>
      <div className="flex gap-6 text-sm">
        <Link href="/" className="hover:text-foreground/70 transition-colors">
          ダッシュボード
        </Link>
        <Link
          href="/calendar"
          className="hover:text-foreground/70 transition-colors"
        >
          カレンダー
        </Link>
        <Link
          href="/chart"
          className="hover:text-foreground/70 transition-colors"
        >
          グラフ
        </Link>
      </div>
    </nav>
  );
}
