'use client';

import React from 'react';

interface Props {
  title: string;
  subject: string;
  chapters: string;
  lastExam: string;
  pendingExams: string;
  buttonText: string;
}

const TestGenSnapshotCard = ({ title, subject, chapters, lastExam, pendingExams, buttonText }: Props) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>

      <div className="space-y-2 mb-4 text-sm text-slate-300 flex-grow">
        <p><span className="font-medium text-slate-200">Subject:</span> {subject}</p>
        <p><span className="font-medium text-slate-200">Chapters:</span> {chapters}</p>
        <p><span className="font-medium text-slate-200">Last Exam:</span> {lastExam}</p>
        <p><span className="font-medium text-slate-200">Pending Exams:</span> {pendingExams}</p>
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

export default TestGenSnapshotCard;
