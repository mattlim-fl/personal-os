'use client';

import { Activity, Mail, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

const checks = [
  { name: 'Email', icon: Mail },
  { name: 'Calendar', icon: Calendar },
  { name: 'Todoist', icon: CheckSquare },
];

export function HeartbeatCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-success dark:text-success-200" />
          <CardTitle>Heartbeat</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">
              Interval
            </p>
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              Every 30 min
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">
              Quiet Hours
            </p>
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              23:00 – 08:00
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">
              Checks
            </p>
            <div className="flex items-center gap-3">
              {checks.map((check) => {
                const Icon = check.icon;
                return (
                  <span
                    key={check.name}
                    className="inline-flex items-center gap-1 text-sm text-surface-700 dark:text-surface-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-surface-400" />
                    {check.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">
              Delivery
            </p>
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              Topic 61
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
