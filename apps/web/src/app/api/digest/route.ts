import { NextResponse } from 'next/server';
import { createCalendarService } from '@/lib/integrations/calendar';
import {
  createGitHubActivityService,
  getProjectsConfig,
} from '@/lib/integrations/github-activity';
import { supabase } from '@/lib/supabase';
import { DEMO_USER_ID } from '@/lib/constants';
import { generateFocusItems } from '@/lib/digest/generate-focus-items';
import {
  generateDigestHtml,
  generateDigestPlainText,
  type DigestData,
} from '@/lib/digest/email-template';
import type {
  ApiResponse,
  CalendarBriefing,
  GitHubActivityBriefing,
  GoalsBriefingData,
  WeeklyGoal,
  WeeklySignal,
  WeeklySignalEntry,
  DailyHabit,
  HabitCompletion,
  DailyOutcome,
} from '@personal-os/shared';
import { getWeekStart, getWeekDays, getToday } from '@personal-os/shared';

export const dynamic = 'force-dynamic';

interface DigestResponse {
  html: string;
  plainText: string;
  focusItems: ReturnType<typeof generateFocusItems>;
  calendar: CalendarBriefing | null;
  goals: GoalsBriefingData | null;
  github: GitHubActivityBriefing | null;
  date: string;
}

async function fetchCalendarBriefing(): Promise<CalendarBriefing | null> {
  try {
    const userId = DEMO_USER_ID;
    const calendarService = createCalendarService();
    const accessToken = await calendarService.getValidToken(userId);
    return await calendarService.getCalendarBriefing(accessToken);
  } catch (error) {
    console.log('Calendar not available:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

async function fetchGitHubBriefing(): Promise<GitHubActivityBriefing | null> {
  try {
    const projects = getProjectsConfig();
    if (projects.length === 0) return null;

    const activityService = createGitHubActivityService();
    return await activityService.getActivityBriefing(projects);
  } catch (error) {
    console.log('GitHub not available:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

async function fetchGoalsBriefing(): Promise<GoalsBriefingData | null> {
  try {
    const weekStart = getWeekStart();
    const weekDays = getWeekDays(weekStart);
    const weekEnd = weekDays[6];
    const today = getToday();

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

    if (goalsResult.error) throw new Error(goalsResult.error.message);
    if (signalsResult.error) throw new Error(signalsResult.error.message);
    if (entriesResult.error) throw new Error(entriesResult.error.message);
    if (habitsResult.error) throw new Error(habitsResult.error.message);
    if (completionsResult.error) throw new Error(completionsResult.error.message);

    const goals = goalsResult.data as WeeklyGoal[];
    const signals = signalsResult.data as WeeklySignal[];
    const entries = entriesResult.data as WeeklySignalEntry[];
    const habits = habitsResult.data as DailyHabit[];
    const completions = completionsResult.data as HabitCompletion[];
    const outcome = (outcomeResult.data as DailyOutcome) || null;

    const signalsWithEntries = signals.map((signal) => ({
      ...signal,
      entry: entries.find((e) => e.signal_id === signal.id) || null,
    }));

    const habitsWithCompletions = habits.map((habit) => ({
      ...habit,
      completions: completions
        .filter((c) => c.habit_id === habit.id)
        .map((c) => c.completed_date),
    }));

    return {
      weeklyGoals: goals,
      signals: signalsWithEntries,
      habits: habitsWithCompletions,
      dailyOutcome: outcome,
      weekStart,
    };
  } catch (error) {
    console.log('Goals not available:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * GET /api/digest
 * Generate the daily morning digest with all briefing data
 */
export async function GET() {
  try {
    // Fetch all data in parallel
    const [calendar, github, goals] = await Promise.all([
      fetchCalendarBriefing(),
      fetchGitHubBriefing(),
      fetchGoalsBriefing(),
    ]);

    // Generate focus items
    const focusItems = generateFocusItems(calendar, github);

    // Format date
    const date = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Build digest data
    const digestData: DigestData = {
      focusItems,
      calendar,
      goals,
      github,
      date,
    };

    // Generate email content
    const html = generateDigestHtml(digestData);
    const plainText = generateDigestPlainText(digestData);

    const response: DigestResponse = {
      html,
      plainText,
      focusItems,
      calendar,
      goals,
      github,
      date,
    };

    return NextResponse.json<ApiResponse<DigestResponse>>(
      {
        data: response,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating digest:', error);

    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to generate digest',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
