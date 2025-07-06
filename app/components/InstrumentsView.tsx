'use client';

import { useState, useEffect } from 'react';

interface Instrument {
  id: number;
  name: string;
  type?: string;
  brand?: string;
  model?: string;
  acquired_date?: string;
  notes?: string;
  created_at: string;
}

interface InstrumentsViewProps {
  initialInstruments: Instrument[];
}

export default function InstrumentsView({ initialInstruments }: InstrumentsViewProps) {
  const [instruments, setInstruments] = useState<Instrument[]>(initialInstruments);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎼 Your Instruments</h2>
        <p className="text-gray-600 dark:text-gray-400">{instruments.length} instrument{instruments.length !== 1 ? 's' : ''}</p>
      </div>

      {instruments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument) => (
            <div key={instrument.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {instrument.name}
                </h3>
                {instrument.type && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    {instrument.type}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {instrument.brand && (
                  <div className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span>{instrument.brand}</span>
                  </div>
                )}
                
                {instrument.model && (
                  <div className="flex justify-between">
                    <span className="font-medium">Model:</span>
                    <span>{instrument.model}</span>
                  </div>
                )}

                {instrument.acquired_date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Acquired:</span>
                    <span>{formatDate(instrument.acquired_date)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="font-medium">Added:</span>
                  <span>{formatDate(instrument.created_at)}</span>
                </div>
              </div>

              {instrument.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Notes:</span> {instrument.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎹</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No instruments yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first instrument to start tracking your collection.
          </p>
        </div>
      )}
    </div>
  );
}