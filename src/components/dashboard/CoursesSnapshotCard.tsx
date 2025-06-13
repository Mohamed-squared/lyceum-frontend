// src/components/dashboard/CoursesSnapshotCard.tsx
import React from 'react';

const CoursesSnapshotCard = () => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">Courses Snapshot</h3>
      <p className="text-sm text-slate-300 mb-2">3 Courses Enrolled</p>
      <p className="bg-blue-600 text-white p-2 rounded mb-4 text-sm">
        Focus: Complete Chapter 3 of Quantum Mechanics
      </p>
      <div className="border border-slate-600 rounded p-4 h-40 flex items-center justify-center text-slate-400 mb-4">
        Course Grades Chart
      </div>
      <button className="mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        Go to My Courses
      </button>
    </div>
  );
};

export default CoursesSnapshotCard;
