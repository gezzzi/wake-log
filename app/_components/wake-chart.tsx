"use client";

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
  if (logs.length === 0) {
    return (
      <p className="text-foreground/40 text-center py-16">記録がありません</p>
    );
  }

  const data = logs.map((log) => ({
    date: formatShortDateJST(log.woke_up_at),
    minutes: getMinutesSinceMidnightJST(log.woke_up_at),
  }));

  const allMinutes = data.map((d) => d.minutes);
  const minTime = Math.floor(Math.min(...allMinutes) / 30) * 30;
  const maxTime = Math.ceil(Math.max(...allMinutes) / 30) * 30;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[minTime, maxTime]}
            reversed
            tickFormatter={(v: number) => minutesToTimeString(v)}
            tick={{ fontSize: 12 }}
            width={50}
          />
          <Tooltip
            formatter={(value) => [
              minutesToTimeString(value as number),
              "起床時刻",
            ]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <ReferenceLine
            y={7 * 60}
            stroke="#10b981"
            strokeDasharray="4 4"
            label={{ value: "7:00", position: "right", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
