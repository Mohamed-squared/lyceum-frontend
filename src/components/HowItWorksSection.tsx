// src/components/HowItWorksSection.tsx
'use client';

import { useTranslations } from 'next-intl';

// Interface no longer needed here due to direct key usage
// interface StepItem {
//   id: number;
//   number: string; // Could be a string like "1." or a component for an icon
//   titleKey: string;
//   descriptionKey: string;
// }

const HowItWorksSection = () => {
  const t = useTranslations('HowItWorksSection');
  const tSteps = useTranslations('HowItWorksSection.steps');

  const stepItems = [
    { id: 1, number: "1.", titleKey: "item1.title", descriptionKey: "item1.description" },
    { id: 2, number: "2.", titleKey: "item2.title", descriptionKey: "item2.description" },
    { id: 3, number: "3.", titleKey: "item3.title", descriptionKey: "item3.description" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-800"> {/* Added dark mode bg */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark dark:text-white text-center mb-12 md:mb-16">
          {t('title')}
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:space-x-8">
          {stepItems.map((step) => (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center text-center md:items-start md:text-left mb-8 md:mb-0"
            >
              <div className="text-3xl font-bold text-lyceum-accent dark:text-yellow-400 mb-3"> {/* Adjusted for dark mode */}
                {step.number}
              </div>
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark dark:text-gray-100 mb-2">
                {tSteps(step.titleKey)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-sans text-sm">
                {tSteps(step.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
