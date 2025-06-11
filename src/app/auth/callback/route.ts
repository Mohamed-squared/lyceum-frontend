import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Check if the user is new or returning
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user?.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // New user, redirect to onboarding
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
    } else if (profile) {
      // Returning user, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
