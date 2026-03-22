'use client';

import { Brain, FileText, Clock, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { LucideIcon } from 'lucide-react';

interface MemoryFile {
  path: string;
  description: string;
  icon: LucideIcon;
}

const memoryFiles: MemoryFile[] = [
  { path: 'MEMORY.md', description: 'Long-term curated memory', icon: Brain },
  { path: 'memory/YYYY-MM-DD.md', description: 'Daily logs', icon: FileText },
  { path: 'memory/heartbeat-state.json', description: 'Check timestamps', icon: Clock },
  { path: '.learnings/', description: 'Corrections & lessons', icon: BookOpen },
];

export function MemorySystem() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-500" />
          <CardTitle>Memory System</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {memoryFiles.map((file) => {
            const Icon = file.icon;
            return (
              <div
                key={file.path}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
              >
                <Icon className="h-4 w-4 text-surface-400 flex-shrink-0" />
                <code className="text-xs font-mono text-primary-600 dark:text-primary-400 flex-shrink-0">
                  {file.path}
                </code>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  — {file.description}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
