"use server";

import { revalidatePath } from "next/cache";
import { insertBP, updateBP, deleteBP } from "@/lib/blood-pressure-queries";
import { BP_TIME_TAGS, BP_SITUATION_TAGS } from "@/lib/bp-tags";

export type ActionResult = { ok: true } | { ok: false; error: string };

type BPInput = {
  systolic: number;
  diastolic: number;
  pulse: number;
  measured_at: string;
  time_tag?: string | null;
  situation_tag?: string | null;
};

function validateTags(input: BPInput): string | null {
  if (input.time_tag) {
    if (!BP_TIME_TAGS.includes(input.time_tag as (typeof BP_TIME_TAGS)[number])) {
      return `time_tag must be one of: ${BP_TIME_TAGS.join(", ")}`;
    }
  }
  if (input.situation_tag) {
    if (
      !BP_SITUATION_TAGS.includes(
        input.situation_tag as (typeof BP_SITUATION_TAGS)[number]
      )
    ) {
      return `situation_tag must be one of: ${BP_SITUATION_TAGS.join(", ")}`;
    }
  }
  return null;
}

export async function createBP(input: BPInput): Promise<ActionResult> {
  const err = validateTags(input);
  if (err) return { ok: false, error: err };

  await insertBP(
    input.systolic,
    input.diastolic,
    input.pulse,
    input.measured_at,
    input.time_tag ?? null,
    input.situation_tag ?? null
  );
  revalidatePath("/");
  revalidatePath("/blood-pressure");
  return { ok: true };
}

export async function updateBPAction(
  id: number,
  input: BPInput
): Promise<ActionResult> {
  const err = validateTags(input);
  if (err) return { ok: false, error: err };

  await updateBP(
    id,
    input.systolic,
    input.diastolic,
    input.pulse,
    input.measured_at,
    input.time_tag ?? null,
    input.situation_tag ?? null
  );
  revalidatePath("/");
  revalidatePath("/blood-pressure");
  return { ok: true };
}

export async function deleteBPAction(id: number): Promise<ActionResult> {
  await deleteBP(id);
  revalidatePath("/");
  revalidatePath("/blood-pressure");
  return { ok: true };
}
