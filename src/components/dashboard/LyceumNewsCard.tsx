// src/components/dashboard/LyceumNewsCard.tsx
import React from 'react';

interface NewsItem {
  title: string;
  excerpt: string;
  link: string;
  // 'time' was in the original hardcoded data, but not in the new prop spec.
  // If time is still needed, it should be added to the NewsItem interface and translation files.
}

interface Props {
  title: string;
  newsItems: NewsItem[];
  loadingMessage: string; // Not used in this static version, but good for future state
  errorMessage: string;   // Not used in this static version
}

const LyceumNewsCard: React.FC<Props> = ({
  title,
  newsItems,
  loadingMessage, // Placeholder for if news were fetched client-side
  errorMessage,   // Placeholder for if news fetching failed
}) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {newsItems && newsItems.length > 0 ? (
        <ul className="space-y-3">
          {newsItems.map((item, index) => (
            <li key={index} className="text-sm text-slate-300">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <strong className="block">{item.title}</strong>
              </a>
              <p className="text-xs text-slate-400">{item.excerpt}</p>
              {/* If 'time' or other properties are needed, they would go here */}
            </li>
          ))}
        </ul>
      ) : (
        // Display a message if there are no news items, or use loading/error messages if applicable
        <p className="text-sm text-slate-400">{loadingMessage}</p> // Or a specific "no news" message
      )}
    </div>
  );
};

export default LyceumNewsCard;
