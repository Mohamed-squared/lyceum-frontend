// FILE: next.config.mjs

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js config can go here
};

export default withNextIntl(nextConfig);
