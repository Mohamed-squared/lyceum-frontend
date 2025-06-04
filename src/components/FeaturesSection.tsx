// src/components/FeaturesSection.tsx

// import { FiCircle } from "react-icons/fi"; // Placeholder Icon
import { FiCircle as PlaceholderIcon } from "react-icons/fi"; // Using FiCircle as a generic placeholder

interface FeatureItem {
  id: number;
  name: string;
  description: string;
  // icon?: React.ElementType; // Future: Pass specific icons from react-icons
}

const featureItems: FeatureItem[] = [
  {
    id: 1,
    name: "TestGen Suite",
    description: "Generate adaptive quizzes and mock exams from any material to master topics effectively.",
  },
  {
    id: 2,
    name: "Courses Platform",
    description: "Access a library of expertly crafted courses across various subjects, designed for deep understanding.",
  },
  {
    id: 3,
    name: "AI-Powered Tools",
    description: "Utilize smart summaries, flashcard generation, and concept explainers to boost your study efficiency.",
  },
  {
    id: 4,
    name: "AI Chat Studio (Lyra)",
    description: "Converse with Lyra, your personal AI tutor, for instant help and guided learning anytime.",
  },
  {
    id: 5,
    name: "Personalized Dashboards",
    description: "Track your progress, identify strengths and weaknesses, and get tailored recommendations.",
  },
  {
    id: 6,
    name: "Gamified Learning Paths",
    description: "Earn points, badges, and climb leaderboards as you achieve your learning milestones.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50"> {/* Slightly different background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark text-center mb-12 md:mb-16">
          Your All-In-One Learning Supercharger.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature) => (
            <div
              key={feature.id}
              className="bg-lyceum-bg-historic p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              {/* Icon Placeholder */}
              {/* TODO: Replace PlaceholderIcon with specific icons from react-icons
                  Example: import { FiZap, FiBookOpen, FiCpu, FiMessageSquare, FiTrendingUp, FiAward } from 'react-icons/fi';
              */}
              <PlaceholderIcon className="w-10 h-10 text-lyceum-primary-dark mb-3" />
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
