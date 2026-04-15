"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { WakeLog } from "@/lib/queries";
import {
  formatShortDateJST,
  getMinutesSinceMidnightJST,
  minutesToTimeString,
} from "@/lib/utils";

export function WakeChart({ logs }: { logs: WakeLog[] }) {
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

  if (logs.length === 0) {
    return (
      <p className="text-muted text-center py-16">記録がありません</p>
    );
  }

  const data = logs.map((log) => ({
    date: formatShortDateJST(log.woke_up_at),
    minutes: getMinutesSinceMidnightJST(log.woke_up_at),
  }));

  const allMinutes = data.map((d) => d.minutes);
  const minTime = Math.floor(Math.min(...allMinutes) / 30) * 30;
  const maxTime = Math.ceil(Math.max(...allMinutes) / 30) * 30;

  const lineColor = isDark ? "#a5b4fc" : "#6366f1";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#9ca3af";
  const tooltipBg = isDark ? "#1e1e1e" : "#ffffff";
  const tooltipColor = isDark ? "#f3f4f6" : "#171717";

  return (
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-colors">
      <div className="w-full h-[350px]">
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
              domain={[minTime, maxTime]}
              tickFormatter={(v: number) => minutesToTimeString(v)}
              tick={{ fontSize: 12, fontFamily: "Inter", fill: axisColor }}
              width={50}
              stroke={axisColor}
            />
            <Tooltip
              formatter={(value) => [
                minutesToTimeString(value as number),
                "起床時刻",
              ]}
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
            <ReferenceLine
              y={7 * 60}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: "7:00",
                position: "right",
                fontSize: 11,
                fill: axisColor,
              }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, fill: lineColor }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
