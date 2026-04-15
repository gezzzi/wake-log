import { type NextRequest, NextResponse } from "next/server";
import { updateExercise, deleteExercise, SQUAT_TAGS } from "@/lib/exercise-queries";
import { normalizeDateToJST } from "@/lib/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const normalized = normalizeDateToJST(done_at);
  if (!normalized) {
    return NextResponse.json(
      { error: "Invalid date format" },
      { status: 400 }
    );
  }

  let finalTag: string | null = null;
  if (type === "squat" && tag) {
    if (!SQUAT_TAGS.includes(tag as (typeof SQUAT_TAGS)[number])) {
      return NextResponse.json(
        { error: `tag must be one of: ${SQUAT_TAGS.join(", ")}` },
        { status: 400 }
      );
    }
    finalTag = tag;
  }

  const log = await updateExercise(Number(id), type, normalized, finalTag);
  return NextResponse.json(log);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteExercise(Number(id));
  return NextResponse.json({ ok: true });
}
