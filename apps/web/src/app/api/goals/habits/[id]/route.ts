import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  updateDailyHabitSchema,
  type DailyHabit,
  type ApiResponse,
} from '@personal-os/shared';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateDailyHabitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('daily_habits')
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq('id', id)
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
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('daily_habits')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { message: 'Habit deleted', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
