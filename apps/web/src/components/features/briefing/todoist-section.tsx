'use client';

import { useState, useEffect } from 'react';
import type { TodoistBriefing, TodoistTask } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

// Projects matching these names are "life admin", everything else is "work"
const LIFE_PROJECTS = ['Goose + Moose tasks'];

type TodoistMode = 'work' | 'life' | 'goals';

const MAX_VISIBLE_TASKS = 5;

function getTaskColor(task: TodoistTask): string {
  if (!task.due) return '';
  const today = new Date().toISOString().split('T')[0];
  if (task.due.date < today) return 'border-l-2 border-l-error-500';
  if (task.due.date === today) return 'border-l-2 border-l-warning-500';
  return 'border-l-2 border-l-primary-300 dark:border-l-primary-700';
}

function TaskRow({ task }: { task: TodoistTask }) {
  const colorClass = getTaskColor(task);
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.due && task.due.date < today;

  return (
    <a
      href={task.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block py-2 px-3 rounded hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors ${colorClass}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-surface-900 dark:text-surface-50 truncate flex-1">
          {task.content}
        </span>
        {task.priority > 2 && (
          <Badge
            variant={task.priority === 4 ? 'error' : 'warning'}
            size="sm"
          >
            P{5 - task.priority}
          </Badge>
        )}
        {isOverdue && (
          <span className="text-xs text-error-600 dark:text-error-400 flex-shrink-0">
            overdue
          </span>
        )}
      </div>
    </a>
  );
}

interface TodoistSectionProps {
  mode: TodoistMode;
}

export function TodoistSection({ mode }: TodoistSectionProps) {
  const [briefing, setBriefing] = useState<TodoistBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const title = mode === 'work' ? 'Work Tasks' : mode === 'life' ? 'Life Admin' : 'Current Goals';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/todoist/tasks');
        const data = await response.json();

        if (response.status === 401) {
          setNotConfigured(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tasks');
        }

        setBriefing(data.data);
      } catch (err) {
        console.error('Error fetching Todoist tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">{title}</h2>
          <LoadingState message="Loading..." />
        </CardContent>
      </Card>
    );
  }

  if (notConfigured) {
    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">{title}</h2>
          <EmptyState
            title="Todoist not configured"
            description="Set TODOIST_API_TOKEN to see tasks"
            compact
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">{title}</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // Filter tasks by mode
  const allTasks = [...(briefing?.overdue || []), ...(briefing?.dueToday || [])];
  const isLifeProject = (projectId: string) => {
    const project = briefing?.byProject.find((p) => p.projectId === projectId);
    return project ? LIFE_PROJECTS.includes(project.projectName) : false;
  };

  let tasks: TodoistTask[];
  if (mode === 'life') {
    tasks = allTasks.filter((t) => isLifeProject(t.projectId));
  } else if (mode === 'work') {
    tasks = allTasks.filter((t) => !isLifeProject(t.projectId));
  } else {
    // Goals mode: show summary stats
    tasks = allTasks;
  }

  // Sort: overdue first, then today
  const today = new Date().toISOString().split('T')[0];
  tasks.sort((a, b) => {
    const aOverdue = a.due && a.due.date < today ? 0 : 1;
    const bOverdue = b.due && b.due.date < today ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    return (b.priority || 1) - (a.priority || 1);
  });

  // Goals mode renders differently
  if (mode === 'goals') {
    const overdueCount = briefing?.totals.overdue || 0;
    const todayCount = briefing?.totals.dueToday || 0;
    const total = briefing?.totals.total || 0;

    return (
      <Card className="h-full">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-4">Current Goals</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${overdueCount > 0 ? 'text-error-600 dark:text-error-400' : 'text-surface-400'}`}>
                {overdueCount}
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">overdue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                {todayCount}
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                {total}
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">total</div>
            </div>
          </div>
          {briefing?.byProject && briefing.byProject.length > 0 && (
            <div className="space-y-2">
              {briefing.byProject.map((group) => (
                <div key={group.projectId} className="flex items-center justify-between text-sm">
                  <span className="text-surface-700 dark:text-surface-300">{group.projectName}</span>
                  <span className="text-surface-500 dark:text-surface-400">{group.tasks.length} tasks</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const visibleTasks = expanded ? tasks : tasks.slice(0, MAX_VISIBLE_TASKS);
  const remaining = tasks.length - MAX_VISIBLE_TASKS;
  const overdueCount = tasks.filter((t) => t.due && t.due.date < today).length;
  const todayCount = tasks.filter((t) => t.due && t.due.date === today).length;

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2 text-xs">
            {overdueCount > 0 && (
              <span className="text-error-600 dark:text-error-400 font-medium">
                {overdueCount} overdue
              </span>
            )}
            {todayCount > 0 && (
              <span className="text-warning-600 dark:text-warning-400">
                {todayCount} today
              </span>
            )}
          </div>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="All clear"
            description={mode === 'work' ? 'No work tasks due' : 'No life admin tasks due'}
            compact
          />
        ) : (
          <>
            <div className="space-y-0.5">
              {visibleTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
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
      </CardContent>
    </Card>
  );
}
