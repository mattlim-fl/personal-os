import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  updateInboxItemSchema,
  type InboxItem,
  type InboxItemWithContext,
  type ApiResponse,
} from '@personal-os/shared';

/**
 * GET /api/inbox/[id]
 * Get a single inbox item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('inbox_items')
      .select(`
        *,
        context:contexts(id, slug, role, objective)
      `)
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Inbox item not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<InboxItemWithContext>>(
      {
        data: data as InboxItemWithContext,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/inbox/[id]
 * Update an inbox item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input
    const validation = updateInboxItemSchema.safeParse(body);
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

    const input = validation.data;

    // Update the inbox item
    const { data, error } = await supabase
      .from('inbox_items')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Inbox item not found or update failed',
          message: error?.message,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<InboxItem>>(
      {
        data: data as InboxItem,
        message: 'Inbox item updated successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inbox/[id]
 * Delete an inbox item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('inbox_items')
      .delete()
      .eq('id', params.id);

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
        message: 'Inbox item deleted successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
