import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { type Context, type ApiResponse } from '@personal-os/shared';

/**
 * POST /api/contexts/[id]/activate
 * Activate a context (deactivates all others)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First, verify the context exists
    const { data: existingContext, error: fetchError } = await supabase
      .from('contexts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingContext) {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Context not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Deactivate all contexts
    const { error: deactivateError } = await supabase
      .from('contexts')
      .update({ active: false })
      .eq('active', true);

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

    // Activate the specified context
    const { data, error } = await supabase
      .from('contexts')
      .update({ active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
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
        message: 'Context activated successfully',
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
