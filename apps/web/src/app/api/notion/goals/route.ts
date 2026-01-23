import { NextResponse } from 'next/server';
import { createNotionService } from '@/lib/integrations/notion';
import type { ApiResponse, GoalsBriefing } from '@personal-os/shared';

/**
 * GET /api/notion/goals
 * Fetch goals from Notion for the Morning Briefing
 */
export async function GET() {
  try {
    const notionService = createNotionService();
    const briefing = await notionService.getGoalsBriefing();

    return NextResponse.json<ApiResponse<GoalsBriefing>>(
      {
        data: briefing,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Notion goals:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch goals';
    const isNotConfigured =
      errorMessage.includes('NOTION_API_KEY') ||
      errorMessage.includes('NOTION_DATABASE_ID');

    return NextResponse.json<ApiResponse>(
      {
        error: isNotConfigured ? 'Notion not configured' : errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: isNotConfigured ? 401 : 500 }
    );
  }
}
