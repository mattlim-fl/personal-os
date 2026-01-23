import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createInboxItemSchema,
  type InboxItem,
  type InboxItemWithContext,
  type ApiResponse,
} from '@personal-os/shared';

/**
 * GET /api/inbox
 * List inbox items with optional filtering and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Filter parameters
    const status = searchParams.get('status');
    const contextId = searchParams.get('context_id');
    const minConfidence = searchParams.get('min_confidence');
    const sender = searchParams.get('sender');
    const source = searchParams.get('source');
    
    // Sort parameters
    const sortField = searchParams.get('sort_field') || 'received_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Build query with context join
    let query = supabase
      .from('inbox_items')
      .select(`
        *,
        context:contexts(id, slug, role, objective)
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (contextId) {
      query = query.eq('context_id', contextId);
    }
    if (minConfidence) {
      const minConf = parseFloat(minConfidence);
      if (!isNaN(minConf)) {
        query = query.gte('confidence', minConf);
      }
    }
    if (sender) {
      query = query.ilike('sender', `%${sender}%`);
    }
    if (source) {
      query = query.eq('source', source);
    }

    // Apply sorting
    const ascending = sortOrder === 'asc';
    query = query.order(sortField, { ascending });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<InboxItemWithContext[]>>(
      {
        data: data as InboxItemWithContext[],
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
 * POST /api/inbox
 * Create a new inbox item (typically used by sync functions)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createInboxItemSchema.safeParse(body);
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

    // Create the inbox item (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('inbox_items')
      .upsert([input], {
        onConflict: 'source,external_id',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<InboxItem>>(
      {
        data: data as InboxItem,
        message: 'Inbox item created successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
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
