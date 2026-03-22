'use client';

import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui';

interface CronJob {
  name: string;
  schedule: string;
  status: 'working' | 'fixed' | 'fixed-untested' | 'new' | 'never-run';
  delivery: string;
}

const cronJobs: CronJob[] = [
  { name: 'Daily Digest', schedule: 'Mon–Fri 8am', status: 'working', delivery: 'Topic 3' },
  { name: 'Daily News', schedule: 'Mon–Fri 8:05am', status: 'fixed-untested', delivery: 'Topic 3' },
  { name: 'Daily Newsletter Capture', schedule: 'Daily 9pm', status: 'new', delivery: 'Silent' },
  { name: 'Weekly Newsletter Digest', schedule: 'Sun 9am', status: 'fixed', delivery: 'Topic 61' },
  { name: 'Weekly Downloads Cleanup', schedule: 'Sat 10am', status: 'new', delivery: 'Topic 61' },
  { name: 'Weekly OpenClaw Backup', schedule: 'Sun 10am', status: 'working', delivery: 'Topic 61' },
  { name: 'Memory Maintenance', schedule: 'Sun 10am', status: 'working', delivery: 'Silent' },
  { name: 'Quarterly Skill Audit', schedule: '1st Sun of Q', status: 'never-run', delivery: 'Announce' },
];

const statusConfig: Record<
  CronJob['status'],
  { variant: BadgeProps['variant']; label: string }
> = {
  working: { variant: 'success', label: 'Working' },
  fixed: { variant: 'info', label: 'Fixed' },
  'fixed-untested': { variant: 'warning', label: 'Fixed (untested)' },
  new: { variant: 'info', label: 'New' },
  'never-run': { variant: 'default', label: 'Never run' },
};

export function CronJobsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-surface-400" />
          <CardTitle>Cron Jobs</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800">
                <th className="text-left py-2 pr-4 font-medium text-surface-500 dark:text-surface-400">
                  Job
                </th>
                <th className="text-left py-2 pr-4 font-medium text-surface-500 dark:text-surface-400">
                  Schedule
                </th>
                <th className="text-left py-2 pr-4 font-medium text-surface-500 dark:text-surface-400">
                  Status
                </th>
                <th className="text-left py-2 font-medium text-surface-500 dark:text-surface-400">
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody>
              {cronJobs.map((job) => {
                const config = statusConfig[job.status];
                return (
                  <tr
                    key={job.name}
                    className="border-b border-surface-100 dark:border-surface-800/50 last:border-0"
                  >
                    <td className="py-2.5 pr-4 font-medium text-surface-900 dark:text-surface-50">
                      {job.name}
                    </td>
                    <td className="py-2.5 pr-4 text-surface-500 dark:text-surface-400 font-mono text-xs">
                      {job.schedule}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={config.variant} dot size="sm">
                        {config.label}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-surface-500 dark:text-surface-400">
                      {job.delivery}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked layout */}
        <div className="sm:hidden space-y-3">
          {cronJobs.map((job) => {
            const config = statusConfig[job.status];
            return (
              <div
                key={job.name}
                className="p-3 rounded-lg border border-surface-200 dark:border-surface-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                    {job.name}
                  </span>
                  <Badge variant={config.variant} dot size="sm">
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                  <span className="font-mono">{job.schedule}</span>
                  <span>→ {job.delivery}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
