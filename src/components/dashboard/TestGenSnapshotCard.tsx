import React from 'react';

const TestGenSnapshotCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">TestGen Snapshot</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Artin Abstract Algebra</p>
      <div className="flex space-x-2 mb-4">
        <span className="inline-block bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          12/15 Chapters Mastered
        </span>
        <span className="inline-block bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          Last Exam: 88%
        </span>
        <span className="inline-block bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          2 Pending PDF Exams
        </span>
      </div>
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 h-40 flex items-center justify-center mb-4">
        <p className="text-gray-500 dark:text-gray-400">Score Trend Chart</p>
      </div>
      <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full">
        Go to TestGen Dashboard
      </button>
    </div>
  );
};

export default TestGenSnapshotCard;
