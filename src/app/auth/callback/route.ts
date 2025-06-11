import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // This check is now more robust because it uses the real Supabase user object
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', data.user.id)
      .single();

    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

    if (!profile || !profile.onboarding_completed) {
      // If there's no profile or onboarding is not complete, send to onboarding
      return NextResponse.redirect(`${origin}/${locale}/onboarding`);
    } else {
      // If onboarding is complete, send to dashboard
      return NextResponse.redirect(`${origin}/${locale}/dashboard`);
    }
  }

  // Redirect to an error page if there's no code
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
