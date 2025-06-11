// FINAL CORRECTED CODE for: src/components/FinalCTASection.tsx
'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function FinalCTASection() {
  const t = useTranslations('FinalCTASection');
  return (
    <section className="bg-white dark:bg-lyceum-blue py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* THIS IS THE FIX: A flex container to separate text and button */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div>
            <h2 className="text-4xl font-bold font-serif text-lyceum-blue dark:text-lyceum-text-light">
              {t('title')}
            </h2>
            <p className="mt-4 text-lg text-lyceum-text-secondary dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>
          <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
            <Link
              href="/signup"
              className="inline-block px-8 py-4 rounded-lg text-lg font-semibold text-lyceum-blue bg-lyceum-accent hover:bg-lyceum-accent-dark transition-colors"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
