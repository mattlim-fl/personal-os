import { z } from 'zod';

export const workTaskProjectEnum = z.enum([
  'Fractal',
  'GM',
  'Deal Committee',
  'State Street',
  'Personal',
]);

export type WorkTaskProject = z.infer<typeof workTaskProjectEnum>;

export const workTaskStatusEnum = z.enum(['todo', 'done']);

export type WorkTaskStatus = z.infer<typeof workTaskStatusEnum>;

export const workTaskSourceTypeEnum = z.enum(['manual', 'github', 'todoist']);

export type WorkTaskSourceType = z.infer<typeof workTaskSourceTypeEnum>;

export const workTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  project: workTaskProjectEnum.nullable(),
  status: workTaskStatusEnum,
  due_date: z.string().nullable(),
  source_type: z.string().default('manual'),
  source_id: z.string().nullable(),
  source_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WorkTask = z.infer<typeof workTaskSchema>;

export const createWorkTaskSchema = z.object({
  title: z.string().min(1).max(500),
  project: workTaskProjectEnum.nullable().optional(),
  due_date: z.string().nullable().optional(),
  source_type: workTaskSourceTypeEnum.optional(),
  source_id: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
});

export type CreateWorkTaskInput = z.infer<typeof createWorkTaskSchema>;

export const updateWorkTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  project: workTaskProjectEnum.nullable().optional(),
  status: workTaskStatusEnum.optional(),
  due_date: z.string().nullable().optional(),
});

export type UpdateWorkTaskInput = z.infer<typeof updateWorkTaskSchema>;

export interface ImportableItem {
  source_type: 'github' | 'todoist';
  source_id: string;
  title: string;
  source_url: string;
  project?: WorkTaskProject | null;
  due_date?: string | null;
  metadata?: {
    repo?: string;
    type?: 'pr' | 'issue';
    priority?: number;
  };
}
