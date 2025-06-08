// src/components/WhyLyceumSection.tsx
'use client';

import { useTranslations } from 'next-intl';

// Generic Placeholder Icon Component (can be kept or removed if not used by final design)
const PlaceholderIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-12 h-12 text-lyceum-accent mb-4 mx-auto ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // Example: Checkmark in circle
    />
  </svg>
);

// The interface is no longer needed here as items are defined directly with keys
// interface ProblemSolutionItem {
//   id: number;
//   problemKey: string; // Key for translation
//   solutionKey: string; // Key for translation
// }

const WhyLyceumSection = () => {
  const t = useTranslations('WhyLyceumSection');
  const tProblems = useTranslations('WhyLyceumSection.problems');

  const problemSolutionItems = [
    { id: 1, problemKey: "item1.problem", solutionKey: "item1.solution" },
    { id: 2, problemKey: "item2.problem", solutionKey: "item2.solution" },
    { id: 3, problemKey: "item3.problem", solutionKey: "item3.solution" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-800"> {/* Added dark mode bg */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark dark:text-white text-center mb-12 md:mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
          {problemSolutionItems.map((item) => (
            <div key={item.id} className="p-6">
              <PlaceholderIcon /> {/* Consider replacing with actual icons */}
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark dark:text-gray-100 mb-2">
                {tProblems(item.problemKey)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-sans">
                {tProblems(item.solutionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLyceumSection;
