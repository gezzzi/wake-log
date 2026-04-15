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
} from "recharts";

export type WeeklyCountPoint = {
  week: string;
  count: number;
};

export function ExerciseChart({ data }: { data: WeeklyCountPoint[] }) {
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

  if (data.length === 0) {
    return <p className="text-muted text-center py-16">記録がありません</p>;
  }

  const lineColor = isDark ? "#a5b4fc" : "#6366f1";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = "#9ca3af";
  const tooltipBg = isDark ? "#1e1e1e" : "#ffffff";
  const tooltipColor = isDark ? "#f3f4f6" : "#171717";

  return (
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
      <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
        週ごとの回数
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fontFamily: "Inter", fill: axisColor }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke={axisColor}
            />
            <YAxis
              tick={{ fontSize: 12, fontFamily: "Inter", fill: axisColor }}
              width={40}
              stroke={axisColor}
              allowDecimals={false}
              tickFormatter={(v: number) => `${v}回`}
            />
            <Tooltip
              formatter={(value) => [`${value}回`, "回数"]}
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
            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 3, fill: lineColor }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
