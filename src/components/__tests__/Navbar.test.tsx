// src/components/__tests__/Navbar.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';
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

// Define the expected structure for the logo asset
interface LogoAsset {
  logo: {
    main: string;
  };
}

describe('Navbar', () => {
  // Type the mock fetch function explicitly
  const mockFetch = jest.fn((): Promise<Response> => // Explicitly return Promise<Response>
     Promise.resolve({
       ok: true,
       json: () => Promise.resolve<LogoAsset>({ logo: { main: "/test-logo.svg" } }),
       status: 200,
       statusText: "OK",
       headers: new Headers(),
       redirected: false,
       type: 'basic',
       url: '',
       clone: function (): Response {
         return this;
       },
       body: null,
       bodyUsed: false,
       arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
       blob: () => Promise.resolve(new Blob()),
       formData: () => Promise.resolve(new FormData()),
       text: () => Promise.resolve(''),
     } as Response) // Cast to Response
   );

  let originalFetch: typeof global.fetch;

  beforeEach(() => {
     originalFetch = global.fetch;
     global.fetch = mockFetch as jest.MockedFunction<typeof global.fetch>; // Cast mockFetch to the expected type
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
