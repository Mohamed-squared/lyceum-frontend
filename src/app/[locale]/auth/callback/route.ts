import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(`${origin}/login?error=auth-failed`);
    }
    // On successful code exchange, redirect to onboarding
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  // If no code is present, redirect to login with an error
  return NextResponse.redirect(`${origin}/login?error=no-code`);
}
