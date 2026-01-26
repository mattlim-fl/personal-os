import { z } from 'zod';

// --- Project Status ---
export const projectStatusSchema = z.enum(['Active', 'Incoming', 'Winding Down']);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

// --- Context File (base) ---
export const contextFileSchema = z.object({
  slug: z.string(),
  content: z.string(),
  lastModified: z.string(),
});
export type ContextFile = z.infer<typeof contextFileSchema>;

// --- Project File ---
export const projectFileSchema = z.object({
  slug: z.string(),
  name: z.string(),
  status: projectStatusSchema,
  overview: z.string(),
  lastModified: z.string(),
  content: z.string(),
});
export type ProjectFile = z.infer<typeof projectFileSchema>;

// --- API Response ---
export const contextFilesResponseSchema = z.object({
  global: contextFileSchema,
  currentState: contextFileSchema,
  preferences: contextFileSchema,
  projects: z.array(projectFileSchema),
});
export type ContextFilesResponse = z.infer<typeof contextFilesResponseSchema>;
