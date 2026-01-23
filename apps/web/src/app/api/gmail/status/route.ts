import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEMO_USER_ID } from '@/lib/constants';
import type { ApiResponse, GmailConnectionStatus } from '@personal-os/shared';

/**
 * GET /api/gmail/status
 * Check Gmail connection status for the current user
 */
export async function GET() {
  try {
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    // Check if user has Gmail tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('gmail_tokens')
      .select('email, created_at')
      .eq('user_id', userId)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json<ApiResponse<GmailConnectionStatus>>(
        {
          data: {
            connected: false,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Check last sync timestamp
    const { data: userData } = await supabase
      .from('users')
      .select('gmail_last_synced_at')
      .eq('id', userId)
      .single();

    return NextResponse.json<ApiResponse<GmailConnectionStatus>>(
      {
        data: {
          connected: true,
          email: tokenData.email,
          last_synced_at: userData?.gmail_last_synced_at || undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking Gmail status:', error);
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
 * DELETE /api/gmail/status
 * Disconnect Gmail (delete tokens)
 */
export async function DELETE() {
  try {
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    const { error } = await supabase
      .from('gmail_tokens')
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
        message: 'Gmail disconnected successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to disconnect',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
