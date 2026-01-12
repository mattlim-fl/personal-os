import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

/**
 * GitHub Sync Edge Function (Stub)
 *
 * This function will handle syncing GitHub data to the database.
 * Implementation pending.
 */

serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stub implementation
    return new Response(
      JSON.stringify({
        message: 'GitHub sync not implemented yet',
        status: 'stub',
      }),
      {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
