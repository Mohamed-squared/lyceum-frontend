// src/components/Footer.tsx
import { Link } from '@/navigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  return (
    <footer className="bg-slate-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-500 font-sans mb-4 md:mb-0">
            &copy; {currentYear} Lyceum. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-lyceum-primary-dark font-sans transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
