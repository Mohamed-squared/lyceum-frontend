// NEW FILE: src/components/Logo.tsx
import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor" // This makes the SVG theme-aware
      {...props}
    >
      {/* This path creates a stylized "L" that resembles a classical pillar. */}
      <path d="M20,15 L20,85 L75,85 L75,70 L35,70 L35,15 L20,15 Z" />
    </svg>
  );
};

export default Logo;
