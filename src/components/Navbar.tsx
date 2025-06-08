'use client';

import { Link, type AppPathnames } from '@/navigation';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import Logo from './Logo'; // Import the new Logo component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#courses', label: t('courses') },
    { href: '#ai-chat', label: t('aiChat') },
  ];

  const authLinks: Array<{ href: AppPathnames; label: string }> = [
    { href: '/login', label: t('login') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-lyceum-blue shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto mr-2 text-lyceum-blue dark:text-lyceum-text-light" />
              <span className="font-serif text-2xl font-bold text-lyceum-blue dark:text-lyceum-text-light">
                {t('logoText')}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-lyceum-text-secondary dark:text-gray-300 hover:text-lyceum-accent-dark dark:hover:text-lyceum-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lyceum-text-secondary dark:text-gray-300 hover:text-lyceum-accent-dark dark:hover:text-lyceum-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup'}
              className="text-lyceum-blue bg-lyceum-accent hover:bg-lyceum-accent-dark font-semibold px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition-all"
            >
              {t('signUp')}
            </Link>
            <div className="text-lyceum-text-main dark:text-lyceum-text-light"> {/* Wrapper for ThemeSwitcher and LanguageSwitcher */}
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>

          <div className="md:hidden flex items-center">
             <div className="text-lyceum-text-main dark:text-lyceum-text-light"> {/* Wrapper for ThemeSwitcher and LanguageSwitcher */}
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-lyceum-blue dark:text-lyceum-text-light hover:text-lyceum-accent-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lyceum-accent p-2 rounded-md ml-2"
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
        <div className="md:hidden bg-white dark:bg-lyceum-blue" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-lyceum-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-lyceum-blue-light block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lyceum-text-secondary dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-lyceum-blue-light block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={'/signup'}
              className="bg-lyceum-accent text-lyceum-blue font-semibold block w-full text-center px-4 py-2 rounded-md text-base shadow-sm hover:shadow-md transition-all"
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