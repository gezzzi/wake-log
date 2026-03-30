export const dynamic = "force-dynamic";

import { getLogsForDays } from "@/lib/queries";
import { WakeChart } from "../_components/wake-chart";

export default async function ChartPage() {
  const logs = await getLogsForDays(30);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">起床時刻グラフ</h1>
      <p className="text-sm text-foreground/50">直近30日間の起床時刻推移</p>
      <WakeChart logs={logs} />
    </div>
  );
}
