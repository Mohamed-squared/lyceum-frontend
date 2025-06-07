// UPDATED FILE: src/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './i18n-config'; // <-- Import from the new config file

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    // NOTE FOR AI: next-intl v3 does not require returning the locale here.
    messages: (await import(`../locales/${locale}/common.json`)).default
  };
});
