import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createDailyHabitSchema,
  type DailyHabit,
  type ApiResponse,
} from '@personal-os/shared';

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('active') !== 'false';

    let query = supabase
      .from('daily_habits')
      .select('*')
      .order('sort_order', { ascending: true });

    if (activeOnly) {
      // Note: Using .is() for boolean filters as .eq() has unexpected behavior with booleans in some contexts
      query = query.is('active', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<DailyHabit[]>>(
      { data: data as DailyHabit[], timestamp: new Date().toISOString() },
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
    const validation = createDailyHabitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('daily_habits')
      .insert([validation.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<DailyHabit>>(
      { data: data as DailyHabit, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
