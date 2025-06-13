import React from 'react';

const CoursesSnapshotCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Courses Snapshot</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-2">3 Courses Enrolled</p>
      <p className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 p-3 rounded-md mb-4">
        Focus: Complete Chapter 3 of Quantum Mechanics
      </p>
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 h-40 flex items-center justify-center mb-4">
        <p className="text-gray-500 dark:text-gray-400">Course Grades Chart</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full">
        Go to My Courses
      </button>
    </div>
  );
};

export default CoursesSnapshotCard;
