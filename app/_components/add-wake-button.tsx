"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "./modal";

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

export function AddWakeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getTodayDateJST());
  const [time, setTime] = useState(getCurrentTimeJST());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const [h, m] = time.split(":");
    const woke_up_at = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    const res = await fetch("/api/wake-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ woke_up_at }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "エラーが発生しました");
      return;
    }
    setOpen(false);
    setDate(getTodayDateJST());
    setTime(getCurrentTimeJST());
    router.refresh();
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
      <Modal open={open} onClose={() => setOpen(false)} title="起床時間を追加">
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
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-foreground text-background font-medium disabled:opacity-50 transition-opacity"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
