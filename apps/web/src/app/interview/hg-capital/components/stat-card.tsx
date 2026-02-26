'use client';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-primary-500" />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{value}</p>
    </div>
  );
}
