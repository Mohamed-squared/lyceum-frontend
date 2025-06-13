'use client';

// src/components/dashboard/TestGenSnapshotCard.tsx
import React from 'react';

interface Test {
  name: string;
  mastered: number;
  total: number;
  lastScore?: number;
  pendingPDFExams?: number;
}

interface Props {
  title: string;
  description: string; // This seems to be the 'subject' from the original hardcoded text
  buttonText: string;
  noTestsMessage: string;
  loadingMessage: string;
  errorMessage: string;
  tests: Test[]; // Array of test objects
}

const TestGenSnapshotCard: React.FC<Props> = ({
  title,
  description,
  buttonText,
  noTestsMessage,
  loadingMessage,
  errorMessage,
  tests,
}) => {
  // For now, we'll display info from the first test if available, or a generic message.
  // The specific rendering logic for multiple tests or more detailed display might need further clarification.
  const firstTest = tests && tests.length > 0 ? tests[0] : null;

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {firstTest ? (
        <>
          <p className="text-sm text-slate-300 mb-2">{description}</p> {/* Assuming description is the subject */}
          <div className="space-y-2 mb-4">
            {firstTest.mastered !== undefined && firstTest.total !== undefined && (
              <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block mr-2">
                {firstTest.mastered}/{firstTest.total} Chapters Mastered
              </div>
            )}
            {firstTest.lastScore !== undefined && (
              <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block mr-2">
                Last Exam: {firstTest.lastScore}%
              </div>
            )}
            {firstTest.pendingPDFExams !== undefined && (
              <div className="text-xs bg-slate-700 text-slate-50 py-1 px-3 rounded-full inline-block">
                {firstTest.pendingPDFExams} Pending PDF Exams
              </div>
            )}
          </div>
          <div className="border border-slate-600 rounded p-4 h-40 flex items-center justify-center text-slate-400 mb-4">
            Score Trend Chart {/* Placeholder, actual chart might use 'tests' data */}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-300 mb-4">{noTestsMessage}</p>
      )}
      <button className="mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        {buttonText}
      </button>
    </div>
  );
};

export default TestGenSnapshotCard;
