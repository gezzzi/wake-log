export const dynamic = "force-dynamic";

import { getRecentLogs, getLogsForDays } from "@/lib/queries";
import { calculateAverageWakeTime } from "@/lib/utils";
import { StatsCards } from "./_components/stats-cards";
import { RecentLogs } from "./_components/recent-logs";

export default async function Home() {
  const [recentLogs, logs7, logs30] = await Promise.all([
    getRecentLogs(10),
    getLogsForDays(7),
    getLogsForDays(30),
  ]);

  const avg7 = calculateAverageWakeTime(logs7);
  const avg30 = calculateAverageWakeTime(logs30);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <StatsCards avg7={avg7} avg30={avg30} />
      <section>
        <h2 className="text-lg font-semibold mb-3">最近の記録</h2>
        <RecentLogs logs={recentLogs} />
      </section>
    </div>
  );
}
