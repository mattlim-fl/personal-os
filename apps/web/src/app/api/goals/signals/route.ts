import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createWeeklySignalSchema,
  type WeeklySignal,
  type ApiResponse,
} from '@personal-os/shared';

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('active') !== 'false';

    let query = supabase
      .from('weekly_signals')
      .select('*')
      .order('sort_order', { ascending: true });

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<WeeklySignal[]>>(
      { data: data as WeeklySignal[], timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createWeeklySignalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('weekly_signals')
      .insert([validation.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<WeeklySignal>>(
      { data: data as WeeklySignal, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
