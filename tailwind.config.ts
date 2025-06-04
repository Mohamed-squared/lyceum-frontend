import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        opensans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        gold: '#FFD700',
        bronze: '#CD7F32',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundColor: {
        'white-glass': 'rgba(255, 255, 255, 0.2)',
        'black-glass': 'rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
