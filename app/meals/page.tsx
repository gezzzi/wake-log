export const revalidate = 60;

import { Utensils } from "lucide-react";
import {
  getRecentSchedules,
  getSchedulesByRange,
  calculateMealAverages,
} from "@/lib/schedule-queries";
import { getWeekBoundsJST } from "@/lib/utils";
import { AddMealsButton } from "../_components/add-meals-button";
import { MealsStatsCards } from "../_components/meals-stats-cards";
import { MealsChart } from "../_components/meals-chart";
import { ScheduleHistory } from "../_components/schedule-history";

export default async function MealsPage() {
  const thisWeek = getWeekBoundsJST(0);
  const lastWeek = getWeekBoundsJST(-1);
  const thisWeekStart = thisWeek.start.slice(0, 10);
  const thisWeekEnd = thisWeek.end.slice(0, 10);
  const lastWeekStart = lastWeek.start.slice(0, 10);
  const lastWeekEnd = lastWeek.end.slice(0, 10);

  // Past 30 days for chart
  const chartStart = new Date();
  chartStart.setDate(chartStart.getDate() - 30);
  const chartStartStr = chartStart.toISOString().slice(0, 10);
  const chartEndStr = thisWeekEnd;

  const [thisWeekSchedules, lastWeekSchedules, chartSchedules, recentSchedules] =
    await Promise.all([
      getSchedulesByRange(thisWeekStart, thisWeekEnd),
      getSchedulesByRange(lastWeekStart, lastWeekEnd),
      getSchedulesByRange(chartStartStr, chartEndStr),
      getRecentSchedules(30),
    ]);

  const thisWeekAvg = calculateMealAverages(thisWeekSchedules);
  const lastWeekAvg = calculateMealAverages(lastWeekSchedules);

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

      <MealsStatsCards
        thisWeek={thisWeekAvg}
        lastWeek={lastWeekAvg}
        thisWeekLabel={thisWeek.label}
        lastWeekLabel={lastWeek.label}
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
