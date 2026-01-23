import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  toggleHabitCompletionSchema,
  type HabitCompletion,
  type ApiResponse,
} from '@personal-os/shared';

export async function GET(request: NextRequest) {
  try {
    const start = request.nextUrl.searchParams.get('start');
    const end = request.nextUrl.searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json<ApiResponse>(
        { error: 'start and end query params required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .gte('completed_date', start)
      .lte('completed_date', end);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<HabitCompletion[]>>(
      { data: data as HabitCompletion[], timestamp: new Date().toISOString() },
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
    const validation = toggleHabitCompletionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { habit_id, completed_date } = validation.data;

    // Check if completion already exists
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habit_id)
      .eq('completed_date', completed_date)
      .single();

    if (existing) {
      // Toggle off: delete the completion
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id);

      if (error) {
        return NextResponse.json<ApiResponse>(
          { error: error.message, timestamp: new Date().toISOString() },
          { status: 500 }
        );
      }

      return NextResponse.json<ApiResponse<{ completed: boolean }>>(
        { data: { completed: false }, timestamp: new Date().toISOString() },
        { status: 200 }
      );
    } else {
      // Toggle on: create the completion
      const { data, error } = await supabase
        .from('habit_completions')
        .insert([{ habit_id, completed_date }])
        .select()
        .single();

      if (error) {
        return NextResponse.json<ApiResponse>(
          { error: error.message, timestamp: new Date().toISOString() },
          { status: 500 }
        );
      }

      return NextResponse.json<ApiResponse<{ completed: boolean; completion: HabitCompletion }>>(
        { data: { completed: true, completion: data as HabitCompletion }, timestamp: new Date().toISOString() },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
