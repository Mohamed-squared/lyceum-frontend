"use client";

import { useState, FormEvent } from 'react';
import { postAuthenticated } from '@/utils/apiClient';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionToken: string;
  onCourseCreated: (newCourse: any) => void;
}

export default function CreateCourseModal({ isOpen, onClose, sessionToken, onCourseCreated }: CreateCourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title) {
        setError('Title is required.');
        setIsLoading(false);
        return;
    }

    try {
      const response = await postAuthenticated('/api/v1/courses', sessionToken, {
        title,
        description,
        visibility,
      });

      if (response.success) {
        onCourseCreated(response.data);
        onClose(); // Close modal on success
        // Reset form
        setTitle('');
        setDescription('');
        setVisibility('private');
      } else {
        setError(response.error?.message || 'An unknown error occurred.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) { return null; }

  // The 'return' statement below replaces the original one.
  return (
    // Modal Backdrop: Replicates frosted glass from components.css
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal Card: Replicates .content-card from components.css */}
      <div className="bg-slate-800/80 border border-slate-700/50 p-8 rounded-lg shadow-xl w-full max-w-lg text-slate-100 relative backdrop-blur-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Create New Course</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Group for Title */}
          <div className="mb-4">
            {/* Label: Replicates label styles from forms.css */}
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            {/* Input: Replicates .form-control styles from forms.css */}
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
              required
            />
          </div>

          {/* Form Group for Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            {/* Textarea: Replicates textarea styles from forms.css */}
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
              placeholder="e.g., An introductory course on quantum mechanics..."
            />
          </div>

          {/* Form Group for Visibility */}
          <div className="mb-6">
            <span className="block text-sm font-medium text-slate-300 mb-2">Visibility</span>
            {/* Radio Buttons: Replicates radio styles from forms.css */}
            <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                    <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-slate-500 bg-slate-700 checked:bg-slate-700 checked:border-yellow-400 checked:ring-2 ring-offset-2 ring-offset-slate-800 ring-yellow-400 transition" />
                    <span className="ml-2 text-slate-300">Private</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-slate-500 bg-slate-700 checked:bg-slate-700 checked:border-yellow-400 checked:ring-2 ring-offset-2 ring-offset-slate-800 ring-yellow-400 transition" />
                    <span className="ml-2 text-slate-300">Public</span>
                </label>
            </div>
          </div>

          {/* Error Message Display */}
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          {/* Action Buttons: Replicates .btn-secondary and .btn-primary from buttons.css */}
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 text-slate-100 font-semibold hover:bg-slate-500 transition disabled:opacity-50" disabled={isLoading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500 transition disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
