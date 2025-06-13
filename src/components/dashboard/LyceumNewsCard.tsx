import React from 'react';

const LyceumNewsCard: React.FC = () => {
  const newsItems = [
    { text: "New Course Released: Advanced Calculus", time: "2 hours ago" },
    { text: "Community Event: Study Group this Friday", time: "1 day ago" },
    { text: "Platform Update: New Dashboard Live!", time: "3 days ago" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lyceum News</h3>
      <ul className="space-y-3">
        {newsItems.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
            <span>{item.text}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LyceumNewsCard;
