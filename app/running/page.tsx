export const dynamic = "force-dynamic";

import { Activity } from "lucide-react";
import {
  getRecentByType,
  getExerciseByRange,
  calculateAverageDuration,
} from "@/lib/exercise-queries";
import { getWeekBoundsJST } from "@/lib/utils";
import { ExerciseHistory } from "../_components/exercise-history";
import { ExerciseChart } from "../_components/exercise-chart";

export default async function RunningPage() {
  const thisWeek = getWeekBoundsJST(0);
  const lastWeek = getWeekBoundsJST(-1);

  const [logs, thisWeekLogs, lastWeekLogs] = await Promise.all([
    getRecentByType("run", 20),
    getExerciseByRange("run", thisWeek.start, thisWeek.end),
    getExerciseByRange("run", lastWeek.start, lastWeek.end),
  ]);

  const avgThisWeek = calculateAverageDuration(thisWeekLogs);
  const avgLastWeek = calculateAverageDuration(lastWeekLogs);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            ランニング
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            今週の平均
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {avgThisWeek !== null ? `${avgThisWeek}分` : "---"}
          </div>
          <div className="text-xs text-muted-light mt-2">{thisWeek.label}</div>
        </div>
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            先週の平均
          </div>
          <div className="text-5xl font-light tracking-tighter">
            {avgLastWeek !== null ? `${avgLastWeek}分` : "---"}
          </div>
          <div className="text-xs text-muted-light mt-2">{lastWeek.label}</div>
        </div>
      </div>

      <ExerciseChart logs={logs} />

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
