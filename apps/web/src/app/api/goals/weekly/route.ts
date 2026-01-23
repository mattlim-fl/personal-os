import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createWeeklyGoalSchema,
  getWeekStart,
  type WeeklyGoal,
  type ApiResponse,
} from '@personal-os/shared';

export async function GET(request: NextRequest) {
  try {
    const weekStart = request.nextUrl.searchParams.get('week_start') || getWeekStart();

    const { data, error } = await supabase
      .from('weekly_goals')
      .select('*')
      .eq('week_start', weekStart)
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<WeeklyGoal[]>>(
      { data: data as WeeklyGoal[], timestamp: new Date().toISOString() },
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
    const validation = createWeeklyGoalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('weekly_goals')
      .insert([validation.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<WeeklyGoal>>(
      { data: data as WeeklyGoal, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
