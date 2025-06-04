'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode, useEffect, useState } from 'react';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
// @ts-ignore
import nextI18NextConfig from '../../next-i18next.config.js'; // Adjust path

interface I18nProviderProps {
  locale: string;
  namespaces: string[];
  children: ReactNode;
  resources?: any; // Preloaded resources from server
}

// This function initializes i18next for the client side
const initI18nextClient = (locale: string, namespaces: string[], resources?: any) => {
  const i18nInstance = createInstance();
  i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`))) // For client-side loading
    .init({
      lng: locale,
      ns: namespaces,
      fallbackLng: nextI18NextConfig.i18n.defaultLocale,
      supportedLngs: nextI18NextConfig.i18n.locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      resources: resources, // Pass preloaded resources
      interpolation: {
        escapeValue: false, // React already safes from xss
      },
    });
  return i18nInstance;
};

export default function I18nProviderClient({ locale, namespaces, children, resources }: I18nProviderProps) {
  // Initialize i18next instance (this will run only once)
  const i18n = initI18nextClient(locale, namespaces, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
