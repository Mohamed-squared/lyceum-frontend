'use client';

import React from 'react';

interface Props {
  title: string;
  quote: string;
  author: string;
  buttonText: string;
}

const InspirationalQuoteCard = ({ title, quote, author, buttonText }: Props) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {quote && author ? (
        <>
          <blockquote className="my-2 p-2 border-l-4 border-gray-600 flex-grow">
            <p className="italic text-lg text-slate-300">"{quote}"</p>
            <cite className="block text-right text-sm text-slate-400">- {author}</cite>
          </blockquote>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-300">No quote available.</p>
        </div>
      )}
      <button
        onClick={() => console.log('Refresh clicked for InspirationalQuoteCard')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 self-start"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default InspirationalQuoteCard;
