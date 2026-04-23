import { type NextRequest, NextResponse } from "next/server";
import { updateBP, deleteBP } from "@/lib/blood-pressure-queries";
import { BP_TIME_TAGS, BP_SITUATION_TAGS } from "@/lib/bp-tags";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: {
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    measured_at?: string;
    time_tag?: string | null;
    situation_tag?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { systolic, diastolic, pulse, measured_at, time_tag, situation_tag } = body;
  if (!systolic || !diastolic || !pulse || !measured_at) {
    return NextResponse.json(
      { error: "systolic, diastolic, pulse, measured_at are required" },
      { status: 400 }
    );
  }

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

  const log = await updateBP(
    Number(id),
    systolic,
    diastolic,
    pulse,
    measured_at,
    finalTimeTag,
    finalSituationTag
  );
  return NextResponse.json(log);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteBP(Number(id));
  return NextResponse.json({ ok: true });
}
