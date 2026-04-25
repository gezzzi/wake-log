export const revalidate = 60;

import { Activity } from "lucide-react";
import { getRunWalkByRange } from "@/lib/exercise-queries";
import { getWeekBoundsJST } from "@/lib/utils";
import { CardioContent } from "../_components/cardio-content";

export default async function CardioPage() {
  const thisWeek = getWeekBoundsJST(0);
  const twelveWeeksAgo = getWeekBoundsJST(-11);

  // Single query: get all run/walk logs for past 12 weeks
  const allLogs = await getRunWalkByRange(twelveWeeksAgo.start, thisWeek.end);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            有酸素運動
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <CardioContent allLogs={allLogs} />
    </div>
  );
}
