import { db, initDb } from "./db";
export { SQUAT_TAGS, type SquatTag } from "./exercise-tags";

export type ExerciseLog = {
  id: number;
  type: string;
  done_at: string;
  tag: string | null;
  created_at: string;
};

function toExerciseLog(row: Record<string, unknown>): ExerciseLog {
  return {
    id: row.id as number,
    type: row.type as string,
    done_at: row.done_at as string,
    tag: (row.tag as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

export async function getLatestExercise(
  type: string
): Promise<ExerciseLog | null> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type = ? ORDER BY datetime(done_at) DESC LIMIT 1",
    args: [type],
  });
  return result.rows.length > 0 ? toExerciseLog(result.rows[0]) : null;
}

export async function getRecentByType(
  type: string,
  limit: number = 10
): Promise<ExerciseLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type = ? ORDER BY datetime(done_at) DESC LIMIT ?",
    args: [type, limit],
  });
  return result.rows.map(toExerciseLog);
}

export async function getExerciseByRange(
  type: string,
  start: string,
  end: string
): Promise<ExerciseLog[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM exercise_logs WHERE type = ? AND datetime(done_at) >= datetime(?) AND datetime(done_at) <= datetime(?) ORDER BY datetime(done_at) ASC",
    args: [type, new Date(start).toISOString(), new Date(end).toISOString()],
  });
  return result.rows.map(toExerciseLog);
}

export async function countExerciseByRange(
  type: string,
  start: string,
  end: string
): Promise<number> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exercise_logs WHERE type = ? AND datetime(done_at) >= datetime(?) AND datetime(done_at) <= datetime(?)",
    args: [type, new Date(start).toISOString(), new Date(end).toISOString()],
  });
  return result.rows[0].count as number;
}

export async function insertExercise(
  type: string,
  doneAt: string,
  tag: string | null = null
): Promise<ExerciseLog> {
  await initDb();
  const result = await db.execute({
    sql: "INSERT INTO exercise_logs (type, started_at, ended_at, done_at, tag) VALUES (?, ?, ?, ?, ?) RETURNING *",
    args: [type, doneAt, doneAt, doneAt, tag],
  });
  return toExerciseLog(result.rows[0]);
}

export async function updateExercise(
  id: number,
  type: string,
  doneAt: string,
  tag: string | null = null
): Promise<ExerciseLog> {
  await initDb();
  const result = await db.execute({
    sql: "UPDATE exercise_logs SET type = ?, done_at = ?, tag = ? WHERE id = ? RETURNING *",
    args: [type, doneAt, tag, id],
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
