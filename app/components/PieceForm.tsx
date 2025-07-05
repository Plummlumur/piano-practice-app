'use client';

import { useState } from 'react';
import { createPiece } from '../../api';
import { CreatePieceRequest, Status } from '../../lib/types';

interface PieceFormProps {
  onPieceAdded: () => void;
}

export default function PieceForm({ onPieceAdded }: PieceFormProps) {
  const [formData, setFormData] = useState<CreatePieceRequest>({
    name: '',
    composer: '',
    work: '',
    source: '',
    status: 'TRAINING'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createPiece({
        ...formData,
        work: formData.work || undefined,
        source: formData.source || undefined
      });
      
      setFormData({
        name: '',
        composer: '',
        work: '',
        source: '',
        status: 'TRAINING'
      });
      onPieceAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add piece');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Add New Piece</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Piece Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Für Elise"
        />
      </div>

      <div>
        <label htmlFor="composer" className="block text-sm font-medium mb-2">
          Composer *
        </label>
        <input
          type="text"
          id="composer"
          required
          value={formData.composer}
          onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Ludwig van Beethoven"
        />
      </div>

      <div>
        <label htmlFor="work" className="block text-sm font-medium mb-2">
          Work/Opus
        </label>
        <input
          type="text"
          id="work"
          value={formData.work}
          onChange={(e) => setFormData({ ...formData, work: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Op. 27 No. 2"
        />
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium mb-2">
          Source
        </label>
        <input
          type="text"
          id="source"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., IMSLP, Book, Teacher"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TRAINING">In Training</option>
          <option value="REPERTOIRE">Repertoire</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add Piece'}
      </button>
    </form>
  );
}