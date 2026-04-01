import { Activity } from "lucide-react";

export default function RunningPage() {
  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">ランニング</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">最新のラン</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-light tracking-tighter">5.2</div>
            <div className="text-muted-light text-sm font-medium mt-1">距離 (km)</div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tighter">28:45</div>
            <div className="text-muted-light text-sm font-medium mt-1">時間</div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tighter">5&apos;31&quot;</div>
            <div className="text-muted-light text-sm font-medium mt-1">ペース</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">履歴</div>
        <p className="text-muted-light text-center py-8">準備中</p>
      </div>
    </div>
  );
}
