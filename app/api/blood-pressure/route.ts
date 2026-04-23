import { type NextRequest, NextResponse } from "next/server";
import { insertBP } from "@/lib/blood-pressure-queries";
import { BP_TIME_TAGS, BP_SITUATION_TAGS } from "@/lib/bp-tags";

export async function POST(request: NextRequest) {
  let body: {
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    measured_at?: string;
    time_tag?: string;
    situation_tag?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { systolic, diastolic, pulse, measured_at, time_tag, situation_tag } = body;
  if (!systolic || !diastolic || !pulse) {
    return NextResponse.json(
      { error: "systolic, diastolic, pulse are required" },
      { status: 400 }
    );
  }

  // Validate tags
  let finalTimeTag: string | null = null;
  if (time_tag) {
    if (!BP_TIME_TAGS.includes(time_tag as (typeof BP_TIME_TAGS)[number])) {
      return NextResponse.json(
        { error: `time_tag must be one of: ${BP_TIME_TAGS.join(", ")}` },
        { status: 400 }
      );
    }
    finalTimeTag = time_tag;
  }
  let finalSituationTag: string | null = null;
  if (situation_tag) {
    if (!BP_SITUATION_TAGS.includes(situation_tag as (typeof BP_SITUATION_TAGS)[number])) {
      return NextResponse.json(
        { error: `situation_tag must be one of: ${BP_SITUATION_TAGS.join(", ")}` },
        { status: 400 }
      );
    }
    finalSituationTag = situation_tag;
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

  const log = await insertBP(
    systolic,
    diastolic,
    pulse,
    measuredAt,
    finalTimeTag,
    finalSituationTag
  );
  return NextResponse.json(log, { status: 201 });
}
