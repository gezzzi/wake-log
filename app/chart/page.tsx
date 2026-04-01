export const dynamic = "force-dynamic";

import { getLogsForDays } from "@/lib/queries";
import { WakeChart } from "../_components/wake-chart";

export default async function ChartPage() {
  const logs = await getLogsForDays(30);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-light tracking-tight">起床時刻</h1>
        <p className="text-muted text-sm mt-1">直近30日間の推移</p>
      </header>
      <WakeChart logs={logs} />
    </div>
  );
}
