import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
// @ts-ignore
import nextI18NextConfig from '../../next-i18next.config.js'; // Adjust path if next-i18next.config.js is in root

export const initI18next = async (locale: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init({
      lng: locale,
      ns,
      fallbackLng: nextI18NextConfig.i18n.defaultLocale,
      supportedLngs: nextI18NextConfig.i18n.locales,
      defaultNS: 'common', // Default namespace
      fallbackNS: 'common',
      preload: typeof window === 'undefined' ? nextI18NextConfig.i18n.locales : [],
      // @ts-ignore
      backend: {
         // path for resources
        loadPath: '../../public/locales/{{lng}}/{{ns}}.json', // Adjust path
      },
    });
  return i18nInstance;
};
