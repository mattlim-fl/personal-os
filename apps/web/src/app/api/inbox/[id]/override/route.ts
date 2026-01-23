import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEMO_USER_ID } from '@/lib/constants';
import {
  overrideInboxItemSchema,
  type InboxItem,
  type ApiResponse,
} from '@personal-os/shared';
import { createGmailService } from '@/lib/integrations/gmail';

/**
 * POST /api/inbox/[id]/override
 * Override the suggested action with a different action
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input
    const validation = overrideInboxItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const { action, context_id, execute } = validation.data;

    // Get the inbox item
    const { data: item, error: fetchError } = await supabase
      .from('inbox_items')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !item) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Inbox item not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const inboxItem = item as InboxItem;

    // Execute the action if requested
    if (execute && inboxItem.source === 'gmail') {
      try {
        // TODO: Replace with actual user ID from auth session
        const userId = DEMO_USER_ID;
        const gmailService = createGmailService();
        const accessToken = await gmailService.getValidToken(userId);

        switch (action) {
          case 'archive':
            await gmailService.archiveThread(accessToken, inboxItem.external_id);
            break;
          case 'defer':
            // Defer means no action in Gmail for now
            break;
          case 'draft':
            // Draft generation not implemented in MVP
            break;
          case 'escalate':
            // Escalate means no action in Gmail for now
            break;
        }
      } catch (error) {
        console.error('Error executing action:', error);
        // Continue even if action execution fails
      }
    }

    // Update with overridden action
    const { data: updated, error: updateError } = await supabase
      .from('inbox_items')
      .update({
        suggested_action: action,
        context_id: context_id || null,
        status: 'overridden',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json<ApiResponse>(
        {
          error: updateError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<InboxItem>>(
      {
        data: updated as InboxItem,
        message: 'Inbox item overridden successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error overriding inbox item:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
