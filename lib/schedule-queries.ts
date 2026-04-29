import { db, initDb } from "./db";

export type DailySchedule = {
  id: number;
  date: string;
  breakfast_at: string | null;
  lunch_at: string | null;
  dinner_at: string | null;
  created_at: string;
};

function toSchedule(row: Record<string, unknown>): DailySchedule {
  return {
    id: row.id as number,
    date: row.date as string,
    breakfast_at: (row.breakfast_at as string | null) ?? null,
    lunch_at: (row.lunch_at as string | null) ?? null,
    dinner_at: (row.dinner_at as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

export async function getScheduleByDate(
  date: string
): Promise<DailySchedule | null> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM daily_schedules WHERE date = ?",
    args: [date],
  });
  return result.rows.length > 0 ? toSchedule(result.rows[0]) : null;
}

export async function getSchedulesByRange(
  startDate: string,
  endDate: string
): Promise<DailySchedule[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM daily_schedules WHERE date >= ? AND date <= ? ORDER BY date ASC",
    args: [startDate, endDate],
  });
  return result.rows.map(toSchedule);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function calculateMealAverages(schedules: DailySchedule[]): {
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
} {
  function avg(times: (string | null)[]): string | null {
    const valid = times.filter((t): t is string => t !== null);
    if (valid.length === 0) return null;
    const total = valid.reduce((sum, t) => sum + timeToMinutes(t), 0);
    return minutesToTime(total / valid.length);
  }
  return {
    breakfast: avg(schedules.map((s) => s.breakfast_at)),
    lunch: avg(schedules.map((s) => s.lunch_at)),
    dinner: avg(schedules.map((s) => s.dinner_at)),
  };
}

export async function getRecentSchedules(
  limit: number = 30
): Promise<DailySchedule[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM daily_schedules ORDER BY date DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toSchedule);
}

export async function updateMealTime(
  date: string,
  mealType: "breakfast" | "lunch" | "dinner",
  time: string | null
): Promise<DailySchedule> {
  await initDb();
  const sqlMap = {
    breakfast: `INSERT INTO daily_schedules (date, breakfast_at)
                VALUES (?, ?)
                ON CONFLICT(date) DO UPDATE SET breakfast_at = excluded.breakfast_at
                RETURNING *`,
    lunch: `INSERT INTO daily_schedules (date, lunch_at)
            VALUES (?, ?)
            ON CONFLICT(date) DO UPDATE SET lunch_at = excluded.lunch_at
            RETURNING *`,
    dinner: `INSERT INTO daily_schedules (date, dinner_at)
             VALUES (?, ?)
             ON CONFLICT(date) DO UPDATE SET dinner_at = excluded.dinner_at
             RETURNING *`,
  };
  const result = await db.execute({
    sql: sqlMap[mealType],
    args: [date, time],
  });
  return toSchedule(result.rows[0]);
}

export async function deleteSchedule(id: number): Promise<void> {
  await initDb();
  await db.execute({
    sql: "DELETE FROM daily_schedules WHERE id = ?",
    args: [id],
  });
}

export async function upsertSchedule(
  date: string,
  breakfastAt: string | null,
  lunchAt: string | null,
  dinnerAt: string | null
): Promise<DailySchedule> {
  await initDb();
  const result = await db.execute({
    sql: `INSERT INTO daily_schedules (date, breakfast_at, lunch_at, dinner_at)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(date) DO UPDATE SET
            breakfast_at = excluded.breakfast_at,
            lunch_at = excluded.lunch_at,
            dinner_at = excluded.dinner_at
          RETURNING *`,
    args: [date, breakfastAt, lunchAt, dinnerAt],
  });
  return toSchedule(result.rows[0]);
}
