// FILE: src/components/Navbar.tsx
'use client';

import { Link, type AppPathnames } from '@/navigation';
import { useState, useEffect } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar'); // Corrected namespace
  const [logoPath, setLogoPath] = useState('public/file.svg');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/assets.json');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        if (data.logo && data.logo.main) {
          setLogoPath(data.logo.main);
        }
      } catch (error) {
        console.error("Error fetching logo asset:", error);
      }
    };
    fetchAssets();
  }, []);

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#courses', label: t('courses') },
    { href: '#ai-chat', label: t('aiChat') },
  ];

  const authLinks: Array<{ href: AppPathnames; label: string }> = [
    { href: '/login', label: t('login') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-100 dark:bg-gray-800 shadow-md"> {/* Dark mode background for nav */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src={logoPath} alt="Lyceum Logo" width={32} height={32} className="h-8 w-auto mr-2" />
              <span className="font-serif text-2xl font-bold text-lyceum-primary-dark dark:text-white"> {/* Dark mode text for logo */}
                {t('logoText')}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-lyceum-primary-dark dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors" // Dark mode text and hover for nav links
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-lyceum-primary-dark dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors" // Dark mode text and hover for auth links
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup' as AppPathnames}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark dark:text-gray-900 font-semibold px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition-all" // Dark mode text for sign up
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
              className="text-lyceum-primary-dark dark:text-gray-200 hover:text-lyceum-accent dark:hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lyceum-accent p-2 rounded-md ml-2" // Dark mode for mobile menu button
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
        <div className="md:hidden bg-slate-100 dark:bg-gray-800" id="mobile-menu"> {/* Dark mode for mobile menu container */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-lyceum-primary-dark dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors" // Dark mode for mobile nav links
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-lyceum-primary-dark dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors" // Dark mode for mobile auth links
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup' as AppPathnames}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark dark:text-gray-900 font-semibold block w-full text-center px-4 py-2 rounded-md text-base shadow-sm hover:shadow-md transition-all" // Dark mode for mobile sign up
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
