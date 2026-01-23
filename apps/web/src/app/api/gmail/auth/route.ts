import { NextResponse } from 'next/server';
import { createGmailService } from '@/lib/integrations/gmail';
import type { ApiResponse } from '@personal-os/shared';

/**
 * GET /api/gmail/auth
 * Initiates Gmail OAuth flow by redirecting to Google
 */
export async function GET() {
  try {
    const gmailService = createGmailService();
    const authUrl = gmailService.getAuthUrl();

    return NextResponse.json<ApiResponse<{ url: string }>>(
      {
        data: { url: authUrl },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to generate auth URL',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
