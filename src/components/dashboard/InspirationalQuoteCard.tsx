'use client';

// src/components/dashboard/InspirationalQuoteCard.tsx
import React, { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

interface Props {
  title: string;
  loadingMessage: string;
  errorMessage: string;
  // Assuming the initial quote can be passed as props,
  // or the component fetches it. For now, let's allow it via props.
  initialQuote?: Quote;
}

const InspirationalQuoteCard: React.FC<Props> = ({
  title,
  loadingMessage,
  errorMessage,
  initialQuote,
}) => {
  // State for the quote, to allow for refresh functionality
  const [quote, setQuote] = useState<Quote | null>(initialQuote || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialQuote);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for a fetchQuote function
  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Replace with actual quote fetching logic
    // For now, let's use a static list and pick one randomly
    const quotes: Quote[] = [
      { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
      { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
      { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
      { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" }
    ];
    try {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    } catch (e) {
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!initialQuote) {
      fetchQuote();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuote]); // Removed fetchQuote from dependency array as it's stable

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button
          onClick={fetchQuote}
          className="text-sm text-slate-400 hover:text-slate-200"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {isLoading && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-300">{loadingMessage}</p>
        </div>
      )}
      {error && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      {!isLoading && !error && quote && (
        <>
          <blockquote className="text-lg italic text-slate-300 mb-2 flex-grow">
            "{quote.text}"
          </blockquote>
          <p className="text-sm text-slate-400 text-right">– {quote.author}</p>
        </>
      )}
      {!isLoading && !error && !quote && (
         <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-300">No quote available.</p> {/* Fallback if no initial quote and fetch fails */}
        </div>
      )}
    </div>
  );
};

export default InspirationalQuoteCard;
