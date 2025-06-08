import React from 'react';

// This component contains the inline SVG for the final Lyceum logo.
// The `fill="currentColor"` attribute on the parent <svg> tag allows
// Tailwind's text color classes to control the logo's color, making it
// fully compatible with light and dark modes.
const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96" // A viewBox that precisely matches the logo's proportions
      fill="currentColor"
      {...props}
    >
      {/* This single, complex path renders the entire logo for maximum performance. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M62.5,23.1c0,5.6-4.5,10.1-10.1,10.1c-2.4,0-4.6-0.8-6.4-2.2c-0.3,0-0.6-0.1-0.9-0.1c-5.6,0-10.1-4.5-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1c0.3,0,0.6,0,0.9-0.1c1.8-1.4,4-2.2,6.4-2.2C58,10.6,62.5,15.1,62.5,23.1z M52.4,26.4c2.8,0,5.1-2.3,5.1-5.1s-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1S49.6,26.4,52.4,26.4z M17.2,23.1c0,5.6,4.5,10.1,10.1,10.1c2.4,0,4.6-0.8,6.4-2.2c0.3,0,0.6-0.1,0.9-0.1c5.6,0,10.1-4.5,10.1-10.1c0-5.6-4.5-10.1-10.1-10.1c-0.3,0-0.6,0-0.9-0.1c-1.8-1.4-4-2.2-6.4-2.2C21.7,10.6,17.2,15.1,17.2,23.1z M27.3,26.4c2.8,0,5.1-2.3,5.1-5.1s-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1S24.5,26.4,27.3,26.4z M59.2,38.3h-40v7.5h40V38.3z M25.7,50.8h7.5v28.8h-7.5V50.8z M41.2,50.8h7.5v28.8h-7.5V50.8z M56.7,50.8h4.5v-3l12.8-6.4v-4.5l-12.8-6.4v-3h-4.5V50.8z M81.7,56.7l-16-8v-2.3l16-8v-4.5l-21,10.5v9l21,10.5V56.7z M88.4,70.2c2.8,0,5.1-2.3,5.1-5.1c0-2.8-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1C83.3,67.9,85.6,70.2,88.4,70.2z M88.4,48.2c2.8,0,5.1-2.3,5.1-5.1s-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1S85.6,48.2,88.4,48.2z M88.4,26.3c2.8,0,5.1-2.3,5.1-5.1c0-2.8-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1C83.3,24,85.6,26.3,88.4,26.3z M10.6,85.4c0-2.8,2.3-5.1,5.1-5.1c0.4,0,0.9,0.1,1.3,0.2c-2,3.3-0.7,7.7,2.9,9.6c3.2,1.7,7,1.2,9.6-1.7c0.8,0.4,1.7,0.7,2.7,0.7c5.6,0,10.1-4.5,10.1-10.1v-2.1h7.5v2.1c0,5.6,4.5,10.1,10.1,10.1c5.6,0,10.1-4.5,10.1-10.1v-5.6H10.6V85.4z"
      />
    </svg>
  );
};

export default Logo;