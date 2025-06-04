// src/components/Navbar.tsx
'use client'; // Needed for useState for mobile menu

import Link from 'next/link';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi'; // Using Heroicons for menu icons

// Placeholder for a logo icon (e.g., a stylized quill or laurel wreath)
const LogoIconPlaceholder = () => (
  <svg
    className="w-8 h-8 mr-2 text-lyceum-primary-dark"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Replace with actual SVG path for a quill or laurel wreath */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.25278C12 6.25278 15.5346 3 19.5 3C23.4654 3 24 6.48794 24 10.0828C24 13.6777 20.9598 17.0079 19.5 18.5L12 21L4.5 18.5C3.04019 17.0079 0 13.6777 0 10.0828C0 6.48794 0.534561 3 4.5 3C8.46544 3 12 6.25278 12 6.25278Z"
    />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#courses', label: 'Courses' },
    { href: '#ai-chat', label: 'AI Chat' },
  ];

  const authLinks = [
    { href: '/login', label: 'Login' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-100 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* <LogoIconPlaceholder /> */} {/* Uncomment if you have a logo SVG */}
              <span className="font-serif text-2xl font-bold text-lyceum-primary-dark">
                Lyceum
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
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
              href="/signup"
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-lyceum-primary-dark hover:text-lyceum-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lyceum-accent p-2 rounded-md"
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
              href="/signup"
              className="bg-lyceum-accent hover:bg-yellow-600 text-lyceum-primary-dark font-semibold block w-full text-center px-4 py-2 rounded-md text-base shadow-sm hover:shadow-md transition-all"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
