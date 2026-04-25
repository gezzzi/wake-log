export const revalidate = 60;

import Link from "next/link";
import { Activity } from "lucide-react";
import { getRunWalkByRange } from "@/lib/exercise-queries";
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
  const twelveWeeksAgo = getWeekBoundsJST(-11);

  // Single query: get all run/walk logs for past 12 weeks
  const allLogs = await getRunWalkByRange(twelveWeeksAgo.start, thisWeek.end);

  // Compute weekly counts in JS
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const offset = -(11 - i);
    const bounds = getWeekBoundsJST(offset);
    const inWeek = allLogs.filter(
      (log) =>
        new Date(log.done_at) >= new Date(bounds.start) &&
        new Date(log.done_at) <= new Date(bounds.end)
    );
    const filtered =
      filter === "all"
        ? inWeek
        : inWeek.filter((log) => log.type === filter);
    return { week: bounds.label, count: filtered.length };
  });

  // Compute today/this week splits in JS
  const todayLogs = allLogs.filter(
    (log) =>
      new Date(log.done_at) >= new Date(today.start) &&
      new Date(log.done_at) <= new Date(today.end)
  );
  const thisWeekLogs = allLogs.filter(
    (log) =>
      new Date(log.done_at) >= new Date(thisWeek.start) &&
      new Date(log.done_at) <= new Date(thisWeek.end)
  );
  const todaySplit = {
    run: todayLogs.filter((l) => l.type === "run").length,
    walk: todayLogs.filter((l) => l.type === "walk").length,
  };
  const thisWeekSplit = {
    run: thisWeekLogs.filter((l) => l.type === "run").length,
    walk: thisWeekLogs.filter((l) => l.type === "walk").length,
  };

  // Recent 20 logs (filtered)
  const filteredAll =
    filter === "all" ? allLogs : allLogs.filter((l) => l.type === filter);
  const logs = [...filteredAll]
    .sort((a, b) => (a.done_at < b.done_at ? 1 : -1))
    .slice(0, 20);

  function countForFilter(split: { run: number; walk: number }): number {
    if (filter === "run") return split.run;
    if (filter === "walk") return split.walk;
    return split.run + split.walk;
  }

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
              prefetch
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
            {today.label}の回数
          </div>
          {filter === "all" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-5xl font-light tracking-tighter">{todaySplit.run}回</div>
                <div className="text-muted-light text-sm font-medium mt-1">ランニング</div>
              </div>
              <div>
                <div className="text-5xl font-light tracking-tighter">{todaySplit.walk}回</div>
                <div className="text-muted-light text-sm font-medium mt-1">ウォーキング</div>
              </div>
            </div>
          ) : (
            <div className="text-5xl font-light tracking-tighter">
              {countForFilter(todaySplit)}回
            </div>
          )}
        </div>
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            {thisWeek.label}の回数
          </div>
          {filter === "all" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-5xl font-light tracking-tighter">{thisWeekSplit.run}回</div>
                <div className="text-muted-light text-sm font-medium mt-1">ランニング</div>
              </div>
              <div>
                <div className="text-5xl font-light tracking-tighter">{thisWeekSplit.walk}回</div>
                <div className="text-muted-light text-sm font-medium mt-1">ウォーキング</div>
              </div>
            </div>
          ) : (
            <div className="text-5xl font-light tracking-tighter">
              {countForFilter(thisWeekSplit)}回
            </div>
          )}
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
