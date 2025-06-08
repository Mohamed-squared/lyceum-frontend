import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n-config';

export default createMiddleware({
  // These configurations are correct and will remain.
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always' // Changed from 'as-needed'
});

export const config = {
  // THIS IS THE FIX:
  // We are replacing the old matcher with this more explicit one.
  // This new matcher will only run the middleware on:
  // 1. The root path (`/`).
  // 2. Any path that starts with one of your supported locales (`/ar`, `/de`, etc.).
  // It will correctly IGNORE all requests for static assets in the `public` folder.
  matcher: ['/', '/(ar|de|en|tr)/:path*']
};