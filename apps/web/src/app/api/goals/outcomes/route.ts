import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  upsertDailyOutcomeSchema,
  getToday,
  type DailyOutcome,
  type ApiResponse,
} from '@personal-os/shared';

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get('date') || getToday();

    const { data, error } = await supabase
      .from('daily_outcomes')
      .select('*')
      .eq('outcome_date', date)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<DailyOutcome | null>>(
      { data: (data as DailyOutcome) || null, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = upsertDailyOutcomeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: 'Validation failed', message: validation.error.issues.map((e: { message: string }) => e.message).join(', '), timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { outcome_date, lines } = validation.data;

    const { data, error } = await supabase
      .from('daily_outcomes')
      .upsert(
        { outcome_date, lines, updated_at: new Date().toISOString() },
        { onConflict: 'outcome_date' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<DailyOutcome>>(
      { data: data as DailyOutcome, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
