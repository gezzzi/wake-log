"use server";

import { revalidatePath } from "next/cache";
import { insertExercise, updateExercise, deleteExercise } from "@/lib/exercise-queries";
import { SQUAT_TAGS, CARDIO_TIME_TAGS } from "@/lib/exercise-tags";
import { normalizeDateToJST } from "@/lib/utils";

export type ActionResult = { ok: true } | { ok: false; error: string };

type ExerciseInput = {
  type: "run" | "walk" | "squat";
  done_at: string;
  tag?: string | null;
};

function validateTag(input: ExerciseInput): string | null {
  if (!input.tag) return null;
  if (input.type === "squat") {
    if (!SQUAT_TAGS.includes(input.tag as (typeof SQUAT_TAGS)[number])) {
      return `tag must be one of: ${SQUAT_TAGS.join(", ")}`;
    }
  } else {
    if (
      !CARDIO_TIME_TAGS.includes(
        input.tag as (typeof CARDIO_TIME_TAGS)[number]
      )
    ) {
      return `tag must be one of: ${CARDIO_TIME_TAGS.join(", ")}`;
    }
  }
  return null;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/cardio");
  revalidatePath("/squat");
}

export async function createExerciseAction(
  input: ExerciseInput
): Promise<ActionResult> {
  const tagErr = validateTag(input);
  if (tagErr) return { ok: false, error: tagErr };

  const normalized = normalizeDateToJST(input.done_at);
  if (!normalized) return { ok: false, error: "Invalid date format" };

  await insertExercise(input.type, normalized, input.tag ?? null);
  revalidateAll();
  return { ok: true };
}

export async function updateExerciseAction(
  id: number,
  input: ExerciseInput
): Promise<ActionResult> {
  const tagErr = validateTag(input);
  if (tagErr) return { ok: false, error: tagErr };

  const normalized = normalizeDateToJST(input.done_at);
  if (!normalized) return { ok: false, error: "Invalid date format" };

  await updateExercise(id, input.type, normalized, input.tag ?? null);
  revalidateAll();
  return { ok: true };
}

export async function deleteExerciseAction(id: number): Promise<ActionResult> {
  await deleteExercise(id);
  revalidateAll();
  return { ok: true };
}
