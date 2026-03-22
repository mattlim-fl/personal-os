'use client';

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatusColumn {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  items: string[];
}

const columns: StatusColumn[] = [
  {
    title: 'Working Well',
    icon: CheckCircle2,
    iconColor: 'text-success dark:text-success-200',
    borderColor: 'border-t-success',
    items: [
      'Telegram integration',
      'Daily Digest cron',
      'OpenClaw Backup',
      'Memory Maintenance',
      'GitHub + 1Password',
      'Brave Search',
    ],
  },
  {
    title: 'Needs Attention',
    icon: AlertTriangle,
    iconColor: 'text-warning dark:text-warning-200',
    borderColor: 'border-t-warning',
    items: [
      'WhatsApp disconnects',
      'Daily News (untested)',
      'Newsletter crons (new)',
      'Downloads Cleanup (new)',
    ],
  },
  {
    title: 'Not Active',
    icon: XCircle,
    iconColor: 'text-surface-400 dark:text-surface-500',
    borderColor: 'border-t-surface-300 dark:border-t-surface-700',
    items: [
      'FreeAgent',
      'Slack',
      'Quarterly Skill Audit',
    ],
  },
];

export function StatusOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const Icon = col.icon;
        return (
          <Card key={col.title} className={cn('border-t-2', col.borderColor)}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={cn('h-4 w-4', col.iconColor)} />
                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                  {col.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-surface-600 dark:text-surface-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
