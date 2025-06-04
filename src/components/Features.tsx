'use client';

import { useTranslation } from 'react-i18next';
import { FileText, Library, Brain, Users } from 'lucide-react'; // Example icons

// Define a type for individual feature data
interface FeatureItem {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  iconColor?: string; // Optional: if you want to color icons differently
}

const featureData: FeatureItem[] = [
  {
    icon: FileText,
    titleKey: 'features.testGen.title',
    descriptionKey: 'features.testGen.description',
    iconColor: 'text-blue-500',
  },
  {
    icon: Library,
    titleKey: 'features.coursesPlatform.title',
    descriptionKey: 'features.coursesPlatform.description',
    iconColor: 'text-green-500',
  },
  {
    icon: Brain,
    titleKey: 'features.aiTools.title',
    descriptionKey: 'features.aiTools.description',
    iconColor: 'text-purple-500',
  },
  {
    icon: Users,
    titleKey: 'features.community.title',
    descriptionKey: 'features.community.description',
    iconColor: 'text-red-500',
  },
];

export default function Features() {
  const { t } = useTranslation('common');

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white sm:text-4xl">
            {t('features.mainTitle', { defaultValue: 'Discover Our Key Features' })}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('features.mainSubtitle', { defaultValue: 'Enhancing your learning experience with cutting-edge tools and resources.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"> {/* For a 2x2 grid on lg, ensure it wraps correctly */}
          {featureData.map((feature) => (
            <div
              key={feature.titleKey}
              className="bg-white-glass dark:bg-black-glass backdrop-blur-md p-6 rounded-lg shadow-lg border border-gold hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-center mb-4">
                <feature.icon size={36} className={feature.iconColor || 'text-gold'} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-900 dark:text-white text-center mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
