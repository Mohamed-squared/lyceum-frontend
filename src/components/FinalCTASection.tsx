// FILE: src/components/FinalCTASection.tsx
'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation'; // Ensure Link is imported if it's used

export default function FinalCTASection() {
  const t = useTranslations('FinalCTASection');
  return (
    <section className="bg-gray-800 text-white py-20 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold font-serif">{t('title')}</h2>
        <p className="mt-4 text-lg text-gray-300">{t('subtitle')}</p>
         <Link
          href="/signup"
          className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold px-10 py-4 sm:px-12 sm:py-5 rounded-lg text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 d-inline-block mt-8" // Added mt-8 for spacing
        >
          {t('ctaButton')}
        </Link>
      </div>
    </section>
  );
}
