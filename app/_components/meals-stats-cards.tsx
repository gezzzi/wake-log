import { Sun, Moon } from "lucide-react";

type MealAverages = {
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
};

function StatCard({
  icon,
  title,
  averages,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  averages: MealAverages;
  label: string;
}) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors">
      <div className="flex items-center space-x-2 text-muted mb-4">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {averages.breakfast ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">朝</div>
        </div>
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {averages.lunch ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">昼</div>
        </div>
        <div>
          <div className="text-3xl font-light tracking-tighter">
            {averages.dinner ?? "—"}
          </div>
          <div className="text-muted-light text-sm font-medium mt-1">夜</div>
        </div>
      </div>
      <div className="text-xs text-muted-light mt-3">{label}</div>
    </div>
  );
}

export function MealsStatsCards({
  thisWeek,
  lastWeek,
  thisWeekLabel,
  lastWeekLabel,
}: {
  thisWeek: MealAverages;
  lastWeek: MealAverages;
  thisWeekLabel: string;
  lastWeekLabel: string;
}) {
  return (
    <div className="space-y-4">
      <StatCard
        icon={<Sun size={18} />}
        title="今週の平均"
        averages={thisWeek}
        label={thisWeekLabel}
      />
      <StatCard
        icon={<Moon size={18} />}
        title="先週の平均"
        averages={lastWeek}
        label={lastWeekLabel}
      />
    </div>
  );
}
