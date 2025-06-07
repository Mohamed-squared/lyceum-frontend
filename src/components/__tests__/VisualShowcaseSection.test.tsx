// src/components/__tests__/VisualShowcaseSection.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import VisualShowcaseSection from '@/components/VisualShowcaseSection';

describe('VisualShowcaseSection', () => {
 const mockFetch = jest.fn(() =>
   Promise.resolve({
     ok: true,
     json: () => Promise.resolve({
       visualShowcase: {
         mockups: [
           { id: 1, src: "/mockup1.jpg", alt: "Mockup 1 Alt" },
           { id: 2, src: "/mockup2.jpg", alt: "Mockup 2 Alt" },
         ]
       }
     }),
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

  it('fetches and renders visual mockups', async () => {
    render(<VisualShowcaseSection />);

    expect(screen.getByText('Loading visuals...')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/assets.json');

    await waitFor(() => {
      expect(screen.getByAltText('Mockup 1 Alt')).toBeInTheDocument();
      expect(screen.getByAltText('Mockup 1 Alt')).toHaveAttribute('src', expect.stringContaining(encodeURIComponent("/mockup1.jpg")));
    });
    await waitFor(() => {
     expect(screen.getByAltText('Mockup 2 Alt')).toBeInTheDocument();
     expect(screen.getByAltText('Mockup 2 Alt')).toHaveAttribute('src', expect.stringContaining(encodeURIComponent("/mockup2.jpg")));
   });
    expect(screen.queryByText('Loading visuals...')).not.toBeInTheDocument();
  });

  it('displays an error message if fetching assets fails', async () => {
     mockFetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));
     render(<VisualShowcaseSection />);

     await waitFor(() => {
       expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
     });
     expect(screen.queryByText('Loading visuals...')).not.toBeInTheDocument();
  });
});
