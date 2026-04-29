"use server";

import { revalidatePath } from "next/cache";
import {
  upsertSchedule,
  deleteSchedule,
  updateMealTime,
} from "@/lib/schedule-queries";

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
  revalidatePath("/");
  revalidatePath("/meals");
  revalidatePath("/wake");
  return { ok: true };
}

export async function deleteScheduleAction(id: number): Promise<ActionResult> {
  await deleteSchedule(id);
  revalidatePath("/");
  revalidatePath("/meals");
  revalidatePath("/wake");
  return { ok: true };
}

export async function saveMealTime(input: {
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  time: string;
}): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { ok: false, error: "Invalid date format" };
  }
  if (!/^\d{2}:\d{2}$/.test(input.time)) {
    return { ok: false, error: "Invalid time format" };
  }
  if (!["breakfast", "lunch", "dinner"].includes(input.meal_type)) {
    return { ok: false, error: "Invalid meal type" };
  }
  await updateMealTime(input.date, input.meal_type, input.time);
  revalidatePath("/");
  revalidatePath("/meals");
  revalidatePath("/wake");
  return { ok: true };
}
