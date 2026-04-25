"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExerciseLog } from "@/lib/exercise-queries";
import { SQUAT_TAGS, CARDIO_TIME_TAGS } from "@/lib/exercise-tags";

const SQUAT_TAG_COLORS: Record<string, string> = {
  歯磨き: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  午前: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  午後: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  寝る前: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  その他: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const CARDIO_TAG_COLORS: Record<string, string> = {
  寝起き: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  午前: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  午後: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";

export function ExerciseHistory({ logs }: { logs: ExerciseLog[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editTag, setEditTag] = useState<string>("");
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
    setEditTime(formatTimeJST(log.done_at));
    setEditTag(log.tag ?? "");
  }

  async function handleSave(log: ExerciseLog) {
    setLoading(true);
    const date = log.done_at.slice(0, 10).replace(/\//g, "-");
    const [h, m] = editTime.split(":");
    const newDoneAt = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    await fetch(`/api/exercise/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: log.type,
        done_at: newDoneAt,
        tag: editTag || null,
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
      {logs.map((log) => (
        <div key={log.id} className="px-6 py-4">
          {editingId === log.id ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-24 text-center"
                />
                {log.type === "squat" && (
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">（タグなし）</option>
                    {SQUAT_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
                {(log.type === "run" || log.type === "walk") && (
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="">（タグなし）</option>
                    {CARDIO_TIME_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">
                  {formatShortDateJST(log.done_at)}
                </span>
                {(log.type === "run" || log.type === "walk") && log.tag && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${CARDIO_TAG_COLORS[log.tag] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                  >
                    {log.tag}
                  </span>
                )}
                {log.type === "run" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                    ランニング
                  </span>
                )}
                {log.type === "walk" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    ウォーキング
                  </span>
                )}
                {log.type === "squat" && log.tag && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${SQUAT_TAG_COLORS[log.tag] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                  >
                    {log.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-light tracking-tighter">
                  {formatTimeJST(log.done_at)}
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
      ))}
    </div>
  );
}
