import { type NextRequest, NextResponse } from "next/server";
import { updateExercise, deleteExercise } from "@/lib/exercise-queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { type?: string; started_at?: string; ended_at?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, started_at, ended_at } = body;
  if (!type || !started_at || !ended_at) {
    return NextResponse.json(
      { error: "type, started_at, ended_at are required" },
      { status: 400 }
    );
  }

  const log = await updateExercise(Number(id), type, started_at, ended_at);
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
