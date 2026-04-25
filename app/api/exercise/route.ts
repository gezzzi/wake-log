import { type NextRequest, NextResponse } from "next/server";
import { insertExercise } from "@/lib/exercise-queries";
import { SQUAT_TAGS, CARDIO_TIME_TAGS } from "@/lib/exercise-tags";
import { normalizeDateToJST } from "@/lib/utils";

export async function POST(request: NextRequest) {
  let body: { type?: string; done_at?: string; tag?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, done_at, tag } = body;
  if (!type || !done_at) {
    return NextResponse.json(
      { error: "type and done_at are required" },
      { status: 400 }
    );
  }

  if (!["run", "walk", "squat"].includes(type)) {
    return NextResponse.json(
      { error: "type must be run, walk, or squat" },
      { status: 400 }
    );
  }

  const normalized = normalizeDateToJST(done_at);
  if (!normalized) {
    return NextResponse.json(
      { error: "Invalid date format" },
      { status: 400 }
    );
  }

  // Validate tag based on type
  let finalTag: string | null = null;
  if (tag) {
    if (type === "squat") {
      if (!SQUAT_TAGS.includes(tag as (typeof SQUAT_TAGS)[number])) {
        return NextResponse.json(
          { error: `tag must be one of: ${SQUAT_TAGS.join(", ")}` },
          { status: 400 }
        );
      }
      finalTag = tag;
    } else if (type === "run" || type === "walk") {
      if (!CARDIO_TIME_TAGS.includes(tag as (typeof CARDIO_TIME_TAGS)[number])) {
        return NextResponse.json(
          { error: `tag must be one of: ${CARDIO_TIME_TAGS.join(", ")}` },
          { status: 400 }
        );
      }
      finalTag = tag;
    }
  }

  const log = await insertExercise(type, normalized, finalTag);
  return NextResponse.json(log, { status: 201 });
}
