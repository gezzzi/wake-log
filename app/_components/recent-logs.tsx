import type { WakeLog } from "@/lib/queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";

export function RecentLogs({ logs }: { logs: WakeLog[] }) {
  if (logs.length === 0) {
    return (
      <p className="text-muted text-center py-8">記録がありません</p>
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors divide-y divide-gray-100 dark:divide-gray-800">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between px-6 py-4"
        >
          <span className="text-sm text-muted">
            {formatShortDateJST(log.woke_up_at)}
          </span>
          <span className="text-2xl font-light tracking-tighter">
            {formatTimeJST(log.woke_up_at)}
          </span>
        </div>
      ))}
    </div>
  );
}
