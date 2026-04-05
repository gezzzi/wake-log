"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ExerciseLog } from "@/lib/exercise-queries";
import { formatShortDateJST } from "@/lib/utils";

function calcDurationMinutes(start: string, end: string): number {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000
  );
}

export function ExerciseChart({ logs }: { logs: ExerciseLog[] }) {
  if (logs.length === 0) {
    return <p className="text-muted text-center py-16">記録がありません</p>;
  }

  const data = [...logs].reverse().map((log) => ({
    date: formatShortDateJST(log.started_at),
    minutes: calcDurationMinutes(log.started_at, log.ended_at),
  }));

  return (
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
      <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
        推移
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "Inter" }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 12, fontFamily: "Inter" }}
              width={40}
              stroke="#9ca3af"
              tickFormatter={(v: number) => `${v}分`}
            />
            <Tooltip
              formatter={(value) => [`${value}分`, "所要時間"]}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Inter",
              }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#171717"
              strokeWidth={2}
              dot={{ r: 3, fill: "#171717" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
