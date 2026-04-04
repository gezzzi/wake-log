import { type NextRequest, NextResponse } from "next/server";
import { updateBP, deleteBP } from "@/lib/blood-pressure-queries";

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
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { systolic, diastolic, pulse, measured_at } = body;
  if (!systolic || !diastolic || !pulse || !measured_at) {
    return NextResponse.json(
      { error: "systolic, diastolic, pulse, measured_at are required" },
      { status: 400 }
    );
  }

  const log = await updateBP(Number(id), systolic, diastolic, pulse, measured_at);
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
