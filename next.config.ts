import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['en', 'ar', 'tr', 'de'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
