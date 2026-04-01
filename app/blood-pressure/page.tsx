import { Heart } from "lucide-react";

export default function BloodPressurePage() {
  return (
    <div className="space-y-6">
      <header className="pt-4 pb-2">
        <div className="flex items-center space-x-2 text-muted mb-2">
          <Heart size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">血圧</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight">記録</h1>
      </header>

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted uppercase tracking-wider">最新の測定</span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">正常</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-light tracking-tighter">
            118<span className="text-3xl text-gray-300 dark:text-gray-600 mx-1">/</span>76
          </span>
          <span className="text-muted-light font-medium">mmHg</span>
        </div>
        <div className="mt-5 flex space-x-1">
          <div className="h-1.5 flex-1 bg-green-400 dark:bg-green-500 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent dark:border-gray-800">
        <div className="text-sm font-medium text-muted uppercase tracking-wider mb-4">履歴</div>
        <p className="text-muted-light text-center py-8">準備中</p>
      </div>
    </div>
  );
}
