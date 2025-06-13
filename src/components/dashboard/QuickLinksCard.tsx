'use client';

import React from 'react';
// Image component is removed as 'icon' is now a generic string, not necessarily a path for next/image.
// If specific icon components (like Heroicons) were to be used, they would be imported here.

interface LinkItem {
  text: string;
  icon: string; // Assuming icon is a string, e.g., for a class name or a simple text symbol
}

interface Props {
  title: string;
  links: LinkItem[];
}

const QuickLinksCard: React.FC<Props> = ({ title, links }) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {links && links.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-grow"> {/* Added flex-grow */}
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => {}}
              className="flex flex-col items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {/* Basic icon rendering: displays the icon string.
                  This could be a placeholder for a class name e.g. <i className={link.icon}></i>
                  or an actual character if the icon string is a symbol.
              */}
              {link.icon && (
                <span className="text-2xl mb-1.5" role="img" aria-label="icon">{link.icon}</span>
              )}
              <span className="text-xs text-slate-50">{link.text}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 flex-grow flex items-center justify-center">
          No quick links available.
        </p>
      )}
    </div>
  );
};

export default QuickLinksCard;
