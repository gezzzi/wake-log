export const dynamic = "force-dynamic";

import { Heart } from "lucide-react";
import { getLatestBP, getRecentBP } from "@/lib/blood-pressure-queries";
import { BPHistory } from "../_components/bp-history";
import { BPChart } from "../_components/bp-chart";

export default async function BloodPressurePage() {
  const [latest, logs] = await Promise.all([getLatestBP(), getRecentBP(20)]);

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

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted uppercase tracking-wider">
            最新の測定
          </span>
        </div>
        {latest ? (
          <>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-light tracking-tighter">
                {latest.systolic}
                <span className="text-3xl text-gray-300 dark:text-gray-600 mx-1">
                  /
                </span>
                {latest.diastolic}
              </span>
              <span className="text-muted-light font-medium">mmHg</span>
            </div>
            <div className="text-sm text-muted-light mt-2">
              脈拍: {latest.pulse} bpm
            </div>
          </>
        ) : (
          <p className="text-muted-light">データなし</p>
        )}
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
