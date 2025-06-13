'use client';

// src/components/dashboard/CoursesSnapshotCard.tsx
import React from 'react';

interface Course {
  name: string;
  focus?: string; // E.g., "Complete Chapter 3 of Quantum Mechanics"
  grade?: string; // E.g., "A-"
  // 'enrolled' status can be derived from the existence of course objects or a specific prop if needed
}

interface Props {
  title: string;
  description: string; // E.g., "3 Courses Enrolled"
  buttonText: string;
  noCoursesMessage: string;
  loadingMessage: string;
  errorMessage: string;
  courses: Course[];
}

const CoursesSnapshotCard: React.FC<Props> = ({
  title,
  description,
  buttonText,
  noCoursesMessage,
  loadingMessage,
  errorMessage,
  courses,
}) => {
  const firstCourse = courses && courses.length > 0 ? courses[0] : null;

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-slate-300 mb-2">{description}</p>
      {firstCourse ? (
        <>
          {firstCourse.focus && (
            <p className="bg-blue-600 text-white p-2 rounded mb-4 text-sm">
              Focus: {firstCourse.focus}
            </p>
          )}
          <div className="border border-slate-600 rounded p-4 h-40 flex items-center justify-center text-slate-400 mb-4">
            Course Grades Chart {/* Placeholder */}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-300 mb-4">{noCoursesMessage}</p>
      )}
      <button className="mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        {buttonText}
      </button>
    </div>
  );
};

export default CoursesSnapshotCard;
