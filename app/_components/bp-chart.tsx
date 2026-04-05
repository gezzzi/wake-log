"use client";

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
import type { BPLog } from "@/lib/blood-pressure-queries";
import { formatShortDateJST } from "@/lib/utils";

export function BPChart({ logs }: { logs: BPLog[] }) {
  if (logs.length === 0) {
    return <p className="text-muted text-center py-16">記録がありません</p>;
  }

  const data = [...logs].reverse().map((log) => ({
    date: formatShortDateJST(log.measured_at),
    systolic: log.systolic,
    diastolic: log.diastolic,
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
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Inter",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }}
            />
            <Line
              type="monotone"
              dataKey="systolic"
              name="最高"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              name="最低"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
