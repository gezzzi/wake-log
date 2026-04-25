"use client";

import { useState, useTransition } from "react";
import type { BPLog } from "@/lib/blood-pressure-queries";
import { formatShortDateJST, formatTimeJST } from "@/lib/utils";
import { BP_TIME_TAGS, BP_SITUATION_TAGS } from "@/lib/bp-tags";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { updateBPAction, deleteBPAction } from "@/app/actions/blood-pressure";

const TIME_TAG_COLORS: Record<string, string> = {
  寝起き: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  午前: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  午後: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  寝る前: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
};

const SITUATION_TAG_COLORS: Record<string, string> = {
  食後: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  運動後: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  入浴後: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  ゲーム後: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  平常時: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function BPHistory({ logs }: { logs: BPLog[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSys, setEditSys] = useState("");
  const [editDia, setEditDia] = useState("");
  const [editPulse, setEditPulse] = useState("");
  const [editTimeTag, setEditTimeTag] = useState("");
  const [editSituationTag, setEditSituationTag] = useState("");
  const [isPending, startTransition] = useTransition();

  if (logs.length === 0) {
    return <p className="text-muted text-center py-8">記録がありません</p>;
  }

  function handleDelete(id: number) {
    if (!confirm("この記録を削除しますか？")) return;
    startTransition(async () => {
      await deleteBPAction(id);
    });
  }

  function startEdit(log: BPLog) {
    setEditingId(log.id);
    setEditSys(String(log.systolic));
    setEditDia(String(log.diastolic));
    setEditPulse(String(log.pulse));
    setEditTimeTag(log.time_tag ?? "");
    setEditSituationTag(log.situation_tag ?? "");
  }

  function handleSave(log: BPLog) {
    startTransition(async () => {
      await updateBPAction(log.id, {
        systolic: Number(editSys),
        diastolic: Number(editDia),
        pulse: Number(editPulse),
        measured_at: log.measured_at,
        time_tag: editTimeTag || null,
        situation_tag: editSituationTag || null,
      });
      setEditingId(null);
    });
  }

  return (
    <div
      className={`bg-card rounded-3xl shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
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
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editTimeTag}
                  onChange={(e) => setEditTimeTag(e.target.value)}
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                >
                  <option value="">時間（なし）</option>
                  {BP_TIME_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={editSituationTag}
                  onChange={(e) => setEditSituationTag(e.target.value)}
                  className="bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
                >
                  <option value="">状況（なし）</option>
                  {BP_SITUATION_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm text-muted">
                  {formatShortDateJST(log.measured_at)}{" "}
                  {formatTimeJST(log.measured_at)}
                </span>
                {(log.time_tag || log.situation_tag) && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {log.time_tag && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${TIME_TAG_COLORS[log.time_tag] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                      >
                        {log.time_tag}
                      </span>
                    )}
                    {log.situation_tag && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${SITUATION_TAG_COLORS[log.situation_tag] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                      >
                        {log.situation_tag}
                      </span>
                    )}
                  </div>
                )}
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
