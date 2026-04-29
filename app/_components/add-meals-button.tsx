"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "./modal";
import { saveMealTime } from "@/app/actions/schedule";

type MealType = "breakfast" | "lunch" | "dinner";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝",
  lunch: "昼",
  dinner: "夜",
};

function getTodayDateJST(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function getCurrentTimeJST(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = parts.find((p) => p.type === "hour")!.value;
  const mi = parts.find((p) => p.type === "minute")!.value;
  return `${h}:${mi}`;
}

function guessMealType(time: string): MealType {
  const [h] = time.split(":").map(Number);
  if (h >= 5 && h < 11) return "breakfast";
  if (h >= 11 && h < 16) return "lunch";
  return "dinner";
}

export function AddMealsButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initialTime = getCurrentTimeJST();
  const [date, setDate] = useState(getTodayDateJST());
  const [time, setTime] = useState(initialTime);
  const [mealType, setMealType] = useState<MealType>(guessMealType(initialTime));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    const now = getCurrentTimeJST();
    setDate(getTodayDateJST());
    setTime(now);
    setMealType(guessMealType(now));
    setError(null);
  }

  function openModal() {
    reset();
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveMealTime({
        date,
        meal_type: mealType,
        time,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      reset();
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={openModal}
        className="w-full flex items-center justify-center gap-2 py-3 bg-card rounded-2xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 text-sm text-muted hover:text-foreground hover:shadow-md transition-all"
      >
        <Plus size={16} />
        記録を追加
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="食事の時間を追加">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              種類
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["breakfast", "lunch", "dinner"] as MealType[]).map((m) => {
                const active = mealType === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMealType(m)}
                    className={`py-2 rounded-lg border text-sm transition-colors ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "border-gray-200 dark:border-gray-700 text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {MEAL_LABELS[m]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                日付
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                時刻
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
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
    </>
  );
}
