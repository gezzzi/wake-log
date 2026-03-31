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

  // Normalize date to ISO 8601 with JST offset
  // Handles formats like "2026/03/31 22:11" from iPhone Shortcuts
  let normalized: string;
  const parsed = new Date(woke_up_at);
  if (isNaN(parsed.getTime())) {
    // Try replacing slashes for formats like "2026/03/31 22:11"
    const retried = new Date(woke_up_at.replace(/\//g, "-"));
    if (isNaN(retried.getTime())) {
      return NextResponse.json(
        { error: "woke_up_at is not a valid date" },
        { status: 400 }
      );
    }
    normalized = retried.toISOString();
  } else {
    normalized = parsed.toISOString();
  }

  // If no timezone info in original string, assume JST
  if (!/[+-]\d{2}:\d{2}$/.test(woke_up_at) && !woke_up_at.endsWith("Z")) {
    // Re-parse as JST: subtract 9 hours from the naive datetime to get UTC
    const naive = new Date(woke_up_at.replace(/\//g, "-"));
    const jstDate = new Date(naive.getTime() - 9 * 60 * 60 * 1000);
    normalized = jstDate.toISOString().replace("Z", "+09:00").replace(".000", "");
  }

  const isDuplicate = await checkDuplicateDay(normalized);
  if (isDuplicate) {
    return NextResponse.json(
      { error: "A wake log already exists for this day" },
      { status: 409 }
    );
  }

  const log = await insertLog(normalized);
  return NextResponse.json(log, { status: 201 });
}
