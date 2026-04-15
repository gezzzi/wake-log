export const dynamic = "force-dynamic";

import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { getRecentLogs, getLogsByRange, getLogsForDays } from "@/lib/queries";
import {
  calculateAverageWakeTime,
  calculateWakeTimeRange,
  getWeekBoundsJST,
} from "@/lib/utils";
import { StatsCards } from "../_components/stats-cards";
import { RecentLogs } from "../_components/recent-logs";
import { WakeChart } from "../_components/wake-chart";

export default async function WakePage() {
  const thisWeek = getWeekBoundsJST(0);
  const lastWeek = getWeekBoundsJST(-1);

  const [recentLogs, thisWeekLogs, lastWeekLogs, chartLogs] = await Promise.all([
    getRecentLogs(10),
    getLogsByRange(thisWeek.start, thisWeek.end),
    getLogsByRange(lastWeek.start, lastWeek.end),
    getLogsForDays(30),
  ]);

  const avgThisWeek = calculateAverageWakeTime(thisWeekLogs);
  const avgLastWeek = calculateAverageWakeTime(lastWeekLogs);
  const rangeThisWeek = calculateWakeTimeRange(thisWeekLogs);
  const rangeLastWeek = calculateWakeTimeRange(lastWeekLogs);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Clock size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">起床時間</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <StatsCards
        avgThisWeek={avgThisWeek}
        avgLastWeek={avgLastWeek}
        thisWeekLabel={thisWeek.label}
        lastWeekLabel={lastWeek.label}
        rangeThisWeek={rangeThisWeek}
        rangeLastWeek={rangeLastWeek}
      />

      <Link
        href="/calendar"
        className="flex items-center justify-center gap-2 py-3 bg-card rounded-2xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 text-sm text-muted hover:text-foreground hover:shadow-md transition-all"
      >
        <Calendar size={16} />
        カレンダー
      </Link>

      <WakeChart logs={chartLogs} />

      <div>
        <div className="flex items-center space-x-2 text-muted mb-3 px-1">
          <span className="text-sm font-medium uppercase tracking-wider">最近の記録</span>
        </div>
        <RecentLogs logs={recentLogs} />
      </div>
    </div>
  );
}
