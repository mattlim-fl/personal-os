import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createRuleSchema,
  type Rule,
  type ApiResponse,
} from '@personal-os/shared';

/**
 * GET /api/rules
 * List all rules
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope');

    let query = supabase.from('rules').select('*').order('created_at', { ascending: true });

    if (scope) {
      query = query.eq('scope', scope);
    }

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

    return NextResponse.json<ApiResponse<Rule[]>>(
      {
        data: data as Rule[],
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
 * POST /api/rules
 * Create a new rule
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createRuleSchema.safeParse(body);
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

    // Create the rule
    const { data, error } = await supabase
      .from('rules')
      .insert([input])
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

    return NextResponse.json<ApiResponse<Rule>>(
      {
        data: data as Rule,
        message: 'Rule created successfully',
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
