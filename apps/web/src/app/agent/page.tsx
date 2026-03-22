'use client';

import { Bot } from 'lucide-react';
import {
  IdentityCard,
  IntegrationsGrid,
  CronJobsTable,
  HeartbeatCard,
  SkillsList,
  MemorySystem,
  StatusOverview,
} from '@/components/features/agent';

export default function AgentPage() {
  return (
    <div className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
              <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              Agent
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            OpenClaw agent configuration and status overview.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <IdentityCard />
          <IntegrationsGrid />
          <CronJobsTable />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HeartbeatCard />
            <MemorySystem />
          </div>
          <SkillsList />
          <StatusOverview />
        </div>
      </div>
    </div>
  );
}
