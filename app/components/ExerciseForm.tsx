'use client';

import { useState } from 'react';
import { createExercise } from '../../api';
import { CreateExerciseRequest } from '../../lib/types';

interface ExerciseFormProps {
  onExerciseAdded: () => void;
}

export default function ExerciseForm({ onExerciseAdded }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await createExercise({ name: name.trim() });
      setName('');
      onExerciseAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add exercise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Add New Exercise</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="exerciseName" className="block text-sm font-medium mb-2">
          Exercise Name *
        </label>
        <input
          type="text"
          id="exerciseName"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Scales - C Major, Hanon No. 1"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add Exercise'}
      </button>
    </form>
  );
}