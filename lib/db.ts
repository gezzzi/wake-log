import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await db.batch([
    `CREATE TABLE IF NOT EXISTS wake_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      woke_up_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS blood_pressure_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      systolic INTEGER NOT NULL,
      diastolic INTEGER NOT NULL,
      pulse INTEGER NOT NULL,
      measured_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS exercise_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ]);

  // Migration: add done_at and tag columns to exercise_logs
  const exerciseColumns = await db.execute("PRAGMA table_info(exercise_logs)");
  const exerciseColumnNames = exerciseColumns.rows.map((r) => r.name as string);

  if (!exerciseColumnNames.includes("done_at")) {
    await db.execute("ALTER TABLE exercise_logs ADD COLUMN done_at TEXT");
    await db.execute(
      "UPDATE exercise_logs SET done_at = started_at WHERE done_at IS NULL"
    );
  }
  if (!exerciseColumnNames.includes("tag")) {
    await db.execute("ALTER TABLE exercise_logs ADD COLUMN tag TEXT");
  }

  // Migration: add time_tag and situation_tag columns to blood_pressure_logs
  const bpColumns = await db.execute("PRAGMA table_info(blood_pressure_logs)");
  const bpColumnNames = bpColumns.rows.map((r) => r.name as string);

  if (!bpColumnNames.includes("time_tag")) {
    await db.execute("ALTER TABLE blood_pressure_logs ADD COLUMN time_tag TEXT");
  }
  if (!bpColumnNames.includes("situation_tag")) {
    await db.execute("ALTER TABLE blood_pressure_logs ADD COLUMN situation_tag TEXT");
  }

  initialized = true;
}
