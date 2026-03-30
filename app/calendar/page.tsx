export const dynamic = "force-dynamic";

import { getLogsByMonth } from "@/lib/queries";
import { MonthNavigator } from "../_components/month-navigator";
import { CalendarGrid } from "../_components/calendar-grid";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;

  // Default to current month in JST
  const now = new Date();
  const jstNow = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);

  const year = params.year
    ? Number(params.year)
    : Number(jstNow.find((p) => p.type === "year")!.value);
  const month = params.month
    ? Number(params.month)
    : Number(jstNow.find((p) => p.type === "month")!.value);

  const logs = await getLogsByMonth(year, month);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">カレンダー</h1>
        <MonthNavigator year={year} month={month} />
      </div>
      <CalendarGrid logs={logs} year={year} month={month} />
    </div>
  );
}
