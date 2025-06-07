// REFACTORED FILE: src/components/HeroSection.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation'; // Use the localized Link

export default function HeroSection() {
  const t = useTranslations('HeroSection');

  return (
    <section className="text-center py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
      <div className="mt-8">
        <Link
          href="/signup"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
        >
          {t('ctaButton')}
        </Link>
      </div>
    </section>
  );
}
