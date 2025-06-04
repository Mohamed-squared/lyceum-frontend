// src/components/WhyLyceumSection.tsx

// import { FaCircle } from "react-icons/fa"; // Placeholder Icon
import { FaCircle as PlaceholderIcon } from "react-icons/fa"; // Using FaCircle as a generic placeholder

interface ProblemSolutionItem {
  id: number;
  problem: string;
  solution: string;
  // icon?: React.ElementType; // Future: Pass specific icons from react-icons
}

const problemSolutionItems: ProblemSolutionItem[] = [
  {
    id: 1,
    problem: "Ineffective Cramming",
    solution: "Lyceum offers targeted practice with TestGen, ensuring you understand concepts deeply, not just memorize.",
  },
  {
    id: 2,
    problem: "Passive Studying",
    solution: "Engage actively with AI-powered tools and interactive courses that adapt to your learning style.",
  },
  {
    id: 3,
    problem: "Lack of Personalization",
    solution: "Our platform tailors learning paths and content, focusing on your specific needs and goals.",
  },
];

const WhyLyceumSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark text-center mb-12 md:mb-16">
          Tired of One-Size-Fits-All Learning?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
          {problemSolutionItems.map((item) => (
            <div key={item.id} className="p-6">
              {/* Icon Placeholder */}
              {/* TODO: Replace PlaceholderIcon with specific icons from react-icons later
                  Example: import { FaBrain, FaUserClock, FaBullseye } from 'react-icons/fa';
                  Then use <FaBrain className="w-12 h-12 text-lyceum-accent mb-4 mx-auto" />
              */}
              <PlaceholderIcon className="w-12 h-12 text-lyceum-accent mb-4 mx-auto" />
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark mb-2">
                {item.problem}
              </h3>
              <p className="text-gray-600 font-sans">
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLyceumSection;
