import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Gmail Sync Edge Function
 * Fetches Gmail threads and stores them in the database
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GmailToken {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  email: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  internalDate: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
  };
  snippet: string;
}

interface GmailThread {
  id: string;
  messages: GmailMessage[];
}

interface ParsedEmail {
  external_id: string;
  subject: string;
  sender: string;
  received_at: string;
  body_preview: string;
}

/**
 * Refresh Gmail access token
 */
async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{ access_token: string; expires_at: string }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

  return {
    access_token: data.access_token,
    expires_at: expiresAt,
  };
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidToken(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const { data: tokenData, error } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData) {
    throw new Error('No Gmail token found for user');
  }

  const token = tokenData as GmailToken;
  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    const refreshed = await refreshAccessToken(
      token.refresh_token,
      clientId,
      clientSecret
    );

    // Update token in database
    await supabase
      .from('gmail_tokens')
      .update({
        access_token: refreshed.access_token,
        expires_at: refreshed.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return refreshed.access_token;
  }

  return token.access_token;
}

/**
 * Fetch Gmail threads
 */
async function fetchThreads(
  accessToken: string,
  query: string = 'in:inbox',
  maxResults: number = 100
): Promise<{ threads: Array<{ id: string }>; nextPageToken?: string }> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/threads');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', maxResults.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    threads: data.threads || [],
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Get thread details
 */
async function getThread(
  accessToken: string,
  threadId: string
): Promise<GmailThread> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Parse email data from Gmail thread
 */
function parseEmail(thread: GmailThread): ParsedEmail {
  // Get the first message in the thread
  const firstMessage = thread.messages[0];
  
  // Extract headers
  const headers = firstMessage.payload.headers;
  const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(No subject)';
  const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
  
  // Parse sender email
  const senderMatch = from.match(/<(.+?)>/) || from.match(/^(.+?)$/);
  const sender = senderMatch ? senderMatch[1] : from;

  // Get received date
  const receivedAt = new Date(parseInt(firstMessage.internalDate)).toISOString();

  // Use snippet as body preview
  const bodyPreview = firstMessage.snippet || '';

  return {
    external_id: thread.id,
    subject,
    sender,
    received_at: receivedAt,
    body_preview: bodyPreview,
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!googleClientId || !googleClientSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing Google OAuth configuration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { user_id, full_sync } = body;

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get valid access token
    const accessToken = await getValidToken(
      supabase,
      user_id,
      googleClientId,
      googleClientSecret
    );

    // Build query based on sync type
    let query = 'in:inbox';
    if (!full_sync) {
      // Get last sync timestamp
      const { data: userData } = await supabase
        .from('users')
        .select('gmail_last_synced_at')
        .eq('id', user_id)
        .single();

      if (userData?.gmail_last_synced_at) {
        const lastSync = new Date(userData.gmail_last_synced_at);
        const afterDate = Math.floor(lastSync.getTime() / 1000);
        query = `in:inbox after:${afterDate}`;
      }
    }

    // Fetch threads
    const { threads } = await fetchThreads(accessToken, query, 50);

    console.log(`Found ${threads.length} threads to process`);

    // Process each thread
    const inboxItems = [];
    for (const threadRef of threads) {
      try {
        const thread = await getThread(accessToken, threadRef.id);
        const parsed = parseEmail(thread);
        inboxItems.push({
          source: 'gmail',
          external_id: parsed.external_id,
          subject: parsed.subject,
          sender: parsed.sender,
          received_at: parsed.received_at,
          body_preview: parsed.body_preview,
          status: 'pending',
        });
      } catch (error) {
        console.error(`Error processing thread ${threadRef.id}:`, error);
        // Continue with other threads
      }
    }

    // Insert inbox items (upsert to handle duplicates)
    if (inboxItems.length > 0) {
      const { error: insertError } = await supabase
        .from('inbox_items')
        .upsert(inboxItems, {
          onConflict: 'source,external_id',
        });

      if (insertError) {
        console.error('Error inserting inbox items:', insertError);
        throw insertError;
      }
    }

    // Update last sync timestamp
    await supabase
      .from('users')
      .update({
        gmail_last_synced_at: new Date().toISOString(),
      })
      .eq('id', user_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${inboxItems.length} threads`,
        synced: inboxItems.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Gmail sync error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
