"use client";

import type { WakeLog } from "@/lib/queries";
import {
  getCalendarDayJST,
  formatTimeJST,
  getWakeTimeColor,
  getWakeTimeTextColor,
} from "@/lib/utils";

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
  // Map logs by JST date string
  const logsByDay = new Map<string, WakeLog>();
  for (const log of logs) {
    const day = getCalendarDayJST(log.woke_up_at);
    logsByDay.set(day, log);
  }

  // Build calendar grid
  // First day of month in JST
  const firstDay = new Date(year, month - 1, 1);
  // getDay(): 0=Sun, convert to Mon-start: (getDay() + 6) % 7
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete the last week
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-foreground/40 py-1"
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
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs gap-0.5 ${
                log
                  ? getWakeTimeColor(log.woke_up_at)
                  : "bg-foreground/[0.03]"
              }`}
            >
              <span className="text-foreground/50">{day}</span>
              {log && (
                <span
                  className={`font-mono font-bold text-sm ${getWakeTimeTextColor(log.woke_up_at)}`}
                >
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
