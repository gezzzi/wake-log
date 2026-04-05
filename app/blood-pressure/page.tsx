export const dynamic = "force-dynamic";

import { Heart } from "lucide-react";
import {
  getRecentBP,
  getBPByRange,
  calculateAverageBP,
} from "@/lib/blood-pressure-queries";
import { getWeekBoundsJST } from "@/lib/utils";
import { BPHistory } from "../_components/bp-history";
import { BPChart } from "../_components/bp-chart";

export default async function BloodPressurePage() {
  const thisWeek = getWeekBoundsJST(0);
  const lastWeek = getWeekBoundsJST(-1);

  const [logs, thisWeekLogs, lastWeekLogs] = await Promise.all([
    getRecentBP(20),
    getBPByRange(thisWeek.start, thisWeek.end),
    getBPByRange(lastWeek.start, lastWeek.end),
  ]);

  const avgThisWeek = calculateAverageBP(thisWeekLogs);
  const avgLastWeek = calculateAverageBP(lastWeekLogs);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Heart size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">
            血圧
          </span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            今週の平均
          </div>
          {avgThisWeek ? (
            <>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-light tracking-tighter">
                  {avgThisWeek.systolic}
                  <span className="text-3xl text-gray-300 dark:text-gray-600 mx-1">/</span>
                  {avgThisWeek.diastolic}
                </span>
                <span className="text-muted-light font-medium">mmHg</span>
              </div>
              <div className="text-sm text-muted-light mt-2">
                脈拍: {avgThisWeek.pulse} bpm
              </div>
            </>
          ) : (
            <div className="text-3xl font-light tracking-tighter text-muted-light">---</div>
          )}
          <div className="text-xs text-muted-light mt-2">{thisWeek.label}</div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
          <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
            先週の平均
          </div>
          {avgLastWeek ? (
            <>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-light tracking-tighter">
                  {avgLastWeek.systolic}
                  <span className="text-3xl text-gray-300 dark:text-gray-600 mx-1">/</span>
                  {avgLastWeek.diastolic}
                </span>
                <span className="text-muted-light font-medium">mmHg</span>
              </div>
              <div className="text-sm text-muted-light mt-2">
                脈拍: {avgLastWeek.pulse} bpm
              </div>
            </>
          ) : (
            <div className="text-3xl font-light tracking-tighter text-muted-light">---</div>
          )}
          <div className="text-xs text-muted-light mt-2">{lastWeek.label}</div>
        </div>
      </div>

      <BPChart logs={logs} />

      <div>
        <div className="flex items-center space-x-2 text-muted mb-3 px-1">
          <span className="text-sm font-medium uppercase tracking-wider">
            履歴
          </span>
        </div>
        <BPHistory logs={logs} />
      </div>
    </div>
  );
}
