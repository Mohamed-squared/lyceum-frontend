import { initI18next } from '../i18n';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import Gamified from '../../components/Gamified'; // Import Gamified

export default async function HomePage({ params: { locale } }: { params: { locale: string }}) {
  const { t } = await initI18next(locale, ['common']);

  return (
    <>
      <Hero />
      <Features />
      <Gamified /> {/* Add Gamified component here */}
      {/* Other page sections will be added here */}
    </>
  );
}
