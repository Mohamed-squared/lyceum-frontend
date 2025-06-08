// FINAL CORRECTED CODE for: src/components/Navbar.tsx
'use client';

import { Link } from '@/navigation';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#courses', label: t('courses') },
    { href: '#ai-chat', label: t('aiChat') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-lyceum-blue shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto mr-3 text-lyceum-blue dark:text-lyceum-text-light" />
              <span className="font-serif text-2xl font-bold text-lyceum-blue dark:text-lyceum-text-light">
                {t('logoText')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-lyceum-text-secondary dark:text-gray-300 hover:text-lyceum-accent-dark dark:hover:text-lyceum-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* THIS IS THE FIX: All right-side items are in one flex container */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-lyceum-text-secondary dark:text-gray-300 hover:text-lyceum-accent-dark dark:hover:text-lyceum-accent">
              {t('login')}
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-semibold text-lyceum-blue bg-lyceum-accent hover:bg-lyceum-accent-dark transition-colors">
              {t('signUp')}
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-lyceum-blue dark:text-lyceum-text-light hover:text-lyceum-accent-dark focus:outline-none p-2 rounded-md ml-2" aria-controls="mobile-menu" aria-expanded={isOpen}>
              {isOpen ? <HiX className="block h-6 w-6" /> : <HiMenuAlt3 className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (already well-structured) */}
      {isOpen && (
         <div className="md:hidden bg-white dark:bg-lyceum-blue" id="mobile-menu">
          {/* Mobile menu code from the issue description, which remains the same */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-lyceum-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-lyceum-blue-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div className="flex justify-between items-center px-3 py-2">
              <span className="font-medium text-lyceum-text-main dark:text-lyceum-text-light">Theme</span>
              <ThemeSwitcher />
            </div>
            <div className="flex justify-between items-center px-3 py-2">
              <span className="font-medium text-lyceum-text-main dark:text-lyceum-text-light">Language</span>
              <LanguageSwitcher />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-lyceum-text-secondary dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-lyceum-blue-light" onClick={() => setIsOpen(false)}>{t('login')}</Link>
            <Link href="/signup" className="block w-full text-center bg-lyceum-accent text-lyceum-blue font-semibold px-3 py-2 rounded-md text-base" onClick={() => setIsOpen(false)}>{t('signUp')}</Link>
          </div>
         </div>
      )}
    </nav>
  );
};

export default Navbar;