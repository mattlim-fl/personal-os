import { NextResponse } from 'next/server';
import { createCalendarService } from '@/lib/integrations/calendar';
import { DEMO_USER_ID } from '@/lib/constants';
import type { ApiResponse, CalendarBriefing } from '@personal-os/shared';

/**
 * GET /api/calendar/events
 * Fetch today's calendar events and briefing
 */
export async function GET() {
  try {
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    const calendarService = createCalendarService();

    // Get valid access token (will refresh if needed)
    const accessToken = await calendarService.getValidToken(userId);

    // Get calendar briefing for today
    const briefing = await calendarService.getCalendarBriefing(accessToken);

    return NextResponse.json<ApiResponse<CalendarBriefing>>(
      {
        data: briefing,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching calendar events:', error);

    // Check if it's a "no token" error
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
    const isNotConnected = errorMessage.includes('No Calendar token');

    return NextResponse.json<ApiResponse>(
      {
        error: isNotConnected ? 'Calendar not connected' : errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: isNotConnected ? 401 : 500 }
    );
  }
}
