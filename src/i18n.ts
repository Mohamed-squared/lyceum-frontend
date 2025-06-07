// FILE: src/i18n.ts

import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Define supported locales
const locales = ['en', 'es'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming 'locale' parameter is a valid string and part of the supported locales
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  // At this point, 'locale' is guaranteed to be a valid string from the 'locales' array
  return {
    locale: locale, // Now locale is guaranteed to be a string
    messages: (await import(`../locales/${locale}/common.json`)).default
  };
});
