/**
 * Todoist Integration Service
 *
 * Fetches tasks from Todoist for the Morning Briefing.
 */

import type { TodoistTask, TodoistProject, TodoistBriefing, ProjectTasks } from '@personal-os/shared';

interface TodoistAPIConfig {
  token: string;
}

/**
 * Todoist Service
 */
export class TodoistService {
  private baseUrl = 'https://api.todoist.com/rest/v2';

  constructor(private config: TodoistAPIConfig) {}

  /**
   * Fetch JSON from Todoist API
   */
  private async fetchTodoist<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all projects
   */
  async getProjects(): Promise<TodoistProject[]> {
    const projects = await this.fetchTodoist<any[]>('/projects');
    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
    }));
  }

  /**
   * Fetch tasks with a filter
   */
  async getTasks(filter: string): Promise<TodoistTask[]> {
    const tasks = await this.fetchTodoist<any[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return tasks.map((t) => ({
      id: t.id,
      projectId: t.project_id,
      content: t.content,
      description: t.description || '',
      priority: t.priority as 1 | 2 | 3 | 4,
      due: t.due
        ? {
            date: t.due.date,
            datetime: t.due.datetime || undefined,
            isRecurring: t.due.is_recurring || false,
          }
        : null,
      labels: t.labels || [],
      url: t.url,
    }));
  }

  /**
   * Get task briefing: overdue + due today, grouped by project
   */
  async getTaskBriefing(): Promise<TodoistBriefing> {
    const [tasks, projects] = await Promise.all([
      this.getTasks('(today | overdue)'),
      this.getProjects(),
    ]);

    const projectMap = new Map<string, string>();
    for (const project of projects) {
      projectMap.set(project.id, project.name);
    }

    const today = new Date().toISOString().split('T')[0];

    const overdue: TodoistTask[] = [];
    const dueToday: TodoistTask[] = [];

    for (const task of tasks) {
      if (!task.due) continue;
      const taskDate = task.due.date;
      if (taskDate < today) {
        overdue.push(task);
      } else {
        dueToday.push(task);
      }
    }

    // Group all tasks by project
    const projectGroups = new Map<string, TodoistTask[]>();
    for (const task of tasks) {
      const existing = projectGroups.get(task.projectId) || [];
      existing.push(task);
      projectGroups.set(task.projectId, existing);
    }

    const byProject: ProjectTasks[] = Array.from(projectGroups.entries()).map(
      ([projectId, projectTasks]) => ({
        projectId,
        projectName: projectMap.get(projectId) || 'Unknown',
        tasks: projectTasks,
      })
    );

    return {
      overdue,
      dueToday,
      byProject,
      totals: {
        overdue: overdue.length,
        dueToday: dueToday.length,
        total: tasks.length,
      },
    };
  }
}

/**
 * Create Todoist service from environment
 */
export function createTodoistService(): TodoistService {
  const token = process.env.TODOIST_API_TOKEN;

  if (!token) {
    throw new Error('TODOIST_API_TOKEN environment variable is required');
  }

  return new TodoistService({ token });
}
