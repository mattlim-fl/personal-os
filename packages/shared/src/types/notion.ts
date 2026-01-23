/**
 * Notion integration types for Morning Briefing
 */

/**
 * Notion goal/task from database
 */
export interface NotionGoal {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  project?: string;
  url: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Goals briefing for dashboard
 */
export interface GoalsBriefing {
  goals: NotionGoal[];
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  dueToday: NotionGoal[];
  overdue: NotionGoal[];
}

/**
 * Notion connection status
 */
export interface NotionConnectionStatus {
  connected: boolean;
  databaseId?: string;
  databaseName?: string;
}
