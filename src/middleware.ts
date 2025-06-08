// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import createNextIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n-config';

// Initialize next-intl middleware
const nextIntlMiddleware = createNextIntlMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  // 1. Handle internationalization first.
  // This might produce a redirect or rewrite the URL.
  const intlResponse = nextIntlMiddleware(request);

  // 2. Create a Supabase client that reads from the (potentially modified by intl) request
  //    and writes to the response that intlMiddleware wants to return.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Ensure cookies are set on the request object as well for consistency
          request.cookies.set({ name, value, ...options });
          // And most importantly, set them on the response that will be returned
          intlResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          intlResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Refresh Supabase session. This will use the cookie methods defined above
  //    to read/write from/to the intlResponse.
  // N.B.: getUser() must be called to refresh the session.
  await supabase.auth.getUser();

  // 4. Return the response from intlMiddleware, which now also includes Supabase auth cookies.
  return intlResponse;
}

// Use the more general Supabase matcher to ensure session is always handled.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};