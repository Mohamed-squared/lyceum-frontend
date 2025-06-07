// src/components/__tests__/Navbar.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider } from 'next-intl';

// Define a more specific type for messages
interface NavbarMessages {
  navbar: {
    features: string;
    courses: string;
    aiChat: string;
    login: string;
    signUp: string;
    logoText: string;
  };
}

// Minimal messages for testing
const messages: NavbarMessages = {
  navbar: {
    features: "Features",
    courses: "Courses",
    aiChat: "AI Chat",
    login: "Login",
    signUp: "Sign Up",
    logoText: "Lyceum"
  }
};

describe('Navbar', () => {
  // Mock global.fetch for this test suite
  const mockFetch = jest.fn(() =>
     Promise.resolve({
       ok: true,
       json: () => Promise.resolve({ logo: { main: "/test-logo.svg" } }),
     })
   );

  let originalFetch: any;

  beforeEach(() => {
     originalFetch = global.fetch;
     global.fetch = mockFetch;
     mockFetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders navigation links and fetches logo', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Navbar />
      </NextIntlClientProvider>
    );

    // Check for translated texts
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Lyceum')).toBeInTheDocument(); // Logo text

    // Check that fetch was called for assets.json
    expect(mockFetch).toHaveBeenCalledWith('/assets.json');

    // Check if the logo image is rendered (src might be tricky due to state update)
    await waitFor(() => {
      const logoImage = screen.getByAltText('Lyceum Logo');
      expect(logoImage).toBeInTheDocument();
      // Check if the src attribute contains the path of the test logo
      // It might be prefixed by http://localhost or similar in test env
      expect(logoImage).toHaveAttribute('src', expect.stringContaining(encodeURIComponent("/test-logo.svg")));
    });
  });
});
