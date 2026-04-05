export const dynamic = "force-dynamic";

import { Dumbbell } from "lucide-react";
import { getLatestExercise, getRecentByType } from "@/lib/exercise-queries";
import { ExerciseHistory } from "../_components/exercise-history";
import { ExerciseChart } from "../_components/exercise-chart";

function calcDurationMinutes(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

export default async function SquatPage() {
  const [latest, logs] = await Promise.all([
    getLatestExercise("squat"),
    getRecentByType("squat", 20),
  ]);

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

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
          最新の記録
        </div>
        {latest ? (
          <div>
            <div className="text-3xl font-light tracking-tighter">
              {calcDurationMinutes(latest.started_at, latest.ended_at)}分
            </div>
            <div className="text-muted-light text-sm font-medium mt-1">
              所要時間
            </div>
          </div>
        ) : (
          <p className="text-muted-light">データなし</p>
        )}
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
