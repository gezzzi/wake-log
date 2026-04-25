"use client";

import { useState, useMemo } from "react";
import type { ExerciseLog } from "@/lib/exercise-queries";
import { getWeekBoundsJST, getTodayJSTBounds } from "@/lib/utils";
import { ExerciseHistory } from "./exercise-history";
import { ExerciseChart } from "./exercise-chart";
import { AddExerciseButton } from "./add-exercise-button";

type Filter = "all" | "run" | "walk";

const FILTER_LABELS: Record<Filter, string> = {
  all: "すべて",
  run: "ランニング",
  walk: "ウォーキング",
};

export function CardioContent({ allLogs }: { allLogs: ExerciseLog[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const today = useMemo(() => getTodayJSTBounds(), []);
  const thisWeek = useMemo(() => getWeekBoundsJST(0), []);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const offset = -(11 - i);
      const bounds = getWeekBoundsJST(offset);
      const inWeek = allLogs.filter(
        (log) =>
          new Date(log.done_at) >= new Date(bounds.start) &&
          new Date(log.done_at) <= new Date(bounds.end)
      );
      const filtered =
        filter === "all" ? inWeek : inWeek.filter((log) => log.type === filter);
      return { week: bounds.label, count: filtered.length };
    });
  }, [allLogs, filter]);

  const { todaySplit, thisWeekSplit } = useMemo(() => {
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
    return {
      todaySplit: {
        run: todayLogs.filter((l) => l.type === "run").length,
        walk: todayLogs.filter((l) => l.type === "walk").length,
      },
      thisWeekSplit: {
        run: thisWeekLogs.filter((l) => l.type === "run").length,
        walk: thisWeekLogs.filter((l) => l.type === "walk").length,
      },
    };
  }, [allLogs, today, thisWeek]);

  const filteredLogs = useMemo(() => {
    const filtered =
      filter === "all" ? allLogs : allLogs.filter((l) => l.type === filter);
    return [...filtered]
      .sort((a, b) => (a.done_at < b.done_at ? 1 : -1))
      .slice(0, 20);
  }, [allLogs, filter]);

  function countForFilter(split: { run: number; walk: number }): number {
    if (filter === "run") return split.run;
    if (filter === "walk") return split.walk;
    return split.run + split.walk;
  }

  return (
    <>
      <div className="flex gap-2">
        {(["all", "run", "walk"] as Filter[]).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-center py-2 rounded-full text-sm transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "bg-card text-muted border border-transparent dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
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
                <div className="text-5xl font-light tracking-tighter">
                  {todaySplit.run}回
                </div>
                <div className="text-muted-light text-sm font-medium mt-1">
                  ランニング
                </div>
              </div>
              <div>
                <div className="text-5xl font-light tracking-tighter">
                  {todaySplit.walk}回
                </div>
                <div className="text-muted-light text-sm font-medium mt-1">
                  ウォーキング
                </div>
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
                <div className="text-5xl font-light tracking-tighter">
                  {thisWeekSplit.run}回
                </div>
                <div className="text-muted-light text-sm font-medium mt-1">
                  ランニング
                </div>
              </div>
              <div>
                <div className="text-5xl font-light tracking-tighter">
                  {thisWeekSplit.walk}回
                </div>
                <div className="text-muted-light text-sm font-medium mt-1">
                  ウォーキング
                </div>
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
        <ExerciseHistory logs={filteredLogs} />
      </div>
    </>
  );
}
