import {
  PieceResponse,
  ExerciseResponse,
  TrainingSessionResponse,
  CreatePieceRequest,
  CreateExerciseRequest,
  CreateTrainingSessionRequest
} from './lib/types';

export class APIClientError extends Error {
  constructor(message: string, public status: number, public details?: string) {
    super(message);
    this.name = 'APIClientError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIClientError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      errorData.details
    );
  }
  return response.json();
}

export async function fetchPieces(): Promise<PieceResponse[]> {
  const response = await fetch('/api/pieces');
  return handleResponse<PieceResponse[]>(response);
}

export async function createPiece(data: CreatePieceRequest): Promise<PieceResponse> {
  const response = await fetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<PieceResponse>(response);
}

export async function fetchExercises(): Promise<ExerciseResponse[]> {
  const response = await fetch('/api/exercises');
  return handleResponse<ExerciseResponse[]>(response);
}

export async function createExercise(data: CreateExerciseRequest): Promise<ExerciseResponse> {
  const response = await fetch('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<ExerciseResponse>(response);
}

export async function fetchTrainingSessions(): Promise<TrainingSessionResponse[]> {
  const response = await fetch('/api/training-sessions');
  return handleResponse<TrainingSessionResponse[]>(response);
}

export async function createTrainingSession(data: CreateTrainingSessionRequest): Promise<TrainingSessionResponse> {
  const response = await fetch('/api/training-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<TrainingSessionResponse>(response);
}

// Instruments API functions
export interface InstrumentResponse {
  id: number;
  name: string;
  type?: string;
  brand?: string;
  model?: string;
  acquired_date?: string;
  notes?: string;
  created_at: string;
}

export async function fetchInstruments(): Promise<InstrumentResponse[]> {
  const response = await fetch('/api/instruments');
  return handleResponse<InstrumentResponse[]>(response);
}
