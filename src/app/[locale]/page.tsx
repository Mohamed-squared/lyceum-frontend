// src/app/[locale]/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import Navbar from '../../../public/components/Navbar';
import HeroSection from '../../../public/components/HeroSection';
import WhyLyceumSection from '../../../public/components/WhyLyceumSection';
import FeaturesSection from '../../../public/components/FeaturesSection';
import HowItWorksSection from '../../../public/components/HowItWorksSection';
import VisualShowcaseSection from '../../../public/components/VisualShowcaseSection';
import FinalCTASection from '../../../public/components/FinalCTASection';
import Footer from '../../../public/components/Footer';

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
        <VisualShowcaseSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
