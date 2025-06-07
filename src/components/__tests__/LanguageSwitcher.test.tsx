// src/components/__tests__/LanguageSwitcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useRouter } from 'next/navigation'; // Import from the actual path

// Mock next/navigation specifically for this test file if needed, or rely on global mock
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
//   usePathname: jest.fn().mockReturnValue('/'),
// }));

describe('LanguageSwitcher', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    // Reset window.location.pathname for each test if necessary
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/'
      },
      writable: true
    });
  });

  afterEach(() => {
     mockPush.mockClear();
  });

  it('renders language buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
    expect(screen.getByText('Türkçe')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('calls router.push with correct locale when a language button is clicked (from root)', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText('Deutsch'));
    expect(mockPush).toHaveBeenCalledWith('/de'); // Updated expectation based on refined logic
  });

  it('calls router.push with correct locale when changing from an existing locale path', () => {
     Object.defineProperty(window, 'location', {
       value: { pathname: '/en/some/page' },
       writable: true
     });
     render(<LanguageSwitcher />);
     fireEvent.click(screen.getByText('العربية'));
     expect(mockPush).toHaveBeenCalledWith('/ar/some/page');
   });

  it('calls router.push with correct locale and preserves trailing slash', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/en/some/page/' },
      writable: true
    });
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText('Deutsch'));
    expect(mockPush).toHaveBeenCalledWith('/de/some/page/');
  });
});
