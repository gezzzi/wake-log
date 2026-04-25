"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Modal } from "./modal";
import { SQUAT_TAGS, CARDIO_TIME_TAGS } from "@/lib/exercise-tags";
import { createExerciseAction } from "@/app/actions/exercise";

function getCurrentDateTimeJST(): { date: string; time: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  const h = parts.find((p) => p.type === "hour")!.value;
  const mi = parts.find((p) => p.type === "minute")!.value;
  return { date: `${y}-${m}-${d}`, time: `${h}:${mi}` };
}

const TITLE_LABELS: Record<string, string> = {
  run: "ランニング",
  walk: "ウォーキング",
  squat: "スクワット",
  cardio: "有酸素運動",
};

type ExerciseType = "run" | "walk" | "squat" | "cardio";

export function AddExerciseButton({ type }: { type: ExerciseType }) {
  const [open, setOpen] = useState(false);
  const initial = getCurrentDateTimeJST();
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [tag, setTag] = useState<string>("");
  const [cardioType, setCardioType] = useState<"run" | "walk">("run");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    const now = getCurrentDateTimeJST();
    setDate(now.date);
    setTime(now.time);
    setTag("");
    setCardioType("run");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const [h, m] = time.split(":");
    const done_at = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    const actualType: "run" | "walk" | "squat" =
      type === "cardio" ? cardioType : type;
    startTransition(async () => {
      const result = await createExerciseAction({
        type: actualType,
        done_at,
        tag: tag || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      reset();
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${TITLE_LABELS[type]}を追加`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "cardio" && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                種類
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardioType("run")}
                  className={`py-2 rounded-lg border text-sm transition-colors ${
                    cardioType === "run"
                      ? "bg-foreground text-background border-foreground"
                      : "border-gray-200 dark:border-gray-700 text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  ランニング
                </button>
                <button
                  type="button"
                  onClick={() => setCardioType("walk")}
                  className={`py-2 rounded-lg border text-sm transition-colors ${
                    cardioType === "walk"
                      ? "bg-foreground text-background border-foreground"
                      : "border-gray-200 dark:border-gray-700 text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  ウォーキング
                </button>
              </div>
            </div>
          )}
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
          {type === "squat" && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                タグ
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">（タグなし）</option>
                {SQUAT_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(type === "run" || type === "walk" || type === "cardio") && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                時間タグ
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">（タグなし）</option>
                {CARDIO_TIME_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
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
