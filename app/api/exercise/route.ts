import { type NextRequest, NextResponse } from "next/server";
import { insertExercise } from "@/lib/exercise-queries";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  if (!["run", "walk", "squat"].includes(type)) {
    return NextResponse.json(
      { error: "type must be run, walk, or squat" },
      { status: 400 }
    );
  }

  const log = await insertExercise(type, started_at, ended_at);
  return NextResponse.json(log, { status: 201 });
}
