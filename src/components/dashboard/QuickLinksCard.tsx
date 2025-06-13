import React from 'react';
import Image from 'next/image'; // Import next/image

const QuickLinksCard: React.FC = () => {
  const links = [
    { href: "#", label: "Generate Test", iconPlaceholder: "icon-test.svg" },
    { href: "#", label: "Browse Courses", iconPlaceholder: "icon-courses.svg" },
    { href: "#", label: "AI Chat Studio", iconPlaceholder: "icon-chat.svg" },
    { href: "#", label: "My Courses", iconPlaceholder: "icon-my-courses.svg" },
    { href: "#", label: "Leaderboard", iconPlaceholder: "icon-leaderboard.svg" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {/* Placeholder for Next/Image component.
                Replace div with Image when icons are available.
                Example: <Image src={`/assets/icons/${link.iconPlaceholder}`} alt={link.label} width={32} height={32} />
            */}
            <div className="w-8 h-8 mb-2 bg-gray-300 dark:bg-gray-500 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
              {link.iconPlaceholder.substring(0,4)}
            </div>
            <span className="text-sm text-center text-gray-700 dark:text-gray-200">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksCard;
