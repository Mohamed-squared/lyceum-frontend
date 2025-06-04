import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultLocale, locales } from '../i18n-config';

export const initI18next = async (locale: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init({
      lng: locale,
      ns,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: 'common', // Default namespace
      fallbackNS: 'common',
      preload: typeof window === 'undefined' ? locales : [],
      // @ts-ignore
      backend: {
         // path for resources
        loadPath: '../../public/locales/{{lng}}/{{ns}}.json', // Adjust path
      },
    });
  return i18nInstance;
};
