"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BPLog } from "@/lib/blood-pressure-queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";

export function BPHistory({ logs }: { logs: BPLog[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSys, setEditSys] = useState("");
  const [editDia, setEditDia] = useState("");
  const [editPulse, setEditPulse] = useState("");
  const [loading, setLoading] = useState(false);

  if (logs.length === 0) {
    return <p className="text-muted text-center py-8">記録がありません</p>;
  }

  async function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    setLoading(true);
    await fetch(`/api/blood-pressure/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  function startEdit(log: BPLog) {
    setEditingId(log.id);
    setEditSys(String(log.systolic));
    setEditDia(String(log.diastolic));
    setEditPulse(String(log.pulse));
  }

  async function handleSave(log: BPLog) {
    setLoading(true);
    await fetch(`/api/blood-pressure/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systolic: Number(editSys),
        diastolic: Number(editDia),
        pulse: Number(editPulse),
        measured_at: log.measured_at,
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
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editSys}
                  onChange={(e) => setEditSys(e.target.value)}
                  placeholder="最高"
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-20 text-center"
                />
                <span className="text-muted-light self-center">/</span>
                <input
                  type="number"
                  value={editDia}
                  onChange={(e) => setEditDia(e.target.value)}
                  placeholder="最低"
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-20 text-center"
                />
                <input
                  type="number"
                  value={editPulse}
                  onChange={(e) => setEditPulse(e.target.value)}
                  placeholder="脈拍"
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 w-20 text-center"
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
                  {formatShortDateJST(log.measured_at)}{" "}
                  {formatTimeJST(log.measured_at)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-light tracking-tighter">
                  {log.systolic}/{log.diastolic}
                </span>
                <span className="text-sm text-muted-light">
                  {log.pulse}bpm
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
