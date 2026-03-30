export function StatsCards({
  avg7,
  avg30,
}: {
  avg7: string | null;
  avg30: string | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-foreground/10 p-5">
        <p className="text-sm text-foreground/50">直近7日の平均</p>
        <p className="text-3xl font-bold mt-1 font-mono">
          {avg7 ?? "---"}
        </p>
      </div>
      <div className="rounded-xl border border-foreground/10 p-5">
        <p className="text-sm text-foreground/50">直近30日の平均</p>
        <p className="text-3xl font-bold mt-1 font-mono">
          {avg30 ?? "---"}
        </p>
      </div>
    </div>
  );
}
