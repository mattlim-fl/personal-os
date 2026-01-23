/**
 * Todoist types for Morning Briefing
 */

/**
 * Todoist task
 */
export interface TodoistTask {
  id: string;
  projectId: string;
  content: string;
  description: string;
  priority: 1 | 2 | 3 | 4; // 1 = normal, 4 = urgent
  due: {
    date: string;
    datetime?: string;
    isRecurring: boolean;
  } | null;
  labels: string[];
  url: string;
}

/**
 * Todoist project
 */
export interface TodoistProject {
  id: string;
  name: string;
  color: string;
}

/**
 * Tasks grouped by project
 */
export interface ProjectTasks {
  projectId: string;
  projectName: string;
  tasks: TodoistTask[];
}

/**
 * Todoist briefing for dashboard
 */
export interface TodoistBriefing {
  overdue: TodoistTask[];
  dueToday: TodoistTask[];
  byProject: ProjectTasks[];
  totals: {
    overdue: number;
    dueToday: number;
    total: number;
  };
}
