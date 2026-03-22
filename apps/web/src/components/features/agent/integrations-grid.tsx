'use client';

import {
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  BookOpen,
  Github,
  Lock,
  Search,
  Database,
  Receipt,
  Hash,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Integration {
  name: string;
  status: 'active' | 'unstable' | 'dormant';
  notes: string;
  icon: LucideIcon;
}

const integrations: Integration[] = [
  { name: 'Telegram', status: 'active', notes: 'Primary chat', icon: MessageCircle },
  { name: 'WhatsApp', status: 'unstable', notes: 'Frequent disconnects', icon: Phone },
  { name: 'Gmail', status: 'active', notes: 'IMAP via Himalaya, drafts only', icon: Mail },
  { name: 'Google Calendar', status: 'active', notes: 'gcalcli', icon: Calendar },
  { name: 'Todoist', status: 'active', notes: 'Shared with Grace', icon: CheckSquare },
  { name: 'Notion', status: 'active', notes: 'REST API', icon: BookOpen },
  { name: 'GitHub', status: 'active', notes: 'gh CLI', icon: Github },
  { name: '1Password', status: 'active', notes: 'Requires desktop app unlocked', icon: Lock },
  { name: 'Brave Search', status: 'active', notes: 'Web search API', icon: Search },
  { name: 'Supabase', status: 'active', notes: 'CLI + REST', icon: Database },
  { name: 'FreeAgent', status: 'dormant', notes: 'Not needed', icon: Receipt },
  { name: 'Slack', status: 'dormant', notes: 'Was Fractal', icon: Hash },
];

const statusConfig: Record<
  Integration['status'],
  { variant: BadgeProps['variant']; label: string }
> = {
  active: { variant: 'success', label: 'Active' },
  unstable: { variant: 'warning', label: 'Unstable' },
  dormant: { variant: 'default', label: 'Dormant' },
};

export function IntegrationsGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {integrations.map((item) => {
            const config = statusConfig[item.status];
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border',
                  item.status === 'dormant'
                    ? 'border-surface-200 dark:border-surface-800 opacity-60'
                    : 'border-surface-200 dark:border-surface-800'
                )}
              >
                <Icon className="h-4 w-4 mt-0.5 text-surface-400 dark:text-surface-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                      {item.name}
                    </span>
                    <Badge variant={config.variant} dot size="sm">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {item.notes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
