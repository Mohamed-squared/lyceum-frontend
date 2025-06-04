// src/components/HowItWorksSection.tsx

interface StepItem {
  id: number;
  number: string; // Could be a string like "1." or a component for an icon
  title: string;
  description: string;
}

const stepItems: StepItem[] = [
  {
    id: 1,
    number: "1.",
    title: "Sign Up & Personalize",
    description: "Create your free account and tell us your learning goals to tailor your Lyceum experience.",
  },
  {
    id: 2,
    number: "2.",
    title: "Explore & Learn",
    description: "Dive into AI-generated tests, interactive courses, and utilize our smart study tools at your own pace.",
  },
  {
    id: 3,
    number: "3.",
    title: "Achieve & Grow",
    description: "Track your progress, master new skills, and unlock your full academic potential with Lyceum.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark text-center mb-12 md:mb-16">
          Embark on Your Learning Journey in 3 Steps.
        </h2>
        {/*
          Visual Cue Comment:
          ------------------------------------------------------------------------------------
          | TODO: Consider adding subtle lines or arrows connecting steps for desktop view.  |
          | This might require more complex CSS, ::before/::after pseudo-elements, or SVGs.  |
          | For example, a dotted line could run between the items above a certain breakpoint. |
          ------------------------------------------------------------------------------------
        */}
        <div className="flex flex-col md:flex-row justify-between items-start md:space-x-8">
          {stepItems.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center text-center md:items-start md:text-left mb-8 md:mb-0"
            >
              {/* Step Number/Icon Placeholder */}
              {/* TODO: Replace step.number text with a styled circle or an icon if desired
                  Example: <div className="bg-lyceum-accent text-lyceum-primary-dark w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mb-4">{step.number}</div>
              */}
              <div className="text-3xl font-bold text-lyceum-accent mb-3">
                {step.number}
              </div>
              <h3 className="text-xl font-sans font-semibold text-lyceum-primary-dark mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
