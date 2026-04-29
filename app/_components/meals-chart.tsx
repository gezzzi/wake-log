"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { DailySchedule } from "@/lib/schedule-queries";

function timeToMinutes(time: string | null): number | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatShortDate(dateStr: string): string {
  // dateStr: YYYY-MM-DD
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function MealsChart({ schedules }: { schedules: DailySchedule[] }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (schedules.length === 0) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <p className="text-muted text-center py-12">記録がありません</p>
      </div>
    );
  }

  const data = schedules.map((s) => ({
    date: formatShortDate(s.date),
    breakfast: timeToMinutes(s.breakfast_at),
    lunch: timeToMinutes(s.lunch_at),
    dinner: timeToMinutes(s.dinner_at),
  }));

  const breakfastColor = isDark ? "#fbbf24" : "#d97706";
  const lunchColor = isDark ? "#7dd3fc" : "#0284c7";
  const dinnerColor = isDark ? "#a5b4fc" : "#4f46e5";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = "#9ca3af";
  const tooltipBg = isDark ? "#1e1e1e" : "#ffffff";
  const tooltipColor = isDark ? "#f3f4f6" : "#171717";

  return (
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
      <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
        推移
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "Inter", fill: axisColor }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke={axisColor}
            />
            <YAxis
              domain={[5 * 60, 23 * 60]}
              ticks={[6 * 60, 9 * 60, 12 * 60, 15 * 60, 18 * 60, 21 * 60]}
              tickFormatter={(v: number) => minutesToTime(v)}
              tick={{ fontSize: 11, fontFamily: "Inter", fill: axisColor }}
              width={50}
              stroke={axisColor}
            />
            <Tooltip
              formatter={(value, name) => {
                if (value === null || value === undefined) return ["—", name];
                return [minutesToTime(value as number), name];
              }}
              labelStyle={{ fontWeight: 500, color: tooltipColor }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Inter",
                background: tooltipBg,
                color: tooltipColor,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }}
            />
            <Line
              type="monotone"
              dataKey="breakfast"
              name="朝"
              stroke={breakfastColor}
              strokeWidth={2}
              dot={{ r: 3, fill: breakfastColor }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="lunch"
              name="昼"
              stroke={lunchColor}
              strokeWidth={2}
              dot={{ r: 3, fill: lunchColor }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="dinner"
              name="夜"
              stroke={dinnerColor}
              strokeWidth={2}
              dot={{ r: 3, fill: dinnerColor }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
