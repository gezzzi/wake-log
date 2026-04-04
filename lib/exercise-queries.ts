import { db, initDb } from "./db";

export type ExerciseLog = {
  id: number;
  type: string;
  started_at: string;
  ended_at: string;
  created_at: string;
};

function toExerciseLog(row: Record<string, unknown>): ExerciseLog {
  return {
    id: row.id as number,
    type: row.type as string,
    started_at: row.started_at as string,
    ended_at: row.ended_at as string,
    created_at: row.created_at as string,
  };
}

export async function getLatestExercise(
  type: string
): Promise<ExerciseLog | null> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type = ? ORDER BY started_at DESC LIMIT 1",
    args: [type],
  });
  return result.rows.length > 0 ? toExerciseLog(result.rows[0]) : null;
}

export async function getLatestRunOrWalk(): Promise<ExerciseLog | null> {
  await initDb();
  const result = await db.execute(
    "SELECT * FROM exercise_logs WHERE type IN ('run', 'walk') ORDER BY started_at DESC LIMIT 1"
  );
  return result.rows.length > 0 ? toExerciseLog(result.rows[0]) : null;
}

export async function getRecentExercises(
  limit: number = 10
): Promise<ExerciseLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs ORDER BY started_at DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toExerciseLog);
}

export async function getRecentByType(
  type: string,
  limit: number = 10
): Promise<ExerciseLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type = ? ORDER BY started_at DESC LIMIT ?",
    args: [type, limit],
  });
  return result.rows.map(toExerciseLog);
}

export async function getRecentRunOrWalk(
  limit: number = 10
): Promise<ExerciseLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type IN ('run', 'walk') ORDER BY started_at DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map(toExerciseLog);
}

export async function insertExercise(
  type: string,
  startedAt: string,
  endedAt: string
): Promise<ExerciseLog> {
  await initDb();
  const result = await db.execute({
    sql: "INSERT INTO exercise_logs (type, started_at, ended_at) VALUES (?, ?, ?) RETURNING *",
    args: [type, startedAt, endedAt],
  });
  return toExerciseLog(result.rows[0]);
}

export async function updateExercise(
  id: number,
  type: string,
  startedAt: string,
  endedAt: string
): Promise<ExerciseLog> {
  await initDb();
  const result = await db.execute({
    sql: "UPDATE exercise_logs SET type = ?, started_at = ?, ended_at = ? WHERE id = ? RETURNING *",
    args: [type, startedAt, endedAt, id],
  });
  return toExerciseLog(result.rows[0]);
}

export async function deleteExercise(id: number): Promise<void> {
  await initDb();
  await db.execute({
    sql: "DELETE FROM exercise_logs WHERE id = ?",
    args: [id],
  });
}
