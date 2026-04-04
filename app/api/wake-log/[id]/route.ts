import { type NextRequest, NextResponse } from "next/server";
import { updateLog, deleteLog } from "@/lib/queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { woke_up_at?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { woke_up_at } = body;
  if (!woke_up_at) {
    return NextResponse.json(
      { error: "woke_up_at is required" },
      { status: 400 }
    );
  }

  const parsed = new Date(woke_up_at);
  if (isNaN(parsed.getTime())) {
    return NextResponse.json(
      { error: "woke_up_at is not a valid date" },
      { status: 400 }
    );
  }

  try {
    const log = await updateLog(Number(id), woke_up_at);
    return NextResponse.json(log);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteLog(Number(id));
  return NextResponse.json({ ok: true });
}
