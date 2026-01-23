import { NextRequest, NextResponse } from 'next/server';
import { createGmailService } from '@/lib/integrations/gmail';
import { supabase } from '@/lib/supabase';
import { DEMO_USER_ID } from '@/lib/constants';
import { createGmailTokenSchema } from '@personal-os/shared';

/**
 * GET /api/gmail/callback
 * Handles OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/settings?error=no_code', request.url)
      );
    }

    const gmailService = createGmailService();

    // Exchange code for tokens
    const tokens = await gmailService.exchangeCode(code);

    // Get user email
    const email = await gmailService.getUserEmail(tokens.access_token);

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // For now, use a hardcoded user ID (will be replaced with actual auth)
    // TODO: Replace with actual user ID from auth session
    const userId = DEMO_USER_ID;

    // Validate input
    const validation = createGmailTokenSchema.safeParse({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      email,
    });

    if (!validation.success) {
      console.error('Token validation failed:', validation.error);
      return NextResponse.redirect(
        new URL('/settings?error=validation_failed', request.url)
      );
    }

    // Store tokens in database (upsert to handle reconnection)
    const { error: dbError } = await supabase
      .from('gmail_tokens')
      .upsert(
        {
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
          email,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(
        new URL('/settings?error=db_error', request.url)
      );
    }

    // Redirect to settings with success message
    return NextResponse.redirect(
      new URL('/settings?gmail=connected', request.url)
    );
  } catch (error) {
    console.error('Error in Gmail callback:', error);
    return NextResponse.redirect(
      new URL(
        `/settings?error=${encodeURIComponent(error instanceof Error ? error.message : 'unknown')}`,
        request.url
      )
    );
  }
}
