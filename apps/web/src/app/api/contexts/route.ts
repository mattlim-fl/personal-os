import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createContextSchema,
  type Context,
  type ApiResponse,
} from '@personal-os/shared';

/**
 * GET /api/contexts
 * List all contexts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') === 'true';
    const slug = searchParams.get('slug');

    let query = supabase.from('contexts').select('*').order('created_at', { ascending: false });

    if (activeOnly) {
      // Note: Using .is() for boolean filters as .eq() has unexpected behavior with booleans in some contexts
      query = query.is('active', true);
    }

    if (slug) {
      query = query.eq('slug', slug);
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

    return NextResponse.json<ApiResponse<Context[]>>(
      {
        data: data as Context[],
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
 * POST /api/contexts
 * Create a new context
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createContextSchema.safeParse(body);
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

    // If this context should be active, deactivate all others first
    if (input.active) {
      const { error: deactivateError } = await supabase
        .from('contexts')
        .update({ active: false })
        .is('active', true);

      if (deactivateError) {
        return NextResponse.json<ApiResponse>(
          {
            error: 'Failed to deactivate existing contexts',
            message: deactivateError.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
    }

    // Create the context
    const { data, error } = await supabase
      .from('contexts')
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

    return NextResponse.json<ApiResponse<Context>>(
      {
        data: data as Context,
        message: 'Context created successfully',
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
