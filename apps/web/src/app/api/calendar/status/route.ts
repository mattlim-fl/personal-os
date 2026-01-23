import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createCalendarService } from '@/lib/integrations/calendar';
import { DEMO_USER_ID } from '@/lib/constants';
import type { ApiResponse, CalendarConnectionStatus } from '@personal-os/shared';

/**
 * GET /api/calendar/status
 * Check Calendar connection status for the current user
 */
export async function GET() {
  try {
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    // Check if user has Calendar tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('calendar_tokens')
      .select('email, access_token, refresh_token, expires_at, created_at')
      .eq('user_id', userId)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json<ApiResponse<CalendarConnectionStatus>>(
        {
          data: {
            connected: false,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Optionally fetch list of calendars
    let calendars;
    try {
      const calendarService = createCalendarService();
      const accessToken = await calendarService.getValidToken(userId);
      calendars = await calendarService.listCalendars(accessToken);
    } catch {
      // If we can't get calendars, still return connected status
      console.warn('Could not fetch calendar list');
    }

    return NextResponse.json<ApiResponse<CalendarConnectionStatus>>(
      {
        data: {
          connected: true,
          email: tokenData.email,
          calendars,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking Calendar status:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to check status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/calendar/status
 * Disconnect Calendar (delete tokens)
 */
export async function DELETE() {
  try {
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    const { error } = await supabase
      .from('calendar_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        message: 'Calendar disconnected successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error disconnecting Calendar:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to disconnect',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
