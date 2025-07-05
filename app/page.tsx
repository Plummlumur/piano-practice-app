'use client';

import { useState, useEffect } from 'react';
import { fetchPieces, fetchExercises, fetchTrainingSessions } from '../api';
import { PieceResponse, ExerciseResponse, TrainingSessionResponse } from '../lib/types';
import PieceForm from './components/PieceForm';
import ExerciseForm from './components/ExerciseForm';
import TrainingSessionForm from './components/TrainingSessionForm';

export default function Home() {
  const [pieces, setPieces] = useState<PieceResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [sessions, setSessions] = useState<TrainingSessionResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-piece' | 'add-exercise' | 'add-session'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [piecesData, exercisesData, sessionsData] = await Promise.all([
        fetchPieces(),
        fetchExercises(),
        fetchTrainingSessions()
      ]);
      setPieces(piecesData);
      setExercises(exercisesData);
      setSessions(sessionsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecentSessions = () => {
    return sessions.slice(0, 5);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-piece', label: 'Add Piece', icon: '🎵' },
    { id: 'add-exercise', label: 'Add Exercise', icon: '🏃' },
    { id: 'add-session', label: 'Record Session', icon: '📝' }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your piano practice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎹 Piano Practice Tracker</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Track your pieces, exercises, and practice sessions</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Statistics Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">🎵</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pieces</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pieces.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">🏃</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exercises</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{exercises.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">📝</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{sessions.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
                  </div>
                  <div className="p-6">
                    {getRecentSessions().length > 0 ? (
                      <div className="space-y-4">
                        {getRecentSessions().map((session) => (
                          <div key={session.id} className="border dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">{formatDate(session.date.toString())}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{session.duration} min</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {session.exercises.length > 0 && (
                                <p>Exercises: {session.exercises.length}</p>
                              )}
                              {session.newPieces.length > 0 && (
                                <p>New pieces: {session.newPieces.length}</p>
                              )}
                              {session.repertoirePieces.length > 0 && (
                                <p>Repertoire: {session.repertoirePieces.length}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No practice sessions recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pieces List */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Pieces</h2>
                  </div>
                  <div className="p-6">
                    {pieces.length > 0 ? (
                      <div className="space-y-3">
                        {pieces.slice(0, 10).map((piece) => (
                          <div key={piece.id} className="border dark:border-gray-700 rounded p-3">
                            <div className="font-medium text-sm">{piece.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{piece.composer}</div>
                            <div className="flex justify-between items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${
                                piece.status === 'TRAINING' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {piece.status === 'TRAINING' ? 'In Training' : 'Repertoire'}
                              </span>
                              <span className="text-xs text-gray-500">Played {piece.playCount} times</span>
                            </div>
                          </div>
                        ))}
                        {pieces.length > 10 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            ... and {pieces.length - 10} more pieces
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No pieces added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'add-piece' && (
            <div className="lg:col-span-3">
              <PieceForm onPieceAdded={() => { loadData(); setActiveTab('dashboard'); }} />
            </div>
          )}

          {activeTab === 'add-exercise' && (
            <div className="lg:col-span-3">
              <ExerciseForm onExerciseAdded={() => { loadData(); setActiveTab('dashboard'); }} />
            </div>
          )}

          {activeTab === 'add-session' && (
            <div className="lg:col-span-3">
              <TrainingSessionForm onSessionAdded={() => { loadData(); setActiveTab('dashboard'); }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
