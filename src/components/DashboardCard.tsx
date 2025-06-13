'use client';

import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl shadow-lg p-px bg-gradient-to-br from-slate-500 to-slate-800 ${className}`}>
      <div className="rounded-[calc(1rem-1px)] p-6 bg-slate-800/50 backdrop-blur-lg h-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
