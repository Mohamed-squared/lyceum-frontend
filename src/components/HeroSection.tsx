// src/components/HeroSection.tsx
import Link from 'next/link';

const HeroSection = () => {
  return (
    // Using a light cream background as a base, can be customized
    // For a gradient, you could use: bg-gradient-to-br from-lyceum-bg-historic to-slate-200
    <section className="bg-lyceum-bg-historic text-center py-20 md:py-32 hero-background-placeholder">
      {/* Visual Placeholder Comment:
          -----------------------------------------------------------------------------
          | TODO: Abstract background image/illustration or product mockup here.      |
          | Example: Could be a subtle geometric pattern, a stylized neural network,  |
          | or a faint depiction of classical architecture mixed with modern elements.|
          -----------------------------------------------------------------------------
      */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-lyceum-primary-dark mb-6">
          Master Any Subject. <br className="hidden md:block" />
          Your AI-Powered Learning Odyssey Begins.
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-sans max-w-2xl mx-auto mb-10">
          Lyceum combines intelligent test generation, AI-driven study tools,
          and immersive courses to personalize your path to academic excellence
          and lifelong learning.
        </p>
        <Link
          href="/signup" // Or a more specific onboarding page like /start-free
          className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold px-8 py-4 rounded-lg text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          Start Learning Free
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
