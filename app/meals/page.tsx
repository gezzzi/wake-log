export const revalidate = 60;

import { Utensils } from "lucide-react";
import {
  getRecentSchedules,
  getSchedulesByRange,
  getScheduleByDate,
} from "@/lib/schedule-queries";
import { getTodayJSTBounds, getWeekBoundsJST } from "@/lib/utils";
import { AddMealsButton } from "../_components/add-meals-button";
import { MealsTodayYesterday } from "../_components/meals-today-yesterday";
import { MealsChart } from "../_components/meals-chart";
import { ScheduleHistory } from "../_components/schedule-history";

function shiftDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export default async function MealsPage() {
  const today = getTodayJSTBounds();
  const todayStr = today.start.slice(0, 10);
  const yesterdayStr = shiftDate(todayStr, -1);

  // Past 30 days for chart
  const thisWeek = getWeekBoundsJST(0);
  const thisWeekEnd = thisWeek.end.slice(0, 10);
  const chartStart = shiftDate(todayStr, -30);

  const [todaySchedule, yesterdaySchedule, chartSchedules, recentSchedules] =
    await Promise.all([
      getScheduleByDate(todayStr),
      getScheduleByDate(yesterdayStr),
      getSchedulesByRange(chartStart, thisWeekEnd),
      getRecentSchedules(30),
    ]);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Utensils size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            食事
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <AddMealsButton />

      <MealsTodayYesterday
        todayDate={todayStr}
        yesterdayDate={yesterdayStr}
        todaySchedule={todaySchedule}
        yesterdaySchedule={yesterdaySchedule}
      />

      <MealsChart schedules={chartSchedules} />

      <div>
        <div className="flex items-center space-x-2 text-muted mb-3 px-1">
          <span className="text-sm font-medium uppercase tracking-wider">
            履歴
          </span>
        </div>
        <ScheduleHistory schedules={recentSchedules} />
      </div>
    </div>
  );
}
