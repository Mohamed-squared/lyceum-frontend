// UPDATED FILE: src/components/Footer.tsx
import React from 'react';
import { Link, type AppPathnames } from '@/navigation'; // Ensure Link is from @/navigation

// Define the structure for a single link
interface FooterLinkItem {
  label: string;
  href: AppPathnames; // Use the strict AppPathnames type
}

// Define the structure for a section of links
interface LinkSection {
  title: string;
  links: FooterLinkItem[];
}

const footerLinks: LinkSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      // Add other company links here, ensuring href is a valid AppPathname
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      // Add other legal links here
    ],
  },
  // Add more sections as needed
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                {section.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-1">
            {/* Potentially add a newsletter signup or other content here */}
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-300">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p
            {/* Add form here */}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} Your Company, Inc. All rights reserved.
          </p>
          {/* Social media links can go here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
