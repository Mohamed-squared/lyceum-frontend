// src/components/Navbar.tsx
'use client';

import { Link, type AppPathnames } from '@/navigation'; // Ensure Link is from @/navigation
import { useState, useEffect } from 'react'; // Import useEffect
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image'; // Import Next Image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navbar');
  const [logoPath, setLogoPath] = useState('/file.svg'); // Default logo

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
        // Keep default logo if fetch fails
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
    <nav className="sticky top-0 z-50 bg-slate-100 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
                 {/* Using next/image for the logo */}
                 <Image src={logoPath} alt="Lyceum Logo" width={32} height={32} className="h-8 w-auto mr-2" />
              <span className="font-serif text-2xl font-bold text-lyceum-primary-dark">
                {t('logoText')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links & Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-lyceum-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-lyceum-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup' as AppPathnames}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition-all"
            >
              {t('signUp')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher /> {/* Moved here for visibility next to menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-lyceum-primary-dark hover:text-lyceum-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lyceum-accent p-2 rounded-md ml-2" // Added ml-2 for spacing
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-lyceum-primary-dark block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-lyceum-primary-dark block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup' as AppPathnames}
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold block w-full text-center px-4 py-2 rounded-md text-base shadow-sm hover:shadow-md transition-all"
              onClick={() => setIsOpen(false)}
            >
              {t('signUp')}
            </Link>
            {/* LanguageSwitcher is not needed here again as it's in the header */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
