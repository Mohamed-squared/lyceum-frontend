// src/app/[locale]/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhyLyceumSection from '@/components/WhyLyceumSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const t = useTranslations('HomePage'); // Example usage of useTranslations

  return (
    <>
      <Navbar />
      <main>
        {/* Example of using the translation hook */}
        {/* You'll need to add a corresponding 'title' key to your translation files */}
        <h1>{t('title')}</h1>
        <HeroSection />
        <WhyLyceumSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
