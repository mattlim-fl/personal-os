import { z } from 'zod';

export const newsletterItemSchema = z.object({
  id: z.string().uuid(),
  source: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  url: z.string().url().nullable(),
  tags: z.array(z.string()).default([]),
  published_at: z.string().datetime().nullable(),
  digest_date: z.string(), // date string YYYY-MM-DD
  created_at: z.string().datetime(),
});

export type NewsletterItem = z.infer<typeof newsletterItemSchema>;

export const createNewsletterItemSchema = newsletterItemSchema.omit({
  id: true,
  created_at: true,
});

export type CreateNewsletterItemInput = z.infer<typeof createNewsletterItemSchema>;
