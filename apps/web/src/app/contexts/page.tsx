'use client';

import { FolderOpen } from 'lucide-react';
import { ContextFilesSection } from '@/components/features/context-files';

export default function ContextsPage() {
  return (
    <div className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
              <FolderOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              Claude's Context
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            What Claude knows about you and your projects. This information is loaded at the start of each session.
          </p>
        </div>

        {/* Context Files Section */}
        <ContextFilesSection />
      </div>
    </div>
  );
}
