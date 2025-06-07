// src/components/__tests__/VisualShowcaseSection.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import VisualShowcaseSection from '../VisualShowcaseSection';

// Define types for the data structure
interface MockupData {
  id: number;
  src: string;
  alt: string;
}

interface ShowcaseAssets {
  visualShowcase: {
    mockups: MockupData[];
  };
}

describe('VisualShowcaseSection', () => {
  const mockFetch = jest.fn((): Promise<Response> =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve<ShowcaseAssets>({
        visualShowcase: {
          mockups: [
            { id: 1, src: "/mockup1.jpg", alt: "Mockup 1 Alt" },
            { id: 2, src: "/mockup2.jpg", alt: "Mockup 2 Alt" },
          ]
        }
      }),
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
    } as Response)
  );

  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = mockFetch as jest.MockedFunction<typeof global.fetch>; // Cast mockFetch
    mockFetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch; // Restore original fetch
  });

  it('fetches and renders visual mockups', async () => {
    render(<VisualShowcaseSection />);

    expect(screen.getByText('Loading visuals...')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/assets.json');

    await waitFor(() => {
      expect(screen.getByAltText('Mockup 1 Alt')).toBeInTheDocument();
      // Using stringContaining for src due to potential Next.js image optimization prefixes
      expect(screen.getByAltText('Mockup 1 Alt').getAttribute('src')).toEqual(expect.stringContaining("mockup1.jpg"));
    });
    await waitFor(() => {
     expect(screen.getByAltText('Mockup 2 Alt')).toBeInTheDocument();
     expect(screen.getByAltText('Mockup 2 Alt').getAttribute('src')).toEqual(expect.stringContaining("mockup2.jpg"));
   });
    expect(screen.queryByText('Loading visuals...')).not.toBeInTheDocument();
  });

  it('displays an error message if fetching assets fails', async () => {
     // Type the mock implementation
     mockFetch.mockImplementationOnce((): Promise<Response> => Promise.reject(new Error("Fetch failed")));
     render(<VisualShowcaseSection />);

     await waitFor(() => {
       expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
     });
     expect(screen.queryByText('Loading visuals...')).not.toBeInTheDocument();
  });
});
