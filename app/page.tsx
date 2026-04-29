export const revalidate = 60;

import Link from "next/link";
import { Clock, Heart, Activity, Dumbbell, Utensils } from "lucide-react";
import { getRecentLogs } from "@/lib/queries";
import { formatTimeJST, getCalendarDayJST, getTodayJSTBounds } from "@/lib/utils";
import { getLatestBP } from "@/lib/blood-pressure-queries";
import { getAllExerciseByRange } from "@/lib/exercise-queries";
import { getScheduleByDate } from "@/lib/schedule-queries";

export default async function Home() {
  const today = getTodayJSTBounds();
  const todayDateStr = today.start.slice(0, 10);

  const [wakeLogs, latestBP, todayExercises, todaySchedule] = await Promise.all([
    getRecentLogs(1),
    getLatestBP(),
    getAllExerciseByRange(today.start, today.end),
    getScheduleByDate(todayDateStr),
  ]);

  const runCount = todayExercises.filter((l) => l.type === "run").length;
  const walkCount = todayExercises.filter((l) => l.type === "walk").length;
  const squatCount = todayExercises.filter((l) => l.type === "squat").length;

  // Today's JST date string
  const todayJST = getCalendarDayJST(new Date().toISOString());

  // Filter to only today's records
  const todayWake =
    wakeLogs.length > 0 && getCalendarDayJST(wakeLogs[0].woke_up_at) === todayJST
      ? wakeLogs[0]
      : null;
  const todayBP =
    latestBP && getCalendarDayJST(latestBP.measured_at) === todayJST
      ? latestBP
      : null;

  const latestTime = todayWake ? formatTimeJST(todayWake.woke_up_at) : "---";

  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);

  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-light tracking-tight">今日</h1>
        <p className="text-muted text-sm mt-1">{dateStr}</p>
      </header>

      {/* Wake Up */}
      <Link href="/wake" className="block">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-muted">
              <Clock size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">起床時間</span>
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-light tracking-tighter">{latestTime}</span>
          </div>
          <p className="text-xs text-muted-light mt-4 leading-relaxed">起床時間を一定にし、深い睡眠（N3）につなげる</p>
        </div>
      </Link>

      {/* Meals */}
      <Link href="/meals" className="block">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-muted">
              <Utensils size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">食事時間</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-light tracking-tighter">
                {todaySchedule?.breakfast_at ?? "—"}
              </div>
              <div className="text-muted-light text-sm font-medium mt-1">朝</div>
            </div>
            <div>
              <div className="text-3xl font-light tracking-tighter">
                {todaySchedule?.lunch_at ?? "—"}
              </div>
              <div className="text-muted-light text-sm font-medium mt-1">昼</div>
            </div>
            <div>
              <div className="text-3xl font-light tracking-tighter">
                {todaySchedule?.dinner_at ?? "—"}
              </div>
              <div className="text-muted-light text-sm font-medium mt-1">夜</div>
            </div>
          </div>
          <p className="text-xs text-muted-light mt-4 leading-relaxed">規則正しい食事の時間は体内時計を整え、睡眠の質を高める</p>
        </div>
      </Link>

      {/* Blood Pressure */}
      <Link href="/blood-pressure" className="block">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-muted">
              <Heart size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">血圧</span>
            </div>
          </div>
          {todayBP ? (
            <>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-light tracking-tighter">
                  {todayBP.systolic}
                  <span className="text-3xl text-gray-300 dark:text-gray-600 mx-1">/</span>
                  {todayBP.diastolic}
                </span>
                <span className="text-muted-light font-medium">mmHg</span>
              </div>
              <div className="text-sm text-muted-light mt-1">{todayBP.pulse} bpm</div>
            </>
          ) : (
            <div className="text-3xl font-light tracking-tighter text-muted-light">---</div>
          )}
          <p className="text-xs text-muted-light mt-4 leading-relaxed">低血圧の改善を目指して、日々の血圧を記録・可視化する</p>
        </div>
      </Link>

      {/* Cardio (Running + Walking) */}
      <Link href="/cardio" className="block">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-muted">
              <Activity size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">有酸素運動</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-5xl font-light tracking-tighter">{runCount}回</div>
              <div className="text-muted-light text-sm font-medium mt-1">ランニング</div>
            </div>
            <div>
              <div className="text-5xl font-light tracking-tighter">{walkCount}回</div>
              <div className="text-muted-light text-sm font-medium mt-1">ウォーキング</div>
            </div>
          </div>
          <p className="text-xs text-muted-light mt-4 leading-relaxed">VO2maxを高めるために週60〜90分の有酸素運動を行う</p>
        </div>
      </Link>

      {/* Squat */}
      <Link href="/squat" className="block">
        <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-muted">
              <Dumbbell size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">スクワット</span>
            </div>
          </div>
          <div>
            <div className="text-5xl font-light tracking-tighter">{squatCount}回</div>
          </div>
          <p className="text-xs text-muted-light mt-4 leading-relaxed">下半身の筋肉量を増やして血圧のベースを上げ、低血圧を改善する</p>
        </div>
      </Link>
    </div>
  );
}
