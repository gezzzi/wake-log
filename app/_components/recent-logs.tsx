"use client";

import { useState, useTransition } from "react";
import type { WakeLog } from "@/lib/queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { updateWakeLog, deleteWakeLog } from "@/app/actions/wake";

export function RecentLogs({ logs }: { logs: WakeLog[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isPending, startTransition] = useTransition();

  if (logs.length === 0) {
    return (
      <p className="text-muted text-center py-8">記録がありません</p>
    );
  }

  function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    startTransition(async () => {
      await deleteWakeLog(id);
    });
  }

  function startEdit(log: WakeLog) {
    setEditingId(log.id);
    const time = formatTimeJST(log.woke_up_at);
    setEditValue(time);
  }

  function handleSave(log: WakeLog) {
    const date = log.woke_up_at.slice(0, 10);
    const [h, m] = editValue.split(":");
    const newTime = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    startTransition(async () => {
      await updateWakeLog(log.id, newTime);
      setEditingId(null);
    });
  }

  return (
    <div className={`bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors divide-y divide-gray-100 dark:divide-gray-800 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between px-6 py-4"
        >
          <span className="text-sm text-muted">
            {formatShortDateJST(log.woke_up_at)}
          </span>
          <div className="flex items-center gap-3">
            {editingId === log.id ? (
              <>
                <input
                  type="time"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-lg font-light tracking-tighter w-24 text-center"
                />
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
              </>
            ) : (
              <>
                <span className="text-2xl font-light tracking-tighter">
                  {formatTimeJST(log.woke_up_at)}
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
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
