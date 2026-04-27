"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "./modal";
import { BP_TIME_TAGS, BP_SITUATION_TAGS } from "@/lib/bp-tags";
import { createBP } from "@/app/actions/blood-pressure";

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

export function AddBPButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initial = getCurrentDateTimeJST();
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [timeTag, setTimeTag] = useState<string>("");
  const [situationTag, setSituationTag] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    const now = getCurrentDateTimeJST();
    setDate(now.date);
    setTime(now.time);
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setTimeTag("");
    setSituationTag("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const [h, m] = time.split(":");
    const measured_at = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    startTransition(async () => {
      const result = await createBP({
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulse: Number(pulse),
        measured_at,
        time_tag: timeTag || null,
        situation_tag: situationTag || null,
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
      <Modal open={open} onClose={() => setOpen(false)} title="血圧を追加">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                最高
              </label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                required
                min={0}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                最低
              </label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                required
                min={0}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                脈拍
              </label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                required
                min={0}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              />
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                時間タグ
              </label>
              <select
                value={timeTag}
                onChange={(e) => setTimeTag(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">（なし）</option>
                {BP_TIME_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                状況タグ
              </label>
              <select
                value={situationTag}
                onChange={(e) => setSituationTag(e.target.value)}
                className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">（なし）</option>
                {BP_SITUATION_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
