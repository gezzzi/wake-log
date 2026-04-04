"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExerciseLog } from "@/lib/exercise-queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  run: "ランニング",
  walk: "ウォーキング",
  squat: "スクワット",
};

function calcDurationMinutes(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.round((e - s) / 60000);
}

export function ExerciseHistory({ logs }: { logs: ExerciseLog[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [loading, setLoading] = useState(false);

  if (logs.length === 0) {
    return <p className="text-muted text-center py-8">記録がありません</p>;
  }

  async function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    setLoading(true);
    await fetch(`/api/exercise/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  function startEdit(log: ExerciseLog) {
    setEditingId(log.id);
    setEditStart(formatTimeJST(log.started_at));
    setEditEnd(formatTimeJST(log.ended_at));
  }

  async function handleSave(log: ExerciseLog) {
    setLoading(true);
    const date = log.started_at.slice(0, 10);
    const [sh, sm] = editStart.split(":");
    const [eh, em] = editEnd.split(":");
    const newStart = `${date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00+09:00`;
    const newEnd = `${date}T${eh.padStart(2, "0")}:${em.padStart(2, "0")}:00+09:00`;
    await fetch(`/api/exercise/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: log.type,
        started_at: newStart,
        ended_at: newEnd,
      }),
    });
    setEditingId(null);
    router.refresh();
    setLoading(false);
  }

  return (
    <div
      className={`bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {logs.map((log) => {
        const duration = calcDurationMinutes(log.started_at, log.ended_at);
        return (
          <div key={log.id} className="px-6 py-4">
            {editingId === log.id ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-24 text-center"
                  />
                  <span className="text-muted">→</span>
                  <input
                    type="time"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-24 text-center"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleSave(log)}
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
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted">
                    {formatShortDateJST(log.started_at)}
                  </span>
                  {log.type !== "squat" && (
                    <span className="text-xs text-muted-light ml-2">
                      {TYPE_LABELS[log.type]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-light">
                    {formatTimeJST(log.started_at)}→
                    {formatTimeJST(log.ended_at)}
                  </span>
                  <span className="text-xl font-light tracking-tighter">
                    {duration}分
                  </span>
                  <button
                    onClick={() => startEdit(log)}
                    className="p-1.5 rounded-full text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1.5 rounded-full text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
