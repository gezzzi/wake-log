export const BP_TIME_TAGS = [
  "寝起き",
  "午前",
  "午後",
  "寝る前",
] as const;

export const BP_SITUATION_TAGS = [
  "食後",
  "運動後",
  "入浴後",
  "ゲーム後",
  "寝不足",
  "平常時",
] as const;

export type BPTimeTag = (typeof BP_TIME_TAGS)[number];
export type BPSituationTag = (typeof BP_SITUATION_TAGS)[number];
