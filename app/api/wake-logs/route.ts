import { type NextRequest, NextResponse } from "next/server";
import { getRecentLogs, getLogsByMonth, getLogsForDays } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const days = searchParams.get("days");
  const limit = searchParams.get("limit");

  let logs;
  if (year && month) {
    logs = await getLogsByMonth(Number(year), Number(month));
  } else if (days) {
    logs = await getLogsForDays(Number(days));
  } else {
    logs = await getRecentLogs(limit ? Number(limit) : 30);
  }

  return NextResponse.json({ logs });
}
