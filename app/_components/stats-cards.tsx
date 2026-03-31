export function StatsCards({
  avgThisWeek,
  avgLastWeek,
  thisWeekLabel,
  lastWeekLabel,
}: {
  avgThisWeek: string | null;
  avgLastWeek: string | null;
  thisWeekLabel: string;
  lastWeekLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-foreground/10 p-5">
        <p className="text-sm text-foreground/50">今週の平均</p>
        <p className="text-3xl font-bold mt-1 font-mono">
          {avgThisWeek ?? "---"}
        </p>
        <p className="text-xs text-foreground/30 mt-1">{thisWeekLabel}</p>
      </div>
      <div className="rounded-xl border border-foreground/10 p-5">
        <p className="text-sm text-foreground/50">先週の平均</p>
        <p className="text-3xl font-bold mt-1 font-mono">
          {avgLastWeek ?? "---"}
        </p>
        <p className="text-xs text-foreground/30 mt-1">{lastWeekLabel}</p>
      </div>
    </div>
  );
}
