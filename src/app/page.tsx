// src/app/page.tsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhyLyceumSection from '@/components/WhyLyceumSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import VisualShowcaseSection from '@/components/VisualShowcaseSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
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
