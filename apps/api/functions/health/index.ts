import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (_req: Request) => {
  const data = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'personal-os-api',
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
