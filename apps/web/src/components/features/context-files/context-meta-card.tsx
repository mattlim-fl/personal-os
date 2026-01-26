'use client';

import { useState } from 'react';
import type { ContextFile } from '@personal-os/shared';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, User, Sliders, Globe } from 'lucide-react';

type MetaType = 'global' | 'current-state' | 'preferences';

interface ContextMetaCardProps {
  type: MetaType;
  file: ContextFile;
}

const metaConfig: Record<MetaType, { title: string; description: string; icon: typeof User }> = {
  global: {
    title: 'Global Context',
    description: 'Cross-project overview',
    icon: Globe,
  },
  'current-state': {
    title: 'Current State',
    description: 'Life events, income, key dates',
    icon: User,
  },
  preferences: {
    title: 'Preferences',
    description: 'Communication and work style',
    icon: Sliders,
  },
};

export function ContextMetaCard({ type, file }: ContextMetaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = metaConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-50">
                {config.title}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {config.description}
              </p>
            </div>
          </div>
          <button
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 p-1"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <pre className="text-xs text-surface-600 dark:text-surface-400 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
              {file.content}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
