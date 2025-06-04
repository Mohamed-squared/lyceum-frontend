'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Image from 'next/image'; // For optimized background image if preferred

export default function Hero() {
  const { t } = useTranslation('common');
  const params = useParams();
  const currentLocale = params.locale as string;

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image and Overlay */}
      {/* Using a div with background-image for full bleed and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      </div>

      {/* Alternatively, using Next.js Image component for optimized image */}
      {/* <Image
        src="/hero-bg.jpg" // Ensure this image exists in /public
        alt="Classical library background"
        layout="fill"
        objectFit="cover"
        quality={75}
        className="absolute inset-0 -z-10"
      />
      <div className="absolute inset-0 bg-black opacity-50 -z-10"></div> */}

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4">
          {t('hero.headline')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-opensans mb-8 max-w-2xl mx-auto">
          {t('hero.subheadline')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href={`/${currentLocale}/signup`}
            className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg min-w-[180px]"
          >
            {t('hero.signup')}
          </Link>
          <Link
            href={`/${currentLocale}/courses`}
            className="px-8 py-3 text-lg font-semibold text-white bg-white-glass backdrop-blur-xs border-2 border-white rounded-lg hover:bg-opacity-30 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg min-w-[180px]"
          >
            {t('hero.explore')}
          </Link>
        </div>
      </div>
    </section>
  );
}
