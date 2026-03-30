import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wake_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      woke_up_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  initialized = true;
}
