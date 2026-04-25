export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="pt-4 pb-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
      </header>
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      </div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
    </div>
  );
}
