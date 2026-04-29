export const revalidate = 60;

import { Calendar } from "lucide-react";
import { getScheduleByDate } from "@/lib/schedule-queries";
import { getTodayJSTBounds } from "@/lib/utils";
import { ScheduleForm } from "../_components/schedule-form";

export default async function SchedulePage() {
  const today = getTodayJSTBounds();
  // Extract YYYY-MM-DD from today's start (e.g., "2026-04-28T00:00:00+09:00")
  const dateStr = today.start.slice(0, 10);

  const schedule = await getScheduleByDate(dateStr);

  // Format date for display
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Calendar size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            スケジュール
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">食事の時間</h1>
        <p className="text-muted text-sm mt-1">{dateLabel}</p>
      </header>

      <ScheduleForm date={dateStr} initial={schedule} />
    </div>
  );
}
