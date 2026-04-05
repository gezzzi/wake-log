import { db, initDb } from "./db";

export type BPLog = {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  measured_at: string;
  created_at: string;
};

function toBPLog(row: Record<string, unknown>): BPLog {
  return {
    id: row.id as number,
    systolic: row.systolic as number,
    diastolic: row.diastolic as number,
    pulse: row.pulse as number,
    measured_at: row.measured_at as string,
    created_at: row.created_at as string,
  };
}

export async function getLatestBP(): Promise<BPLog | null> {
  await initDb();
  const result = await db.execute(
    "SELECT * FROM blood_pressure_logs ORDER BY measured_at DESC LIMIT 1"
  );
  return result.rows.length > 0 ? toBPLog(result.rows[0]) : null;
}

export async function getRecentBP(limit: number = 10): Promise<BPLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM blood_pressure_logs ORDER BY measured_at DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toBPLog);
}

export async function insertBP(
  systolic: number,
  diastolic: number,
  pulse: number,
  measuredAt: string
): Promise<BPLog> {
  await initDb();
  const result = await db.execute({
    sql: "INSERT INTO blood_pressure_logs (systolic, diastolic, pulse, measured_at) VALUES (?, ?, ?, ?) RETURNING *",
    args: [systolic, diastolic, pulse, measuredAt],
  });
  return toBPLog(result.rows[0]);
}

export async function updateBP(
  id: number,
  systolic: number,
  diastolic: number,
  pulse: number,
  measuredAt: string
): Promise<BPLog> {
  await initDb();
  const result = await db.execute({
    sql: "UPDATE blood_pressure_logs SET systolic = ?, diastolic = ?, pulse = ?, measured_at = ? WHERE id = ? RETURNING *",
    args: [systolic, diastolic, pulse, measuredAt, id],
  });
  return toBPLog(result.rows[0]);
}

export async function getBPByRange(
  start: string,
  end: string
): Promise<BPLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM blood_pressure_logs WHERE measured_at >= ? AND measured_at <= ? ORDER BY measured_at ASC",
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
