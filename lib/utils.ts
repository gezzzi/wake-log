const jstFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatTimeJST(isoString: string): string {
  const date = new Date(isoString);
  const parts = jstFormatter.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")!.value;
  const minute = parts.find((p) => p.type === "minute")!.value;
  return `${hour}:${minute}`;
}

export function formatDateJST(isoString: string): string {
  const date = new Date(isoString);
  const parts = jstFormatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

export function getCalendarDayJST(isoString: string): string {
  return formatDateJST(isoString);
}

const dayOfWeekFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  weekday: "short",
});

export function getDayOfWeekJST(isoString: string): string {
  return dayOfWeekFormatter.format(new Date(isoString));
}

export function formatShortDateJST(isoString: string): string {
  const date = new Date(isoString);
  const parts = jstFormatter.formatToParts(date);
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  const dow = getDayOfWeekJST(isoString);
  return `${Number(month)}/${Number(day)} (${dow})`;
}

function getHourJST(isoString: string): number {
  const date = new Date(isoString);
  const parts = jstFormatter.formatToParts(date);
  return Number(parts.find((p) => p.type === "hour")!.value);
}

function getMinuteJST(isoString: string): number {
  const date = new Date(isoString);
  const parts = jstFormatter.formatToParts(date);
  return Number(parts.find((p) => p.type === "minute")!.value);
}

export function getMinutesSinceMidnightJST(isoString: string): number {
  return getHourJST(isoString) * 60 + getMinuteJST(isoString);
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function calculateAverageWakeTime(
  logs: { woke_up_at: string }[]
): string | null {
  if (logs.length === 0) return null;
  const total = logs.reduce(
    (sum, log) => sum + getMinutesSinceMidnightJST(log.woke_up_at),
    0
  );
  return minutesToTimeString(total / logs.length);
}

export function getWakeTimeColor(isoString: string): string {
  const hour = getHourJST(isoString);
  if (hour < 6) return "bg-sky-200 dark:bg-sky-900";
  if (hour < 7) return "bg-emerald-200 dark:bg-emerald-900";
  if (hour < 8) return "bg-yellow-200 dark:bg-yellow-900";
  if (hour < 9) return "bg-orange-200 dark:bg-orange-900";
  return "bg-red-200 dark:bg-red-900";
}

export function getWakeTimeTextColor(isoString: string): string {
  const hour = getHourJST(isoString);
  if (hour < 6) return "text-sky-600 dark:text-sky-400";
  if (hour < 7) return "text-emerald-600 dark:text-emerald-400";
  if (hour < 8) return "text-yellow-600 dark:text-yellow-400";
  if (hour < 9) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}
