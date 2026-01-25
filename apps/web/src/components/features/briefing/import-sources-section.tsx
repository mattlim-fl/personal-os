'use client';

import { useState, useEffect } from 'react';
import type { ImportableItem, WorkTask } from '@personal-os/shared';
import { Badge } from '@/components/ui';

interface ImportSourcesSectionProps {
  onImported: (task: WorkTask) => void;
}

function SourceIcon({ type }: { type: 'github' | 'todoist' }) {
  if (type === 'github') {
    return (
      <svg className="w-4 h-4 text-surface-500" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-surface-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
    </svg>
  );
}

function ImportableRow({
  item,
  importing,
  onImport,
}: {
  item: ImportableItem;
  importing: boolean;
  onImport: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
      <SourceIcon type={item.source_type} />
      <a
        href={item.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 text-sm text-surface-900 dark:text-surface-50 truncate hover:underline"
      >
        {item.title}
      </a>
      {item.metadata?.repo && (
        <Badge variant="default" size="sm">
          {item.metadata.repo.split('/').pop()}
        </Badge>
      )}
      {item.due_date && (
        <span className="text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">
          {new Date(item.due_date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )}
      <button
        onClick={onImport}
        disabled={importing}
        className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {importing ? '...' : 'Add'}
      </button>
    </div>
  );
}

export function ImportSourcesSection({ onImported }: ImportSourcesSectionProps) {
  const [items, setItems] = useState<ImportableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [importing, setImporting] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchImportable = async () => {
      try {
        const res = await fetch('/api/work-tasks/importable');
        const json = await res.json();
        if (res.ok) setItems(json.data || []);
      } catch (err) {
        console.error('Failed to fetch importable items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImportable();
  }, []);

  const handleImport = async (item: ImportableItem) => {
    setImporting((prev) => new Set(prev).add(item.source_id));
    try {
      const res = await fetch('/api/work-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          project: item.project || null,
          due_date: item.due_date || null,
          source_type: item.source_type,
          source_id: item.source_id,
          source_url: item.source_url,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.source_id !== item.source_id));
        onImported(json.data);
      }
    } catch (err) {
      console.error('Failed to import task:', err);
    } finally {
      setImporting((prev) => {
        const s = new Set(prev);
        s.delete(item.source_id);
        return s;
      });
    }
  };

  if (loading || items.length === 0) return null;

  const githubItems = items.filter((i) => i.source_type === 'github');
  const todoistItems = items.filter((i) => i.source_type === 'todoist');

  return (
    <div className="mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors w-full"
      >
        <svg
          className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>Import from sources</span>
        <Badge variant="default" size="sm">
          {items.length}
        </Badge>
      </button>

      {!collapsed && (
        <div className="mt-2 space-y-0.5">
          {githubItems.length > 0 && (
            <div>
              <div className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide px-2 py-1">
                GitHub
              </div>
              {githubItems.map((item) => (
                <ImportableRow
                  key={item.source_id}
                  item={item}
                  importing={importing.has(item.source_id)}
                  onImport={() => handleImport(item)}
                />
              ))}
            </div>
          )}
          {todoistItems.length > 0 && (
            <div>
              <div className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide px-2 py-1">
                Todoist
              </div>
              {todoistItems.map((item) => (
                <ImportableRow
                  key={item.source_id}
                  item={item}
                  importing={importing.has(item.source_id)}
                  onImport={() => handleImport(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
