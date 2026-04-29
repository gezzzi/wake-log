"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DailySchedule } from "@/lib/schedule-queries";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { saveSchedule, deleteScheduleAction } from "@/app/actions/schedule";

function formatDateLabel(date: string): string {
  // date is YYYY-MM-DD JST
  const [y, m, d] = date.split("-").map(Number);
  const jsDate = new Date(Date.UTC(y, m - 1, d));
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "UTC",
    weekday: "short",
  }).format(jsDate);
  return `${m}/${d} (${weekday})`;
}

export function ScheduleHistory({ schedules }: { schedules: DailySchedule[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBreakfast, setEditBreakfast] = useState("");
  const [editLunch, setEditLunch] = useState("");
  const [editDinner, setEditDinner] = useState("");
  const [isPending, startTransition] = useTransition();

  if (schedules.length === 0) {
    return <p className="text-muted text-center py-8">記録がありません</p>;
  }

  function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    startTransition(async () => {
      await deleteScheduleAction(id);
      router.refresh();
    });
  }

  function startEdit(s: DailySchedule) {
    setEditingId(s.id);
    setEditBreakfast(s.breakfast_at ?? "");
    setEditLunch(s.lunch_at ?? "");
    setEditDinner(s.dinner_at ?? "");
  }

  function handleSave(s: DailySchedule) {
    startTransition(async () => {
      await saveSchedule({
        date: s.date,
        breakfast_at: editBreakfast || null,
        lunch_at: editLunch || null,
        dinner_at: editDinner || null,
      });
      setEditingId(null);
      router.refresh();
    });
  }

  return (
    <div
      className={`bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      {schedules.map((s) => (
        <div key={s.id} className="px-6 py-4">
          {editingId === s.id ? (
            <div className="space-y-2">
              <div className="text-sm text-muted">{formatDateLabel(s.date)}</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-muted-light mb-1">朝</label>
                  <input
                    type="time"
                    value={editBreakfast}
                    onChange={(e) => setEditBreakfast(e.target.value)}
                    className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-light mb-1">昼</label>
                  <input
                    type="time"
                    value={editLunch}
                    onChange={(e) => setEditLunch(e.target.value)}
                    className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-light mb-1">夜</label>
                  <input
                    type="time"
                    value={editDinner}
                    onChange={(e) => setEditDinner(e.target.value)}
                    className="w-full bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleSave(s)}
                  className="p-1.5 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1.5 rounded-full text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="text-sm text-muted">
                  {formatDateLabel(s.date)}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-light">朝</span>
                    <span className="font-mono">{s.breakfast_at ?? "—"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-light">昼</span>
                    <span className="font-mono">{s.lunch_at ?? "—"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-light">夜</span>
                    <span className="font-mono">{s.dinner_at ?? "—"}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(s)}
                  className="p-1.5 rounded-full text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-full text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
