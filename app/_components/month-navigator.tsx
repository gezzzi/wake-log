"use client";

import { useRouter } from "next/navigation";

export function MonthNavigator({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const router = useRouter();

  function navigate(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    router.push(`/calendar?year=${newYear}&month=${newMonth}`);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors"
      >
        ←
      </button>
      <span className="text-lg font-semibold min-w-[120px] text-center">
        {year}年{month}月
      </span>
      <button
        onClick={() => navigate(1)}
        className="px-3 py-1 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors"
      >
        →
      </button>
    </div>
  );
}
