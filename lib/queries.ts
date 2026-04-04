import { db, initDb } from "./db";

export type WakeLog = {
  id: number;
  woke_up_at: string;
  created_at: string;
};

function toWakeLog(row: Record<string, unknown>): WakeLog {
  return {
    id: row.id as number,
    woke_up_at: row.woke_up_at as string,
    created_at: row.created_at as string,
  };
}

export async function getRecentLogs(limit: number = 10): Promise<WakeLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM wake_logs ORDER BY woke_up_at DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toWakeLog);
}

export async function getLogsByMonth(
  year: number,
  month: number
): Promise<WakeLog[]> {
  await initDb();
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  startDate.setUTCHours(startDate.getUTCHours() - 9); // JST to UTC
  const endDate = new Date(Date.UTC(year, month, 1));
  endDate.setUTCHours(endDate.getUTCHours() - 9);

  const result = await db.execute({
    sql: "SELECT * FROM wake_logs WHERE woke_up_at >= ? AND woke_up_at < ? ORDER BY woke_up_at ASC",
    args: [startDate.toISOString(), endDate.toISOString()],
  });
  return result.rows.map(toWakeLog);
}

export async function getLogsForDays(days: number): Promise<WakeLog[]> {
  await initDb();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = await db.execute({
    sql: "SELECT * FROM wake_logs WHERE woke_up_at >= ? ORDER BY woke_up_at ASC",
    args: [since.toISOString()],
  });
  return result.rows.map(toWakeLog);
}

export async function getLogsByRange(
  start: string,
  end: string
): Promise<WakeLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM wake_logs WHERE woke_up_at >= ? AND woke_up_at <= ? ORDER BY woke_up_at ASC",
    args: [new Date(start).toISOString(), new Date(end).toISOString()],
  });
  return result.rows.map(toWakeLog);
}

export async function insertLog(wokeUpAt: string): Promise<WakeLog> {
  await initDb();
  const result = await db.execute({
    sql: "INSERT INTO wake_logs (woke_up_at) VALUES (?) RETURNING *",
    args: [wokeUpAt],
  });
  return toWakeLog(result.rows[0]);
}

export async function updateLog(id: number, wokeUpAt: string): Promise<WakeLog> {
  await initDb();
  const result = await db.execute({
    sql: "UPDATE wake_logs SET woke_up_at = ? WHERE id = ? RETURNING *",
    args: [wokeUpAt, id],
  });
  return toWakeLog(result.rows[0]);
}

export async function deleteLog(id: number): Promise<void> {
  await initDb();
  await db.execute({
    sql: "DELETE FROM wake_logs WHERE id = ?",
    args: [id],
  });
}

export async function checkDuplicateDay(wokeUpAt: string): Promise<boolean> {
  await initDb();
  // Get JST calendar day boundaries for the given timestamp
  const date = new Date(wokeUpAt);
  const jstParts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = jstParts.find((p) => p.type === "year")!.value;
  const month = jstParts.find((p) => p.type === "month")!.value;
  const day = jstParts.find((p) => p.type === "day")!.value;

  // JST day start/end in UTC
  const dayStart = new Date(`${year}-${month}-${day}T00:00:00+09:00`);
  const dayEnd = new Date(`${year}-${month}-${day}T23:59:59+09:00`);

  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM wake_logs WHERE woke_up_at >= ? AND woke_up_at <= ?",
    args: [dayStart.toISOString(), dayEnd.toISOString()],
  });
  return (result.rows[0].count as number) > 0;
}
