'use client';

import { Badge } from '@/components/ui';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface TabBarProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="border-b border-surface-200 dark:border-surface-700 mb-6 overflow-x-auto">
      <nav className="flex gap-1 min-w-max pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <Badge variant={isActive ? 'default' : 'default'} className="text-xs py-0">
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export type { TabConfig };
