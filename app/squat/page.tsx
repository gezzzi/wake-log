import { Dumbbell } from "lucide-react";

export default function SquatPage() {
  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Dumbbell size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">スクワット</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">最新の記録</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-light tracking-tighter">30</div>
            <div className="text-muted-light text-sm font-medium mt-1">回数</div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tighter">3</div>
            <div className="text-muted-light text-sm font-medium mt-1">セット</div>
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
