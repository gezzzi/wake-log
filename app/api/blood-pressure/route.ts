import { type NextRequest, NextResponse } from "next/server";
import { insertBP } from "@/lib/blood-pressure-queries";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    measured_at?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { systolic, diastolic, pulse, measured_at } = body;
  if (!systolic || !diastolic || !pulse) {
    return NextResponse.json(
      { error: "systolic, diastolic, pulse are required" },
      { status: 400 }
    );
  }

  // Use provided timestamp or current time in JST
  let measuredAt = measured_at;
  if (!measuredAt) {
    const now = new Date();
    const jst = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const p = (type: string) => jst.find((p) => p.type === type)!.value;
    measuredAt = `${p("year")}-${p("month")}-${p("day")}T${p("hour")}:${p("minute")}:${p("second")}+09:00`;
  }

  const log = await insertBP(systolic, diastolic, pulse, measuredAt);
  return NextResponse.json(log, { status: 201 });
}
