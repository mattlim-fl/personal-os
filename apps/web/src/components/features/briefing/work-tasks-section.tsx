'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkTask, WorkTaskProject } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';
import { ImportSourcesSection } from './import-sources-section';

const PROJECTS: WorkTaskProject[] = [
  'Fractal',
  'GM',
  'Deal Committee',
  'State Street',
  'Personal',
];

const MAX_VISIBLE = 10;

function getDueBadge(dueDate: string | null): {
  label: string;
  variant: 'error' | 'warning' | 'info' | 'default';
} | null {
  if (!dueDate) return null;
  const today = new Date().toISOString().split('T')[0];
  const due = dueDate;
  if (due < today) return { label: 'Overdue', variant: 'error' };
  if (due === today) return { label: 'Today', variant: 'warning' };

  const dueMs = new Date(due).getTime();
  const todayMs = new Date(today).getTime();
  const daysAway = Math.ceil((dueMs - todayMs) / (1000 * 60 * 60 * 24));
  if (daysAway <= 7) return { label: daysLabel(daysAway), variant: 'info' };
  return { label: formatDate(due), variant: 'default' };
}

function daysLabel(days: number): string {
  if (days === 1) return 'Tomorrow';
  return `${days}d`;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getTaskBorder(dueDate: string | null): string {
  if (!dueDate) return '';
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return 'border-l-2 border-l-error-500';
  if (dueDate === today) return 'border-l-2 border-l-warning-500';
  return '';
}

function TaskRow({
  task,
  onDone,
  onDefer,
  onDelete,
}: {
  task: WorkTask;
  onDone: (id: string) => void;
  onDefer: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const dueBadge = getDueBadge(task.due_date);
  const borderClass = getTaskBorder(task.due_date);

  return (
    <div
      className={`group flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors ${borderClass}`}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm text-surface-900 dark:text-surface-50 truncate">
          {task.title}
        </span>
        {task.source_url && (
          <a
            href={task.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-surface-400 hover:text-primary-500 transition-colors"
            title="View source"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {task.project && (
          <Badge variant="default" size="sm">
            {task.project}
          </Badge>
        )}
        {dueBadge && (
          <Badge variant={dueBadge.variant} size="sm">
            {dueBadge.label}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onDone(task.id)}
          className="p-1 rounded text-success-600 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/30 transition-colors"
          title="Mark done"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          onClick={() => onDefer(task.id)}
          className="p-1 rounded text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          title="Defer to tomorrow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function WorkTasksSection() {
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Quick add state
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState<WorkTaskProject | ''>('');
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/work-tasks');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch tasks');
      setTasks(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async () => {
    if (!newTitle.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch('/api/work-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          project: newProject || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add task');
      setTasks((prev) => [...prev, json.data]);
      setNewTitle('');
      setNewProject('');
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDone = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/work-tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });
      if (!res.ok) fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  const handleDefer = async (id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newDate = tomorrow.toISOString().split('T')[0];

    setTasks((prev) =>
      prev
        .map((t) => (t.id === id ? { ...t, due_date: newDate } : t))
        .sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        })
    );

    try {
      const res = await fetch(`/api/work-tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: newDate }),
      });
      if (!res.ok) fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/work-tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">Work Tasks</h2>
          <LoadingState message="Loading..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">Work Tasks</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const visibleTasks = expanded ? tasks : tasks.slice(0, MAX_VISIBLE);
  const remaining = tasks.length - MAX_VISIBLE;

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Work Tasks</h2>
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Quick Add */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
            className="flex-1 min-w-0 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-1.5 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          />
          <select
            value={newProject}
            onChange={(e) => setNewProject(e.target.value as WorkTaskProject | '')}
            className="rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-2 py-1.5 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          >
            <option value="">Project</option>
            {PROJECTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim() || adding}
            className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <EmptyState
            title="No work tasks"
            description="Add tasks above or import from sources below"
            compact
          />
        ) : (
          <>
            <div className="space-y-0.5">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onDone={handleDone}
                  onDefer={handleDefer}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {remaining > 0 && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                + {remaining} more
              </button>
            )}
          </>
        )}

        {/* Import from sources */}
        <ImportSourcesSection
          onImported={(task) => setTasks((prev) => [...prev, task])}
        />
      </CardContent>
    </Card>
  );
}
