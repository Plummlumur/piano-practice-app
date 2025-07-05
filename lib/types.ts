// Database types matching Prisma schema
export type Status = 'TRAINING' | 'REPERTOIRE';
export type SessionStatus = 'PLANNED' | 'COMPLETED';

// API Request Types
export interface CreatePieceRequest {
  name: string;
  composer: string;
  work?: string;
  source?: string;
  status?: Status;
}

export interface CreateExerciseRequest {
  name: string;
}

export interface CreateTrainingSessionRequest {
  date: string; // ISO date string
  duration: number; // in minutes
  exercises: number[]; // exercise IDs
  newPieces: number[]; // piece IDs for new pieces
  repertoire: number[]; // piece IDs for repertoire pieces
}

// API Response Types
export interface PieceResponse {
  id: number;
  name: string;
  composer: string;
  work: string | null;
  source: string | null;
  status: Status;
  playCount: number;
  dateAdded: Date;
  lastPlayed: Date | null;
}

export interface ExerciseResponse {
  id: number;
  name: string;
  lastPracticed: Date | null;
}

export interface TrainingSessionResponse {
  id: number;
  date: Date;
  duration: number;
  status: SessionStatus;
  createdAt: Date;
  exercises: {
    exerciseId: number;
    trainingSessionId: number;
    exercise: ExerciseResponse;
  }[];
  newPieces: {
    pieceId: number;
    trainingSessionId: number;
    piece: PieceResponse;
  }[];
  repertoirePieces: {
    pieceId: number;
    trainingSessionId: number;
    piece: PieceResponse;
  }[];
}

// API Error Response
export interface APIError {
  error: string;
  details?: string;
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}