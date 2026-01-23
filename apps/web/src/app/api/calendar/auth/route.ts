import { NextResponse } from 'next/server';
import { createCalendarService } from '@/lib/integrations/calendar';
import type { ApiResponse } from '@personal-os/shared';

/**
 * GET /api/calendar/auth
 * Initiates Google Calendar OAuth flow
 */
export async function GET() {
  try {
    const calendarService = createCalendarService();
    const authUrl = calendarService.getAuthUrl();

    return NextResponse.json<ApiResponse<{ url: string }>>(
      {
        data: { url: authUrl },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating calendar auth URL:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to generate auth URL',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
