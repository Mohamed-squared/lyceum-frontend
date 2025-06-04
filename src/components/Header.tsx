'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react'; // Icons

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const params = useParams();
  const currentLocale = params.locale as string;
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
    // The layout should handle dir attribute based on i18n.language or newLocale
    // document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'; // This can also be managed in layout.tsx based on locale
  };

  const navLinks = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/courses', labelKey: 'nav.courses' },
    { href: '/about', labelKey: 'nav.about' },
    { href: '/support', labelKey: 'nav.support' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white-glass backdrop-blur-xs shadow-md dark:bg-black-glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="text-2xl font-playfair font-bold text-gray-800 dark:text-white hover:text-gold transition-colors">
            {t('appName')}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={`/${currentLocale}${link.href === '/' ? '' : link.href}`}
                className="text-gray-700 dark:text-gray-300 hover:text-gold dark:hover:text-gold relative group transition-colors duration-300"
              >
                <span>{t(link.labelKey)}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and Language Switcher (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => changeLanguage(currentLocale === 'en' ? 'ar' : 'en')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gold dark:hover:text-gold transition-colors"
              aria-label={t(currentLocale === 'en' ? 'switchToArabic' : 'switchToEnglish', { ns: 'common', defaultValue: 'Switch Language' })}
            >
              <Globe size={20} />
              <span className="ml-1 text-sm font-medium">
                {currentLocale === 'en' ? t('langSwitcher.ar', {defaultValue: 'AR'}) : t('langSwitcher.en', {defaultValue: 'EN'})}
              </span>
            </button>
            <Link
              href={`/${currentLocale}/login`}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700 transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href={`/${currentLocale}/signup`}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {t('nav.signup')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => changeLanguage(currentLocale === 'en' ? 'ar' : 'en')}
              className="p-2 mr-2 text-gray-700 dark:text-gray-300 hover:text-gold dark:hover:text-gold transition-colors"
              aria-label={t(currentLocale === 'en' ? 'switchToArabic' : 'switchToEnglish', { ns: 'common', defaultValue: 'Switch Language' })}
            >
              <Globe size={20} />
               <span className="ml-1 text-sm font-medium">
                {currentLocale === 'en' ? t('langSwitcher.ar', {defaultValue: 'AR'}) : t('langSwitcher.en', {defaultValue: 'EN'})}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gold dark:hover:text-gold"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide-in) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg pb-4">
          <nav className="flex flex-col space-y-2 px-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.labelKey}`}
                href={`/${currentLocale}${link.href === '/' ? '' : link.href}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gold dark:hover:text-gold transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <Link
              href={`/${currentLocale}/login`}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700 transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href={`/${currentLocale}/signup`}
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {t('nav.signup')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
