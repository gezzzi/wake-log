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

export function calculateWakeTimeRange(
  logs: { woke_up_at: string }[]
): {
  earliest: string;
  earliestDate: string;
  latest: string;
  latestDate: string;
  diffMinutes: number;
} | null {
  if (logs.length === 0) return null;
  let minLog = logs[0];
  let maxLog = logs[0];
  let minMinutes = getMinutesSinceMidnightJST(logs[0].woke_up_at);
  let maxMinutes = minMinutes;
  for (const log of logs) {
    const m = getMinutesSinceMidnightJST(log.woke_up_at);
    if (m < minMinutes) {
      minMinutes = m;
      minLog = log;
    }
    if (m > maxMinutes) {
      maxMinutes = m;
      maxLog = log;
    }
  }
  return {
    earliest: minutesToTimeString(minMinutes),
    earliestDate: formatShortDateJST(minLog.woke_up_at),
    latest: minutesToTimeString(maxMinutes),
    latestDate: formatShortDateJST(maxLog.woke_up_at),
    diffMinutes: maxMinutes - minMinutes,
  };
}

// Get today's JST day boundaries
export function getTodayJSTBounds(): {
  start: string;
  end: string;
  label: string;
} {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return {
    start: `${y}-${m}-${d}T00:00:00+09:00`,
    end: `${y}-${m}-${d}T23:59:59+09:00`,
    label: `${Number(m)}/${Number(d)}`,
  };
}

// Get Monday-Sunday week boundaries in JST
// Returns ISO strings for the start (Mon 00:00) and end (Sun 23:59:59) of the week
export function getWeekBoundsJST(offset: number = 0): {
  start: string;
  end: string;
  label: string;
} {
  const now = new Date();
  const jstParts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(jstParts.find((p) => p.type === "year")!.value);
  const month = Number(jstParts.find((p) => p.type === "month")!.value);
  const day = Number(jstParts.find((p) => p.type === "day")!.value);

  // Use UTC-based dates as a "frozen" representation of the JST date
  // This avoids timezone issues with Date.getDay() / setDate() which use local TZ
  const dateUTC = new Date(Date.UTC(year, month - 1, day));
  const dow = dateUTC.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysSinceMonday = (dow + 6) % 7;

  const monday = new Date(
    Date.UTC(year, month - 1, day - daysSinceMonday + offset * 7)
  );
  const sunday = new Date(
    Date.UTC(year, month - 1, day - daysSinceMonday + offset * 7 + 6)
  );

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const start = `${fmt(monday)}T00:00:00+09:00`;
  const end = `${fmt(sunday)}T23:59:59+09:00`;

  const monthMon = monday.getUTCMonth() + 1;
  const dayMon = monday.getUTCDate();
  const monthSun = sunday.getUTCMonth() + 1;
  const daySun = sunday.getUTCDate();
  const label = `${monthMon}/${dayMon}〜${monthSun}/${daySun}`;

  return { start, end, label };
}

// Normalize date string to ISO 8601 with JST offset
// Handles "2026/04/05 13:01" format from iPhone Shortcuts
export function normalizeDateToJST(input: string): string | null {
  const hasTimezone =
    /[+-]\d{2}:\d{2}$/.test(input) || input.endsWith("Z");

  if (hasTimezone) {
    const parsed = new Date(input);
    if (isNaN(parsed.getTime())) return null;
    return input;
  }

  const cleaned = input.replace(/\//g, "-");
  const match = cleaned.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!match) return null;

  const [, y, mo, d, h, mi, s = "00"] = match;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi}:${s.padStart(2, "0")}+09:00`;
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
