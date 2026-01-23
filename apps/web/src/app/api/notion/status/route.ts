import { NextResponse } from 'next/server';
import { createNotionService } from '@/lib/integrations/notion';
import type { ApiResponse, NotionConnectionStatus } from '@personal-os/shared';

/**
 * GET /api/notion/status
 * Check Notion connection status
 */
export async function GET() {
  try {
    const notionService = createNotionService();
    const status = await notionService.getStatus();

    return NextResponse.json<ApiResponse<NotionConnectionStatus>>(
      {
        data: status,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking Notion status:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to check status';
    const isNotConfigured =
      errorMessage.includes('NOTION_API_KEY') ||
      errorMessage.includes('NOTION_DATABASE_ID');

    if (isNotConfigured) {
      return NextResponse.json<ApiResponse<NotionConnectionStatus>>(
        {
          data: {
            connected: false,
          },
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
