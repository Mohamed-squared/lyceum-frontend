// src/components/dashboard/TestGenSnapshotCard.tsx
import React from 'react';

const TestGenSnapshotCard = () => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">TestGen Snapshot</h3>
      <p className="text-sm text-slate-300 mb-2">Artin Abstract Algebra</p>
      <div className="space-y-2 mb-4">
        <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block mr-2">
          12/15 Chapters Mastered
        </div>
        <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block mr-2">
          Last Exam: 88%
        </div>
        <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block">
          2 Pending PDF Exams
        </div>
      </div>
      <div className="border border-slate-600 rounded p-4 h-40 flex items-center justify-center text-slate-400 mb-4">
        Score Trend Chart
      </div>
      <button className="mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        Go to TestGen Dashboard
      </button>
    </div>
  );
};

export default TestGenSnapshotCard;
