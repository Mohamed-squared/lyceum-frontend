// FILE: src/app/[locale]/page.tsx
'use client';

// No need for useTranslations here anymore
import Navbar from '@/components/Navbar'; // Keep Navbar if it's part of the page layout
import HeroSection from '@/components/HeroSection';
import WhyLyceumSection from '@/components/WhyLyceumSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  // const t = useTranslations('HomePage'); // This line is now removed

  return (
    <>
      <Navbar />
      <main>
        {/* The H1 for "Welcome to Lyceum" is removed */}
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
