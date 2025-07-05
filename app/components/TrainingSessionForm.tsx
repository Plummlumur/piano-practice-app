'use client';

import { useState, useEffect } from 'react';
import { createTrainingSession, fetchPieces, fetchExercises } from '../../api';
import { CreateTrainingSessionRequest, PieceResponse, ExerciseResponse } from '../../lib/types';

interface TrainingSessionFormProps {
  onSessionAdded: () => void;
}

export default function TrainingSessionForm({ onSessionAdded }: TrainingSessionFormProps) {
  const [formData, setFormData] = useState<CreateTrainingSessionRequest>({
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    exercises: [],
    newPieces: [],
    repertoire: []
  });

  const [pieces, setPieces] = useState<PieceResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [piecesData, exercisesData] = await Promise.all([
        fetchPieces(),
        fetchExercises()
      ]);
      setPieces(piecesData);
      setExercises(exercisesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createTrainingSession(formData);
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        duration: 30,
        exercises: [],
        newPieces: [],
        repertoire: []
      });
      onSessionAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to create training session');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExercise = (exerciseId: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.includes(exerciseId)
        ? prev.exercises.filter(id => id !== exerciseId)
        : [...prev.exercises, exerciseId]
    }));
  };

  const toggleNewPiece = (pieceId: number) => {
    setFormData(prev => ({
      ...prev,
      newPieces: prev.newPieces.includes(pieceId)
        ? prev.newPieces.filter(id => id !== pieceId)
        : [...prev.newPieces, pieceId]
    }));
  };

  const toggleRepertoire = (pieceId: number) => {
    setFormData(prev => ({
      ...prev,
      repertoire: prev.repertoire.includes(pieceId)
        ? prev.repertoire.filter(id => id !== pieceId)
        : [...prev.repertoire, pieceId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Record Training Session</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            id="duration"
            required
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {exercises.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">Exercises Practiced</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {exercises.map((exercise) => (
              <label key={exercise.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.exercises.includes(exercise.id)}
                  onChange={() => toggleExercise(exercise.id)}
                  className="rounded text-purple-600"
                />
                <span className="text-sm">{exercise.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {pieces.length > 0 && (
        <>
          <div>
            <h4 className="text-md font-medium mb-3">New Pieces (In Training)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pieces.filter(p => p.status === 'TRAINING').map((piece) => (
                <label key={piece.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newPieces.includes(piece.id)}
                    onChange={() => toggleNewPiece(piece.id)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">
                    {piece.name} - {piece.composer}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-3">Repertoire Pieces</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pieces.filter(p => p.status === 'REPERTOIRE').map((piece) => (
                <label key={piece.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.repertoire.includes(piece.id)}
                    onChange={() => toggleRepertoire(piece.id)}
                    className="rounded text-green-600"
                  />
                  <span className="text-sm">
                    {piece.name} - {piece.composer}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Recording...' : 'Record Session'}
      </button>
    </form>
  );
}