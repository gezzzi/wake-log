import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { insertLog, checkDuplicateDay } from "@/lib/queries";

export async function POST(request: NextRequest) {
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

  // Normalize date to ISO 8601 with JST offset
  // Handles formats like "2026/03/31 22:11" from iPhone Shortcuts
  let normalized: string;
  const hasTimezone = /[+-]\d{2}:\d{2}$/.test(woke_up_at) || woke_up_at.endsWith("Z");

  if (hasTimezone) {
    // Already has timezone info, validate and use as-is
    const parsed = new Date(woke_up_at);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "woke_up_at is not a valid date" },
        { status: 400 }
      );
    }
    normalized = woke_up_at;
  } else {
    // No timezone info — treat as JST, just format and append +09:00
    const cleaned = woke_up_at.replace(/\//g, "-");
    // Extract date/time parts with regex
    const match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) {
      return NextResponse.json(
        { error: "woke_up_at is not a valid date" },
        { status: 400 }
      );
    }
    const [, y, mo, d, h, mi, s = "00"] = match;
    normalized = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi}:${s.padStart(2, "0")}+09:00`;
  }

  const isDuplicate = await checkDuplicateDay(normalized);
  if (isDuplicate) {
    return NextResponse.json(
      { error: "A wake log already exists for this day" },
      { status: 409 }
    );
  }

  const log = await insertLog(normalized);
  revalidatePath("/");
  revalidatePath("/wake");
  revalidatePath("/calendar");
  revalidatePath("/chart");
  return NextResponse.json(log, { status: 201 });
}
