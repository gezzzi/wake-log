"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-lg font-light tracking-tight min-w-[120px] text-center">
        {year}年{month}月
      </span>
      <button
        onClick={() => navigate(1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
