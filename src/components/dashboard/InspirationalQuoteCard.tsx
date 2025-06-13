import React from 'react';

const InspirationalQuoteCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Quote of the Day</h3>
      <blockquote className="text-lg italic font-serif text-gray-700 dark:text-gray-300 my-4 p-4 border-l-4 border-gray-300 dark:border-gray-600">
        "The only true wisdom is in knowing you know nothing."
      </blockquote>
      <p className="text-right text-gray-600 dark:text-gray-400 mb-4">– Socrates</p>
      <button className="absolute top-4 right-4 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 rounded">
        Refresh
      </button>
    </div>
  );
};

export default InspirationalQuoteCard;
