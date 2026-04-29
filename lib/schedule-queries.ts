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
