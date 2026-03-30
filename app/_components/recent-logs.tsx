import type { WakeLog } from "@/lib/queries";
import {
  formatShortDateJST,
  formatTimeJST,
  getWakeTimeColor,
  getWakeTimeTextColor,
} from "@/lib/utils";

export function RecentLogs({ logs }: { logs: WakeLog[] }) {
  if (logs.length === 0) {
    return (
      <p className="text-foreground/40 text-center py-8">記録がありません</p>
    );
  }

  return (
    <ul className="divide-y divide-foreground/10">
      {logs.map((log) => (
        <li key={log.id} className="flex items-center justify-between py-3">
          <span className="text-sm text-foreground/60">
            {formatShortDateJST(log.woke_up_at)}
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${getWakeTimeColor(log.woke_up_at)}`}
            />
            <span
              className={`font-mono font-bold text-lg ${getWakeTimeTextColor(log.woke_up_at)}`}
            >
              {formatTimeJST(log.woke_up_at)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
