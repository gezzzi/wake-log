import { Sun, Moon } from "lucide-react";

type Range = {
  earliest: string;
  earliestDate: string;
  latest: string;
  latestDate: string;
  diffMinutes: number;
} | null;

function formatDiff(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

function diffColorClass(minutes: number): string {
  if (minutes <= 60) return "text-emerald-600 dark:text-emerald-400";
  if (minutes <= 120) return "text-yellow-600 dark:text-yellow-400";
  if (minutes <= 180) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function diffBgClass(minutes: number): string {
  if (minutes <= 60) return "bg-emerald-50 dark:bg-emerald-900/30";
  if (minutes <= 120) return "bg-yellow-50 dark:bg-yellow-900/30";
  if (minutes <= 180) return "bg-orange-50 dark:bg-orange-900/30";
  return "bg-red-50 dark:bg-red-900/30";
}

function RangeDisplay({ range }: { range: Range }) {
  if (!range) return null;
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-light">{range.earliestDate}</span>
        <span className="font-mono">{range.earliest}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-light">{range.latestDate}</span>
        <span className="font-mono">{range.latest}</span>
      </div>
      <div className="flex justify-end pt-1">
        <span
          className={`text-sm font-medium px-2.5 py-1 rounded-full ${diffColorClass(range.diffMinutes)} ${diffBgClass(range.diffMinutes)}`}
        >
          差 {formatDiff(range.diffMinutes)}
        </span>
      </div>
    </div>
  );
}

export function StatsCards({
  avgThisWeek,
  avgLastWeek,
  thisWeekLabel,
  lastWeekLabel,
  rangeThisWeek,
  rangeLastWeek,
}: {
  avgThisWeek: string | null;
  avgLastWeek: string | null;
  thisWeekLabel: string;
  lastWeekLabel: string;
  rangeThisWeek?: Range;
  rangeLastWeek?: Range;
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
        <RangeDisplay range={rangeThisWeek ?? null} />
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
        <RangeDisplay range={rangeLastWeek ?? null} />
      </div>
    </div>
  );
}
