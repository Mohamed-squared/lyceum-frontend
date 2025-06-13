// src/components/dashboard/InspirationalQuoteCard.tsx
import React from 'react';

const InspirationalQuoteCard = () => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">Quote of the Day</h3>
        <button className="text-sm text-slate-400 hover:text-slate-200">
          Refresh
        </button>
      </div>
      <blockquote className="text-lg italic text-slate-300 mb-2 flex-grow">
        "The only true wisdom is in knowing you know nothing."
      </blockquote>
      <p className="text-sm text-slate-400 text-right">– Socrates</p>
    </div>
  );
};

export default InspirationalQuoteCard;
