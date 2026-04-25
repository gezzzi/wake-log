export const SQUAT_TAGS = [
  "歯磨き",
  "午前",
  "午後",
  "寝る前",
  "その他",
] as const;

export const CARDIO_TIME_TAGS = ["寝起き", "午前", "午後"] as const;

export type SquatTag = (typeof SQUAT_TAGS)[number];
export type CardioTimeTag = (typeof CARDIO_TIME_TAGS)[number];
