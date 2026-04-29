"use server";

import { revalidatePath } from "next/cache";
import { upsertSchedule } from "@/lib/schedule-queries";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveSchedule(input: {
  date: string;
  breakfast_at: string | null;
  lunch_at: string | null;
  dinner_at: string | null;
}): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { ok: false, error: "Invalid date format" };
  }
  const validateTime = (t: string | null) => {
    if (!t) return true;
    return /^\d{2}:\d{2}$/.test(t);
  };
  if (
    !validateTime(input.breakfast_at) ||
    !validateTime(input.lunch_at) ||
    !validateTime(input.dinner_at)
  ) {
    return { ok: false, error: "Invalid time format" };
  }

  await upsertSchedule(
    input.date,
    input.breakfast_at,
    input.lunch_at,
    input.dinner_at
  );
  revalidatePath("/schedule");
  revalidatePath("/wake");
  return { ok: true };
}
