// src/components/VisualShowcaseSection.tsx
import Image from 'next/image'; // Using next/image for optimized images

const VisualShowcaseSection = () => {
  const mockups = [
    { id: 1, src: "/images/dashboard-placeholder.svg", alt: "Lyceum Dashboard Mockup" },
    { id: 2, src: "/images/testgen-placeholder.svg", alt: "Lyceum TestGen Interface Mockup" },
    { id: 3, src: "/images/ai-chat-placeholder.svg", alt: "Lyceum AI Chat Lyra Mockup" },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100"> {/* Different background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-lyceum-primary-dark text-center mb-12 md:mb-16">
          Experience the Lyceum Interface.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {mockups.map((mockup, index) => (
            <div
              key={mockup.id}
              className={`rounded-lg shadow-xl overflow-hidden ${
                // Slightly stagger or give prominence
                index === 1 ? 'md:scale-110 md:z-10' : 'opacity-90 hover:opacity-100'
              } transition-all duration-300`}
            >
              {/*
                Using next/image requires width and height.
                For placeholder.com URLs, we can extract them or use fixed values.
                For actual images, these would be the image's natural dimensions.
              */}
              <Image
                src={mockup.src}
                alt={mockup.alt}
                width={600} // Placeholder width
                height={400} // Placeholder height
                className="w-full h-auto object-cover"
              />
              {/* Placeholder SVGs are used. Ensure actual images have correct dimensions.
              <img
                src={mockup.src}
                alt={mockup.alt}
                className="w-full h-auto object-cover rounded-lg shadow-xl"
              />
              */}
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-8 font-sans">
          *Interface mockups are illustrative. Actual design may vary.*
        </p>
      </div>
    </section>
  );
};

export default VisualShowcaseSection;
