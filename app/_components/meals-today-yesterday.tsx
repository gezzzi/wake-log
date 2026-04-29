"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DailySchedule } from "@/lib/schedule-queries";
import { Modal } from "./modal";
import { saveSchedule } from "@/app/actions/schedule";

function formatDateLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const jsDate = new Date(Date.UTC(y, m - 1, d));
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "UTC",
    weekday: "short",
  }).format(jsDate);
  return `${m}/${d} (${weekday})`;
}

function MealCard({
  title,
  dateLabel,
  schedule,
  onClick,
}: {
  title: string;
  dateLabel: string;
  schedule: DailySchedule | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted uppercase tracking-wider">
          {title}
        </span>
        <span className="text-xs text-muted-light">{dateLabel}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {schedule?.breakfast_at ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">朝</div>
        </div>
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {schedule?.lunch_at ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">昼</div>
        </div>
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {schedule?.dinner_at ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">夜</div>
        </div>
      </div>
    </button>
  );
}

export function MealsTodayYesterday({
  todayDate,
  yesterdayDate,
  todaySchedule,
  yesterdaySchedule,
}: {
  todayDate: string;
  yesterdayDate: string;
  todaySchedule: DailySchedule | null;
  yesterdaySchedule: DailySchedule | null;
}) {
  const router = useRouter();
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [breakfastSkipped, setBreakfastSkipped] = useState(false);
  const [lunchSkipped, setLunchSkipped] = useState(false);
  const [dinnerSkipped, setDinnerSkipped] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openEdit(date: string, schedule: DailySchedule | null) {
    setEditingDate(date);
    setBreakfast(schedule?.breakfast_at ?? "");
    setLunch(schedule?.lunch_at ?? "");
    setDinner(schedule?.dinner_at ?? "");
    setBreakfastSkipped(false);
    setLunchSkipped(false);
    setDinnerSkipped(false);
    setError(null);
  }

  function closeEdit() {
    setEditingDate(null);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDate) return;
    setError(null);
    startTransition(async () => {
      const result = await saveSchedule({
        date: editingDate,
        breakfast_at: breakfastSkipped ? null : breakfast || null,
        lunch_at: lunchSkipped ? null : lunch || null,
        dinner_at: dinnerSkipped ? null : dinner || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      closeEdit();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <MealCard
        title="今日の記録"
        dateLabel={formatDateLabel(todayDate)}
        schedule={todaySchedule}
        onClick={() => openEdit(todayDate, todaySchedule)}
      />
      <MealCard
        title="昨日の記録"
        dateLabel={formatDateLabel(yesterdayDate)}
        schedule={yesterdaySchedule}
        onClick={() => openEdit(yesterdayDate, yesterdaySchedule)}
      />

      <Modal
        open={editingDate !== null}
        onClose={closeEdit}
        title={
          editingDate ? `食事の時間を編集 (${formatDateLabel(editingDate)})` : ""
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {(
            [
              {
                label: "朝",
                time: breakfast,
                setTime: setBreakfast,
                skipped: breakfastSkipped,
                setSkipped: setBreakfastSkipped,
              },
              {
                label: "昼",
                time: lunch,
                setTime: setLunch,
                skipped: lunchSkipped,
                setSkipped: setLunchSkipped,
              },
              {
                label: "夜",
                time: dinner,
                setTime: setDinner,
                skipped: dinnerSkipped,
                setSkipped: setDinnerSkipped,
              },
            ] as const
          ).map((row) => (
            <div key={row.label} className="space-y-2">
              <label className="block text-sm font-medium text-muted">
                {row.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => row.setTime(e.target.value)}
                  disabled={row.skipped}
                  className="flex-1 bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 disabled:opacity-40"
                />
                <label className="flex items-center gap-1.5 text-sm text-muted cursor-pointer select-none whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={row.skipped}
                    onChange={(e) => row.setSkipped(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
                  />
                  抜く
                </label>
              </div>
            </div>
          ))}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={closeEdit}
              className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-2xl bg-foreground text-background font-medium disabled:opacity-50 transition-opacity"
            >
              {isPending ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
