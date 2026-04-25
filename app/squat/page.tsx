export const revalidate = 60;

import { Dumbbell } from "lucide-react";
import { getExerciseByRange } from "@/lib/exercise-queries";
import { getWeekBoundsJST, getTodayJSTBounds } from "@/lib/utils";
import { ExerciseHistory } from "../_components/exercise-history";
import { ExerciseChart } from "../_components/exercise-chart";
import { AddExerciseButton } from "../_components/add-exercise-button";

export default async function SquatPage() {
  const today = getTodayJSTBounds();
  const thisWeek = getWeekBoundsJST(0);
  const twelveWeeksAgo = getWeekBoundsJST(-11);

  // Single query: get all squat logs for past 12 weeks
  const allLogs = await getExerciseByRange(
    "squat",
    twelveWeeksAgo.start,
    thisWeek.end
  );

  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const offset = -(11 - i);
    const bounds = getWeekBoundsJST(offset);
    const count = allLogs.filter(
      (log) =>
        new Date(log.done_at) >= new Date(bounds.start) &&
        new Date(log.done_at) <= new Date(bounds.end)
    ).length;
    return { week: bounds.label, count };
  });

  const todayCount = allLogs.filter(
    (log) =>
      new Date(log.done_at) >= new Date(today.start) &&
      new Date(log.done_at) <= new Date(today.end)
  ).length;
  const thisWeekCount = allLogs.filter(
    (log) =>
      new Date(log.done_at) >= new Date(thisWeek.start) &&
      new Date(log.done_at) <= new Date(thisWeek.end)
  ).length;
  const logs = [...allLogs]
    .sort((a, b) => (a.done_at < b.done_at ? 1 : -1))
    .slice(0, 30);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Dumbbell size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            スクワット
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <AddExerciseButton type="squat" />

      <div className="space-y-4">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            {today.label}の回数
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {todayCount}回
          </div>
        </div>
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            {thisWeek.label}の回数
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {thisWeekCount}回
          </div>
        </div>
      </div>

      <ExerciseChart data={weeklyData} />

      <div>
        <div className="flex items-center space-x-2 text-muted mb-3 px-1">
          <span className="text-sm font-medium uppercase tracking-wider">
            履歴
          </span>
        </div>
        <ExerciseHistory logs={logs} />
      </div>
    </div>
  );
}
