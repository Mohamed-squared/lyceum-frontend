import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans Placeholder', 'sans-serif'],
        mono: ['Geist Mono Placeholder', 'monospace'],
      },
      colors: { // Added from original observation of Lyceum specific colors (conceptual)
        'lyceum-primary': '#1A3A5A', // Deep Blue
        'lyceum-primary-dark': '#0F283E', // Darker Blue
        'lyceum-accent': '#FFD700', // Gold/Yellow
        'lyceum-bg-historic': '#FAF0E6', // Light Cream / Parchment
        'lyceum-light': '#F0F4F8', // Light Grey-Blue
        'lyceum-text-primary': '#171717', // Nearly Black for text
        'lyceum-text-secondary': '#525252', // Medium Gray for less emphasis text
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
