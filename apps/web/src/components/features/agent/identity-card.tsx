'use client';

import { Bot, FileText } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';

const coreFiles = ['SOUL.md', 'IDENTITY.md', 'USER.md', 'AGENTS.md'];

export function IdentityCard() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950">
            <Bot className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                Rafa 🎾
              </h2>
              <Badge variant="success" dot>
                Online
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-500 dark:text-surface-400 mb-3">
              <span>
                <span className="text-surface-400 dark:text-surface-500">Platform:</span>{' '}
                OpenClaw 2026.3.8
              </span>
              <span>
                <span className="text-surface-400 dark:text-surface-500">Model:</span>{' '}
                Claude Opus 4
              </span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
              Sharp, direct, dry humour. No sycophancy. Pushes back when needed.
            </p>
            <div className="flex flex-wrap gap-2">
              {coreFiles.map((file) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-mono text-surface-600 dark:text-surface-300"
                >
                  <FileText className="h-3 w-3" />
                  {file}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
