// src/components/FinalCTASection.tsx
import { Link } from '@/navigation';

const FinalCTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-lyceum-bg-historic"> {/* Using historic bg for a soft touch */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-lyceum-primary-dark mb-8">
          Ready to Revolutionize Your Learning?
        </h2>
        <Link
          href="/signup"
          className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold px-10 py-4 sm:px-12 sm:py-5 rounded-lg text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 d-inline-block"
        >
          Sign Up Now - It&apos;s Free!
        </Link>
      </div>
    </section>
  );
};

export default FinalCTASection;
