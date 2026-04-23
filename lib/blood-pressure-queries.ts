import { db, initDb } from "./db";
export { BP_TIME_TAGS, BP_SITUATION_TAGS } from "./bp-tags";
export type { BPTimeTag, BPSituationTag } from "./bp-tags";

export type BPLog = {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  measured_at: string;
  time_tag: string | null;
  situation_tag: string | null;
  created_at: string;
};

function toBPLog(row: Record<string, unknown>): BPLog {
  return {
    id: row.id as number,
    systolic: row.systolic as number,
    diastolic: row.diastolic as number,
    pulse: row.pulse as number,
    measured_at: row.measured_at as string,
    time_tag: (row.time_tag as string | null) ?? null,
    situation_tag: (row.situation_tag as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

export async function getLatestBP(): Promise<BPLog | null> {
  await initDb();
  const result = await db.execute(
    "SELECT * FROM blood_pressure_logs ORDER BY datetime(measured_at) DESC LIMIT 1"
  );
  return result.rows.length > 0 ? toBPLog(result.rows[0]) : null;
}

export async function getRecentBP(limit: number = 10): Promise<BPLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM blood_pressure_logs ORDER BY datetime(measured_at) DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toBPLog);
}

export async function insertBP(
  systolic: number,
  diastolic: number,
  pulse: number,
  measuredAt: string,
  timeTag: string | null = null,
  situationTag: string | null = null
): Promise<BPLog> {
  await initDb();
  const result = await db.execute({
    sql: "INSERT INTO blood_pressure_logs (systolic, diastolic, pulse, measured_at, time_tag, situation_tag) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
    args: [systolic, diastolic, pulse, measuredAt, timeTag, situationTag],
  });
  return toBPLog(result.rows[0]);
}

export async function updateBP(
  id: number,
  systolic: number,
  diastolic: number,
  pulse: number,
  measuredAt: string,
  timeTag: string | null = null,
  situationTag: string | null = null
): Promise<BPLog> {
  await initDb();
  const result = await db.execute({
    sql: "UPDATE blood_pressure_logs SET systolic = ?, diastolic = ?, pulse = ?, measured_at = ?, time_tag = ?, situation_tag = ? WHERE id = ? RETURNING *",
    args: [systolic, diastolic, pulse, measuredAt, timeTag, situationTag, id],
  });
  return toBPLog(result.rows[0]);
}

export async function getBPByRange(
  start: string,
  end: string
): Promise<BPLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM blood_pressure_logs WHERE datetime(measured_at) >= datetime(?) AND datetime(measured_at) <= datetime(?) ORDER BY datetime(measured_at) ASC",
    args: [new Date(start).toISOString(), new Date(end).toISOString()],
  });
  return result.rows.map(toBPLog);
}

export function calculateAverageBP(
  logs: BPLog[]
): { systolic: number; diastolic: number; pulse: number } | null {
  if (logs.length === 0) return null;
  const total = logs.reduce(
    (acc, log) => ({
      systolic: acc.systolic + log.systolic,
      diastolic: acc.diastolic + log.diastolic,
      pulse: acc.pulse + log.pulse,
    }),
    { systolic: 0, diastolic: 0, pulse: 0 }
  );
  return {
    systolic: Math.round(total.systolic / logs.length),
    diastolic: Math.round(total.diastolic / logs.length),
    pulse: Math.round(total.pulse / logs.length),
  };
}

export async function deleteBP(id: number): Promise<void> {
  await initDb();
  await db.execute({
    sql: "DELETE FROM blood_pressure_logs WHERE id = ?",
    args: [id],
  });
}
