import { Sun, Moon } from "lucide-react";

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
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors">
        <div className="flex items-center space-x-2 text-muted mb-4">
          <Sun size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">今週の平均</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-light tracking-tighter">
            {avgThisWeek ?? "---"}
          </span>
        </div>
        <div className="text-xs text-muted-light mt-2">{thisWeekLabel}</div>
      </div>
      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors">
        <div className="flex items-center space-x-2 text-muted mb-4">
          <Moon size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">先週の平均</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-light tracking-tighter">
            {avgLastWeek ?? "---"}
          </span>
        </div>
        <div className="text-xs text-muted-light mt-2">{lastWeekLabel}</div>
      </div>
    </div>
  );
}
