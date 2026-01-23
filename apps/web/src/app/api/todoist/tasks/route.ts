import { NextResponse } from 'next/server';
import { createTodoistService } from '@/lib/integrations/todoist';
import type { ApiResponse, TodoistBriefing } from '@personal-os/shared';

/**
 * GET /api/todoist/tasks
 * Fetch Todoist tasks for the Morning Briefing
 */
export async function GET() {
  try {
    const service = createTodoistService();
    const briefing = await service.getTaskBriefing();

    return NextResponse.json<ApiResponse<TodoistBriefing>>(
      {
        data: briefing,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Todoist tasks:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
    const isNotConfigured = errorMessage.includes('TODOIST_API_TOKEN');

    return NextResponse.json<ApiResponse>(
      {
        error: isNotConfigured ? 'Todoist not configured' : errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: isNotConfigured ? 401 : 500 }
    );
  }
}
