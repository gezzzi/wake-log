export const dynamic = "force-dynamic";

import { getRecentLogs, getLogsByRange } from "@/lib/queries";
import { calculateAverageWakeTime, getWeekBoundsJST } from "@/lib/utils";
import { StatsCards } from "./_components/stats-cards";
import { RecentLogs } from "./_components/recent-logs";

export default async function Home() {
  const thisWeek = getWeekBoundsJST(0);
  const lastWeek = getWeekBoundsJST(-1);

  const [recentLogs, thisWeekLogs, lastWeekLogs] = await Promise.all([
    getRecentLogs(10),
    getLogsByRange(thisWeek.start, thisWeek.end),
    getLogsByRange(lastWeek.start, lastWeek.end),
  ]);

  const avgThisWeek = calculateAverageWakeTime(thisWeekLogs);
  const avgLastWeek = calculateAverageWakeTime(lastWeekLogs);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <StatsCards
        avgThisWeek={avgThisWeek}
        avgLastWeek={avgLastWeek}
        thisWeekLabel={thisWeek.label}
        lastWeekLabel={lastWeek.label}
      />
      <section>
        <h2 className="text-lg font-semibold mb-3">最近の記録</h2>
        <RecentLogs logs={recentLogs} />
      </section>
    </div>
  );
}
