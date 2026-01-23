import { z } from 'zod';

// --- Weekly Goals ---

export const weeklyGoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  status: z.enum(['todo', 'in_progress', 'done']),
  week_start: z.string(),
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type WeeklyGoal = z.infer<typeof weeklyGoalSchema>;

export const createWeeklyGoalSchema = z.object({
  title: z.string().min(1).max(200),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  week_start: z.string(),
  sort_order: z.number().int().default(0),
});
export type CreateWeeklyGoalInput = z.infer<typeof createWeeklyGoalSchema>;

export const updateWeeklyGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  sort_order: z.number().int().optional(),
});
export type UpdateWeeklyGoalInput = z.infer<typeof updateWeeklyGoalSchema>;

// --- Weekly Signals ---

export const weeklySignalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  target_count: z.number().int().min(1),
  unit: z.string().min(1).max(50),
  active: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type WeeklySignal = z.infer<typeof weeklySignalSchema>;

export const createWeeklySignalSchema = z.object({
  title: z.string().min(1).max(100),
  target_count: z.number().int().min(1),
  unit: z.string().min(1).max(50).default('sessions'),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
export type CreateWeeklySignalInput = z.infer<typeof createWeeklySignalSchema>;

export const updateWeeklySignalSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  target_count: z.number().int().min(1).optional(),
  unit: z.string().min(1).max(50).optional(),
  active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});
export type UpdateWeeklySignalInput = z.infer<typeof updateWeeklySignalSchema>;

// --- Weekly Signal Entries ---

export const weeklySignalEntrySchema = z.object({
  id: z.string().uuid(),
  signal_id: z.string().uuid(),
  week_start: z.string(),
  current_count: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
});
export type WeeklySignalEntry = z.infer<typeof weeklySignalEntrySchema>;

export const upsertSignalEntrySchema = z.object({
  signal_id: z.string().uuid(),
  week_start: z.string(),
  current_count: z.number().int().min(0),
});
export type UpsertSignalEntryInput = z.infer<typeof upsertSignalEntrySchema>;

// --- Daily Habits ---

export const dailyHabitSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  active: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type DailyHabit = z.infer<typeof dailyHabitSchema>;

export const createDailyHabitSchema = z.object({
  title: z.string().min(1).max(100),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
export type CreateDailyHabitInput = z.infer<typeof createDailyHabitSchema>;

export const updateDailyHabitSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});
export type UpdateDailyHabitInput = z.infer<typeof updateDailyHabitSchema>;

// --- Habit Completions ---

export const habitCompletionSchema = z.object({
  id: z.string().uuid(),
  habit_id: z.string().uuid(),
  completed_date: z.string(),
  created_at: z.string(),
});
export type HabitCompletion = z.infer<typeof habitCompletionSchema>;

export const toggleHabitCompletionSchema = z.object({
  habit_id: z.string().uuid(),
  completed_date: z.string(),
});
export type ToggleHabitCompletionInput = z.infer<typeof toggleHabitCompletionSchema>;

// --- Daily Outcomes ---

export const dailyOutcomeSchema = z.object({
  id: z.string().uuid(),
  outcome_date: z.string(),
  lines: z.array(z.string().max(200)),
  created_at: z.string(),
  updated_at: z.string(),
});
export type DailyOutcome = z.infer<typeof dailyOutcomeSchema>;

export const upsertDailyOutcomeSchema = z.object({
  outcome_date: z.string(),
  lines: z.array(z.string().max(200)).max(15),
});
export type UpsertDailyOutcomeInput = z.infer<typeof upsertDailyOutcomeSchema>;

// --- Briefing Aggregate Types ---

export interface SignalWithEntry extends WeeklySignal {
  entry: WeeklySignalEntry | null;
}

export interface HabitWithCompletions extends DailyHabit {
  completions: string[]; // dates completed this week (YYYY-MM-DD)
}

export interface GoalsBriefingData {
  weeklyGoals: WeeklyGoal[];
  signals: SignalWithEntry[];
  habits: HabitWithCompletions[];
  dailyOutcome: DailyOutcome | null;
  weekStart: string;
}
