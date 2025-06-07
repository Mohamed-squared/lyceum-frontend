// FILE: src/middleware.ts

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar', 'tr', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'as-needed' // Added this line
});

export const config = {
  // Updated matcher to exclude specific paths and handle all other routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
