import { type NextRequest, NextResponse } from "next/server";
import { insertBP } from "@/lib/blood-pressure-queries";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  if (!systolic || !diastolic || !pulse) {
    return NextResponse.json(
      { error: "systolic, diastolic, pulse are required" },
      { status: 400 }
    );
  }

  // Use provided timestamp or current time in JST
  const now = new Date();
  const measuredAt =
    measured_at || now.toISOString().replace("Z", "+09:00").replace(".000", "");

  const log = await insertBP(systolic, diastolic, pulse, measuredAt);
  return NextResponse.json(log, { status: 201 });
}
