import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  getWeekStart,
  getWeekDays,
  getToday,
  type GoalsBriefingData,
  type WeeklyGoal,
  type WeeklySignal,
  type WeeklySignalEntry,
  type DailyHabit,
  type HabitCompletion,
  type DailyOutcome,
  type ApiResponse,
} from '@personal-os/shared';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const weekStart = getWeekStart();
    const weekDays = getWeekDays(weekStart);
    const weekEnd = weekDays[6];
    const today = getToday();

    // Fetch all data in parallel
    // Note: Using .is() for boolean filters as .eq() has unexpected behavior with booleans
    const [goalsResult, signalsResult, entriesResult, habitsResult, completionsResult, outcomeResult] =
      await Promise.all([
        supabase
          .from('weekly_goals')
          .select('*')
          .eq('week_start', weekStart)
          .order('sort_order', { ascending: true }),
        supabase
          .from('weekly_signals')
          .select('*')
          .is('active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('weekly_signal_entries')
          .select('*')
          .eq('week_start', weekStart),
        supabase
          .from('daily_habits')
          .select('*')
          .is('active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('habit_completions')
          .select('*')
          .gte('completed_date', weekStart)
          .lte('completed_date', weekEnd),
        supabase
          .from('daily_outcomes')
          .select('*')
          .eq('outcome_date', today)
          .single(),
      ]);

    // Check for errors
    if (goalsResult.error) throw new Error(goalsResult.error.message);
    if (signalsResult.error) throw new Error(signalsResult.error.message);
    if (entriesResult.error) throw new Error(entriesResult.error.message);
    if (habitsResult.error) throw new Error(habitsResult.error.message);
    if (completionsResult.error) throw new Error(completionsResult.error.message);
    // outcome can be null (PGRST116), that's fine

    const goals = goalsResult.data as WeeklyGoal[];
    const signals = signalsResult.data as WeeklySignal[];
    const entries = entriesResult.data as WeeklySignalEntry[];
    const habits = habitsResult.data as DailyHabit[];
    const completions = completionsResult.data as HabitCompletion[];
    const outcome = (outcomeResult.data as DailyOutcome) || null;

    // Join signals with entries
    const signalsWithEntries = signals.map((signal) => ({
      ...signal,
      entry: entries.find((e) => e.signal_id === signal.id) || null,
    }));

    // Join habits with completions
    const habitsWithCompletions = habits.map((habit) => ({
      ...habit,
      completions: completions
        .filter((c) => c.habit_id === habit.id)
        .map((c) => c.completed_date),
    }));

    const briefing: GoalsBriefingData = {
      weeklyGoals: goals,
      signals: signalsWithEntries,
      habits: habitsWithCompletions,
      dailyOutcome: outcome,
      weekStart,
    };

    return NextResponse.json<ApiResponse<GoalsBriefingData>>(
      { data: briefing, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
