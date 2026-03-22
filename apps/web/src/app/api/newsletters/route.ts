import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createNewsletterItemSchema,
  type NewsletterItem,
  type ApiResponse,
} from '@personal-os/shared';

/**
 * GET /api/newsletters
 * List newsletter items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const tag = searchParams.get('tag');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('newsletter_items')
      .select('*', { count: 'exact' })
      .order('digest_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (source) {
      query = query.eq('source', source);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (date) {
      query = query.eq('digest_date', date);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: data as NewsletterItem[], count: count ?? 0, timestamp: new Date().toISOString() },
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
 * POST /api/newsletters
 * Create newsletter item(s) — accepts a single item or an array
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body) ? body : [body];

    const validated = items.map((item) => {
      const result = createNewsletterItemSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues.map((e) => e.message).join(', ')}`
        );
      }
      return result.data;
    });

    const { data, error } = await supabase
      .from('newsletter_items')
      .insert(validated)
      .select();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<NewsletterItem[]>>(
      {
        data: data as NewsletterItem[],
        message: `Created ${data.length} newsletter item(s)`,
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
      { status: 400 }
    );
  }
}
