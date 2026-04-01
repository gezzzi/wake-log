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
      <header className="pt-4 pb-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight">カレンダー</h1>
        </div>
        <MonthNavigator year={year} month={month} />
      </header>
      <CalendarGrid logs={logs} year={year} month={month} />
    </div>
  );
}
