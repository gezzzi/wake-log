"use server";

import { revalidatePath } from "next/cache";
import { insertLog, updateLog, deleteLog, checkDuplicateDay } from "@/lib/queries";
import { normalizeDateToJST } from "@/lib/utils";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createWakeLog(wokeUpAt: string): Promise<ActionResult> {
  const normalized = normalizeDateToJST(wokeUpAt);
  if (!normalized) return { ok: false, error: "Invalid date format" };

  const isDuplicate = await checkDuplicateDay(normalized);
  if (isDuplicate) return { ok: false, error: "この日の起床記録は既にあります" };

  await insertLog(normalized);
  revalidatePath("/");
  revalidatePath("/wake");
  revalidatePath("/calendar");
  revalidatePath("/chart");
  return { ok: true };
}

export async function updateWakeLog(
  id: number,
  wokeUpAt: string
): Promise<ActionResult> {
  const normalized = normalizeDateToJST(wokeUpAt);
  if (!normalized) return { ok: false, error: "Invalid date format" };

  await updateLog(id, normalized);
  revalidatePath("/");
  revalidatePath("/wake");
  revalidatePath("/calendar");
  revalidatePath("/chart");
  return { ok: true };
}

export async function deleteWakeLog(id: number): Promise<ActionResult> {
  await deleteLog(id);
  revalidatePath("/");
  revalidatePath("/wake");
  revalidatePath("/calendar");
  revalidatePath("/chart");
  return { ok: true };
}
