import { type NextRequest, NextResponse } from "next/server";
import { insertLog, checkDuplicateDay } from "@/lib/queries";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      { error: "woke_up_at is not a valid ISO 8601 date" },
      { status: 400 }
    );
  }

  const isDuplicate = await checkDuplicateDay(woke_up_at);
  if (isDuplicate) {
    return NextResponse.json(
      { error: "A wake log already exists for this day" },
      { status: 409 }
    );
  }

  const log = await insertLog(woke_up_at);
  return NextResponse.json(log, { status: 201 });
}
