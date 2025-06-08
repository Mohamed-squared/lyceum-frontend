'use client';

// Imports are simplified: useEffect is no longer needed for the logo.
import { Link, type AppPathnames } from '@/navigation';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');

  // The useState and useEffect for logoPath have been completely removed.

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#courses', label: t('courses') },
    { href: '#ai-chat', label: t('aiChat') },
  ];

  const authLinks: Array<{ href: AppPathnames; label: string }> = [
    { href: '/login', label: t('login') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-100 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* THE FIX: The src prop is now a simple, static string. */}
              {/* It starts with '/' to reference the root of the `public` directory. */}
              <Image src="/globe.svg" alt="Lyceum Logo" width={32} height={32} className="h-8 w-auto mr-2" />
              <span className="font-serif text-2xl font-bold text-lyceum-primary-dark dark:text-white">
                {t('logoText')}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-lyceum-primary-dark dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-lyceum-primary-dark dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup'}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark dark:text-gray-900 font-semibold px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition-all"
            >
              {t('signUp')}
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-lyceum-primary-dark dark:text-gray-200 hover:text-lyceum-accent dark:hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lyceum-accent p-2 rounded-md ml-2"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenuAlt3 className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-100 dark:bg-gray-800" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-lyceum-primary-dark dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-lyceum-primary-dark dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup'}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark dark:text-gray-900 font-semibold block w-full text-center px-4 py-2 rounded-md text-base shadow-sm hover:shadow-md transition-all"
              onClick={() => setIsOpen(false)}
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;