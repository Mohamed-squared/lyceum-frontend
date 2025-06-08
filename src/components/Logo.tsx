// FINAL CORRECTED CODE for: src/components/Logo.tsx
import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100" // A 100x100 canvas for our design
      fill="currentColor" // This makes the SVG theme-aware
      {...props}
    >
      {/* This path creates a stylized "L" that better matches the final design. */}
      <path d="M20,15 h40 v15 h-25 v40 h40 v15 h-55 Z" />
    </svg>
  );
};

export default Logo;
