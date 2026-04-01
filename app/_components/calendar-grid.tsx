"use client";

import type { WakeLog } from "@/lib/queries";
import { getCalendarDayJST, formatTimeJST } from "@/lib/utils";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

export function CalendarGrid({
  logs,
  year,
  month,
}: {
  logs: WakeLog[];
  year: number;
  month: number;
}) {
  const logsByDay = new Map<string, WakeLog>();
  for (const log of logs) {
    const day = getCalendarDayJST(log.woke_up_at);
    logsByDay.set(day, log);
  }

  const firstDay = new Date(year, month - 1, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-card rounded-3xl p-5 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-muted font-medium uppercase tracking-wider py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const log = logsByDay.get(dateStr);

          return (
            <div
              key={day}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs gap-0.5 transition-colors ${
                log
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <span className={log ? "text-white/60 dark:text-gray-900/60 text-[10px]" : "text-muted text-[10px]"}>
                {day}
              </span>
              {log && (
                <span className="font-medium text-sm">
                  {formatTimeJST(log.woke_up_at)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
