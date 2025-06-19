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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-lg text-slate-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-100">&times;</button>
        <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
          <div className="mb-6">
            <span className="block text-sm font-medium text-slate-300 mb-2">Visibility</span>
            <div className="flex items-center space-x-4">
                <label className="flex items-center"><input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="form-radio text-yellow-400 bg-slate-700 border-slate-600 focus:ring-yellow-400" /> <span className="ml-2">Private</span></label>
                <label className="flex items-center"><input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="form-radio text-yellow-400 bg-slate-700 border-slate-600 focus:ring-yellow-400" /> <span className="ml-2">Public</span></label>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded mr-2" disabled={isLoading}>Cancel</button>
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
