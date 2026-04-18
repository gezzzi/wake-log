export const dynamic = "force-dynamic";

import { Activity } from "lucide-react";
import {
  getRecentByType,
  countExerciseByRange,
  getExerciseByRange,
} from "@/lib/exercise-queries";
import { getWeekBoundsJST, getTodayJSTBounds } from "@/lib/utils";
import { ExerciseHistory } from "../_components/exercise-history";
import { ExerciseChart } from "../_components/exercise-chart";
import { AddExerciseButton } from "../_components/add-exercise-button";

export default async function WalkingPage() {
  const today = getTodayJSTBounds();
  const thisWeek = getWeekBoundsJST(0);

  const weeklyData = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const offset = -(11 - i);
      const bounds = getWeekBoundsJST(offset);
      return getExerciseByRange("walk", bounds.start, bounds.end).then((logs) => ({
        week: bounds.label,
        count: logs.length,
      }));
    })
  );

  const [logs, todayCount, thisWeekCount] = await Promise.all([
    getRecentByType("walk", 20),
    countExerciseByRange("walk", today.start, today.end),
    countExerciseByRange("walk", thisWeek.start, thisWeek.end),
  ]);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            ウォーキング
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <AddExerciseButton type="walk" />

      <div className="space-y-4">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            今日の回数
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {todayCount}回
          </div>
          <div className="text-xs text-muted-light mt-2">{today.label}</div>
        </div>
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            今週の回数
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {thisWeekCount}回
          </div>
          <div className="text-xs text-muted-light mt-2">{thisWeek.label}</div>
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
