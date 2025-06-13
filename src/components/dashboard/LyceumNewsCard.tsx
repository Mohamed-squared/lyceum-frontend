// src/components/dashboard/LyceumNewsCard.tsx
import React from 'react';

interface NewsItem {
  text: string;
  time: string;
}

interface Props {
  title: string;
  items: NewsItem[];
}

const LyceumNewsCard = ({ title, items }: Props) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="space-y-3 flex-grow"> {/* Added flex-grow here */}
          {items.map((item, index) => (
            <li key={index} className="text-sm text-slate-300 border-b border-slate-700 pb-2 mb-2">
              <p className="font-medium text-slate-200">{item.text}</p>
              <small className="text-xs text-slate-400">{item.time}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 flex-grow flex items-center justify-center">No news items available.</p>
      )}
    </div>
  );
};

export default LyceumNewsCard;
