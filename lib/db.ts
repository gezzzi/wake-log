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
  initialized = true;
}
