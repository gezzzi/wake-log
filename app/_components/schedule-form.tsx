"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Sun, Moon } from "lucide-react";
import type { DailySchedule } from "@/lib/schedule-queries";
import { saveSchedule } from "@/app/actions/schedule";

export function ScheduleForm({
  date,
  initial,
}: {
  date: string;
  initial: DailySchedule | null;
}) {
  const router = useRouter();
  const [breakfast, setBreakfast] = useState(initial?.breakfast_at ?? "");
  const [lunch, setLunch] = useState(initial?.lunch_at ?? "");
  const [dinner, setDinner] = useState(initial?.dinner_at ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
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
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300">
            <Coffee size={18} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted mb-1">
              朝ご飯
            </label>
            <input
              type="time"
              value={breakfast}
              onChange={(e) => setBreakfast(e.target.value)}
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-700 dark:text-sky-300">
            <Sun size={18} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted mb-1">
              昼ご飯
            </label>
            <input
              type="time"
              value={lunch}
              onChange={(e) => setLunch(e.target.value)}
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
            <Moon size={18} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted mb-1">
              夜ご飯
            </label>
            <input
              type="time"
              value={dinner}
              onChange={(e) => setDinner(e.target.value)}
              className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {saved && (
        <p className="text-sm text-green-600 dark:text-green-400 text-center">
          保存しました
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-2xl bg-foreground text-background font-medium disabled:opacity-50 transition-opacity"
      >
        {isPending ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
