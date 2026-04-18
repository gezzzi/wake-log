export const dynamic = "force-dynamic";

import Link from "next/link";
import { Activity } from "lucide-react";
import {
  getRecentByType,
  getRecentRunOrWalk,
  countExerciseByRange,
  getExerciseByRange,
  getRunWalkByRange,
} from "@/lib/exercise-queries";
import { getWeekBoundsJST, getTodayJSTBounds } from "@/lib/utils";
import { ExerciseHistory } from "../_components/exercise-history";
import { ExerciseChart } from "../_components/exercise-chart";
import { AddExerciseButton } from "../_components/add-exercise-button";

type Filter = "all" | "run" | "walk";

const FILTER_LABELS: Record<Filter, string> = {
  all: "すべて",
  run: "ランニング",
  walk: "ウォーキング",
};

async function countForFilter(
  filter: Filter,
  start: string,
  end: string
): Promise<number> {
  if (filter === "all") {
    const [r, w] = await Promise.all([
      countExerciseByRange("run", start, end),
      countExerciseByRange("walk", start, end),
    ]);
    return r + w;
  }
  return countExerciseByRange(filter, start, end);
}

export default async function CardioPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const raw = params.type ?? "all";
  const filter: Filter = raw === "run" || raw === "walk" ? raw : "all";

  const today = getTodayJSTBounds();
  const thisWeek = getWeekBoundsJST(0);

  const weeklyData = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const offset = -(11 - i);
      const bounds = getWeekBoundsJST(offset);
      let count: number;
      if (filter === "all") {
        const logs = await getRunWalkByRange(bounds.start, bounds.end);
        count = logs.length;
      } else {
        const logs = await getExerciseByRange(filter, bounds.start, bounds.end);
        count = logs.length;
      }
      return { week: bounds.label, count };
    })
  );

  const [logs, todayCount, thisWeekCount] = await Promise.all([
    filter === "all" ? getRecentRunOrWalk(20) : getRecentByType(filter, 20),
    countForFilter(filter, today.start, today.end),
    countForFilter(filter, thisWeek.start, thisWeek.end),
  ]);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            有酸素運動
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="flex gap-2">
        {(["all", "run", "walk"] as Filter[]).map((f) => {
          const active = filter === f;
          const href = f === "all" ? "/cardio" : `/cardio?type=${f}`;
          return (
            <Link
              key={f}
              href={href}
              className={`flex-1 text-center py-2 rounded-full text-sm transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "bg-card text-muted border border-transparent dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {FILTER_LABELS[f]}
            </Link>
          );
        })}
      </div>

      <AddExerciseButton type="cardio" />

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
