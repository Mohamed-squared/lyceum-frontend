'use client';

import React from 'react';

interface Props {
  title: string;
  enrollmentStatus: string;
  todaysFocus: string;
  buttonText: string;
}

const CoursesSnapshotCard = ({ title, enrollmentStatus, todaysFocus, buttonText }: Props) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>

      <div className="space-y-2 mb-4 text-sm text-slate-300 flex-grow">
        <p><span className="font-medium text-slate-200">Enrollment:</span> {enrollmentStatus}</p>
        {todaysFocus && ( // Conditionally render Today's Focus if provided
          <p className="bg-blue-600 text-white p-2 rounded">
            <span className="font-medium">Today's Focus:</span> {todaysFocus}
          </p>
        )}
      </div>

      <button
        onClick={() => {}}
        className="mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CoursesSnapshotCard;
