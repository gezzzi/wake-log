"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "./modal";
import { saveSchedule } from "@/app/actions/schedule";

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

export function AddMealsButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getTodayDateJST());
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setDate(getTodayDateJST());
    setBreakfast("");
    setLunch("");
    setDinner("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveSchedule({
        date,
        breakfast_at: breakfast || null,
        lunch_at: lunch || null,
        dinner_at: dinner || null,
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
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-card rounded-2xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 text-sm text-muted hover:text-foreground hover:shadow-md transition-all"
      >
        <Plus size={16} />
        記録を追加
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="食事の時間を追加">
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                朝
              </label>
              <input
                type="time"
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                昼
              </label>
              <input
                type="time"
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                夜
              </label>
              <input
                type="time"
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
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
