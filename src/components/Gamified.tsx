'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

// Placeholder data for leaderboard
const leaderboardData = [
  { name: 'Alice', points: 1000, key: 'leaderboard.alice' },
  { name: 'Bob', points: 900, key: 'leaderboard.bob' },
  { name: 'Sam', points: 800, key: 'leaderboard.sam' },
];

// Placeholder badge images
const badgeImages = [
  { src: '/badge1.png', altKey: 'gamified.badge1Alt' },
  { src: '/badge2.png', altKey: 'gamified.badge2Alt' },
  { src: '/badge3.png', altKey: 'gamified.badge3Alt' },
];

export default function Gamified() {
  const { t } = useTranslation('common');
  const params = useParams();
  const currentLocale = params.locale as string;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
          {/* Left Side: Text Content */}
          <div className="text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
              {t('gamified.title')}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {t('gamified.description')}
            </p>
            <Link
              href={`/${currentLocale}/signup`}
              className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
            >
              {t('gamified.joinNow')}
            </Link>
          </div>

          {/* Right Side: Visuals (Badges and Leaderboard) */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex justify-center md:justify-start space-x-4">
              {badgeImages.map((badge, index) => (
                <div key={index} className="group relative">
                  <Image
                    src={badge.src} // Ensure these images exist in /public
                    alt={t(badge.altKey, {defaultValue: `Badge ${index + 1}`})}
                    width={60} // Increased size slightly
                    height={60}
                    className="rounded-full object-cover transition-transform duration-300 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110"
                  />
                   <div className="absolute inset-0 rounded-full border-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Mini-Leaderboard */}
            <div className="bg-white-glass dark:bg-black-glass backdrop-blur-md p-6 rounded-lg shadow-xl border border-gold">
              <h3 className="text-xl font-playfair font-semibold text-gray-900 dark:text-white text-center mb-4">
                {t('gamified.leaderboardTitle')}
              </h3>
              <ul className="space-y-3">
                {leaderboardData.map((player, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md shadow-sm"
                  >
                    <span className="font-opensans text-sm text-gray-800 dark:text-gray-200">
                      {index + 1}. {t(player.key, { defaultValue: player.name })}
                    </span>
                    <span className="font-semibold text-sm text-gold">
                      {t('gamified.points', { count: player.points, defaultValue: `${player.points} pts`})}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
