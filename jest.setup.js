// jest.setup.js
import '@testing-library/jest-dom'
// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/', // Default mock pathname
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
 Promise.resolve({
   ok: true,
   json: () => Promise.resolve({
     visualShowcase: {
       mockups: [
         { id: 1, src: "https://via.placeholder.com/600x400/1A3A5A/FFFFFF?text=Dashboard+View", alt: "Lyceum Dashboard Mockup" },
       ]
     },
     logo: {
       main: "/file.svg"
     }
   }),
 })
);
