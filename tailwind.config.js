// FILE: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define a new, vibrant color palette for the Lyceum brand
        'lyceum-blue': {
          DEFAULT: '#0D2447', // A deep, professional blue
          light: '#1A3A6D',
        },
        'lyceum-accent': {
          DEFAULT: '#FBBF24', // A vibrant, warm gold/yellow
          dark: '#F59E0B',
        },
        'lyceum-text': {
          main: '#1F2937',      // For main text in light mode
          secondary: '#4B5563', // For secondary text in light mode
          light: '#F3F4F6',      // For main text in dark mode
        },
      }
    },
  },
  plugins: [],
};
