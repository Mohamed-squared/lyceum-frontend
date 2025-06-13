// src/components/dashboard/LyceumNewsCard.tsx
import React from 'react';

const LyceumNewsCard = () => {
  const newsItems = [
    { text: "New Course Released: Advanced Calculus", time: "2 hours ago" },
    { text: "Community Event: Study Group this Friday", time: "1 day ago" },
    { text: "Platform Update: New Dashboard Live!", time: "3 days ago" },
  ];

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full">
      <h3 className="text-xl font-semibold mb-3">Lyceum News</h3>
      <ul className="space-y-2">
        {newsItems.map((item, index) => (
          <li key={index} className="text-sm text-slate-300 flex justify-between">
            <span>{item.text}</span>
            <span className="text-xs text-slate-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LyceumNewsCard;
