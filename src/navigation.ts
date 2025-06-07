// NEW FILE: src/navigation.ts
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales} from './i18n-config'; // Assuming i18n-config.ts exists in src

// The `pathnames` object is used to translate paths if needed.
// If your paths are the same across locales, you can omit this.
// Example:
// const pathnames = {
//   '/': '/',
//   '/about': {
//     en: '/about',
//     es: '/acerca-de'
//   }
// };

// For this case, as per user prompt, paths are the same
const pathnames = {
  '/login': '/login',
  '/signup': '/signup',
  '/about': '/about',
  '/terms': '/terms',
  '/privacy': '/privacy',
  '/contact': '/contact'
  // Add other paths here if they are not dynamic segments
};

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    // localePrefix: 'as-needed' // Optional: adds prefix only when not default locale
  });
