// src/components/FeaturesSection.tsx
'use client';

import { useTranslations } from 'next-intl';

// Generic Placeholder Icon Component (can be imported if centralized)
const PlaceholderIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-10 h-10 text-lyceum-primary-dark dark:text-lyceum-accent mb-3 ${className}`} // Adjusted for dark mode
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" // Example: Desktop screen icon
    />
  </svg>
);

// Interface no longer needed here due to direct key usage
// interface FeatureItem {
//   id: number;
//   nameKey: string;
//   descriptionKey: string;
// }

const FeaturesSection = () => {
  const t = useTranslations('FeaturesSection');
  const tFeatures = useTranslations('FeaturesSection.features');

  const featureItems = [
    { id: 1, nameKey: "item1.name", descriptionKey: "item1.description" },
    { id: 2, nameKey: "item2.name", descriptionKey: "item2.description" },
    { id: 3, nameKey: "item3.name", descriptionKey: "item3.description" },
    { id: 4, nameKey: "item4.name", descriptionKey: "item4.description" },
    { id: 5, nameKey: "item5.name", descriptionKey: "item5.description" },
    { id: 6, nameKey: "item6.name", descriptionKey: "item6.description" },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900"> {/* Adjusted for dark mode */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark dark:text-white text-center mb-12 md:mb-16">
          {t('title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature) => (
            <div
              key={feature.id}
              className="bg-lyceum-bg-historic dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out" // Adjusted for dark mode
            >
              <PlaceholderIcon /> {/* Consider replacing with actual icons */}
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark dark:text-gray-100 mb-2">
                {tFeatures(feature.nameKey)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-sans text-sm">
                {tFeatures(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
