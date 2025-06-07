// src/components/VisualShowcaseSection.tsx
'use client'; // Add 'use client' if not already there

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Define an interface for the mockup data
interface Mockup {
  id: number;
  src: string;
  alt: string;
}

const VisualShowcaseSection = () => {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/assets.json'); // Path relative to public directory
        if (!response.ok) {
          throw new Error(`Failed to fetch assets: ${response.statusText}`);
        }
        const data = await response.json();
        setMockups(data.visualShowcase.mockups);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error("Error fetching visual showcase assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark text-center mb-12 md:mb-16">
          Experience the Lyceum Interface.
        </h2>
        {loading && <p className="text-center">Loading visuals...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {mockups.map((mockup, index) => (
              <div
                key={mockup.id}
                className={`rounded-lg shadow-xl overflow-hidden ${
                  index === 1 ? 'md:scale-110 md:z-10' : 'opacity-90 hover:opacity-100'
                } transition-all duration-300`}
              >
                <Image
                  src={mockup.src}
                  alt={mockup.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority={index < 3} // Prioritize loading for above-the-fold or critical images
                />
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-gray-500 mt-8 font-sans">
          *Interface mockups are illustrative. Actual design may vary.*
        </p>
      </div>
    </section>
  );
};

export default VisualShowcaseSection;
