"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WakeLog } from "@/lib/queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";

export function RecentLogs({ logs }: { logs: WakeLog[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  if (logs.length === 0) {
    return (
      <p className="text-muted text-center py-8">記録がありません</p>
    );
  }

  async function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    setLoading(true);
    await fetch(`/api/wake-log/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  function startEdit(log: WakeLog) {
    setEditingId(log.id);
    // Extract time portion for the input (HH:mm)
    const time = formatTimeJST(log.woke_up_at);
    setEditValue(time);
  }

  async function handleSave(log: WakeLog) {
    setLoading(true);
    // Build full ISO string from original date + new time
    const date = log.woke_up_at.slice(0, 10);
    const [h, m] = editValue.split(":");
    const newTime = `${date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00+09:00`;
    await fetch(`/api/wake-log/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ woke_up_at: newTime }),
    });
    setEditingId(null);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className={`bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors divide-y divide-gray-100 dark:divide-gray-800 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
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
