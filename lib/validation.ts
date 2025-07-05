import { CreatePieceRequest, CreateExerciseRequest, CreateTrainingSessionRequest, ValidationError } from './types';

export function validateCreatePieceRequest(data: any): { isValid: boolean; errors: ValidationError[]; data?: CreatePieceRequest } {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!data.composer || typeof data.composer !== 'string' || data.composer.trim().length === 0) {
    errors.push({ field: 'composer', message: 'Composer is required and must be a non-empty string' });
  }

  if (data.work !== undefined && data.work !== null && typeof data.work !== 'string') {
    errors.push({ field: 'work', message: 'Work must be a string if provided' });
  }

  if (data.source !== undefined && data.source !== null && typeof data.source !== 'string') {
    errors.push({ field: 'source', message: 'Source must be a string if provided' });
  }

  if (data.status !== undefined && data.status !== 'TRAINING' && data.status !== 'REPERTOIRE') {
    errors.push({ field: 'status', message: 'Status must be either TRAINING or REPERTOIRE' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      name: data.name.trim(),
      composer: data.composer.trim(),
      work: data.work?.trim() || undefined,
      source: data.source?.trim() || undefined,
      status: data.status || 'TRAINING'
    }
  };
}

export function validateCreateExerciseRequest(data: any): { isValid: boolean; errors: ValidationError[]; data?: CreateExerciseRequest } {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      name: data.name.trim()
    }
  };
}

export function validateCreateTrainingSessionRequest(data: any): { isValid: boolean; errors: ValidationError[]; data?: CreateTrainingSessionRequest } {
  const errors: ValidationError[] = [];

  if (!data.date || typeof data.date !== 'string') {
    errors.push({ field: 'date', message: 'Date is required and must be a valid ISO date string' });
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'date', message: 'Date must be a valid ISO date string' });
    }
  }

  if (!data.duration || typeof data.duration !== 'number' || data.duration <= 0 || !Number.isInteger(data.duration)) {
    errors.push({ field: 'duration', message: 'Duration is required and must be a positive integer (minutes)' });
  }

  if (!Array.isArray(data.exercises)) {
    errors.push({ field: 'exercises', message: 'Exercises must be an array of exercise IDs' });
  } else {
    const invalidExercises = data.exercises.filter((id: any) => !Number.isInteger(id) || id <= 0);
    if (invalidExercises.length > 0) {
      errors.push({ field: 'exercises', message: 'All exercise IDs must be positive integers' });
    }
  }

  if (!Array.isArray(data.newPieces)) {
    errors.push({ field: 'newPieces', message: 'NewPieces must be an array of piece IDs' });
  } else {
    const invalidPieces = data.newPieces.filter((id: any) => !Number.isInteger(id) || id <= 0);
    if (invalidPieces.length > 0) {
      errors.push({ field: 'newPieces', message: 'All new piece IDs must be positive integers' });
    }
  }

  if (!Array.isArray(data.repertoire)) {
    errors.push({ field: 'repertoire', message: 'Repertoire must be an array of piece IDs' });
  } else {
    const invalidPieces = data.repertoire.filter((id: any) => !Number.isInteger(id) || id <= 0);
    if (invalidPieces.length > 0) {
      errors.push({ field: 'repertoire', message: 'All repertoire piece IDs must be positive integers' });
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      date: data.date,
      duration: data.duration,
      exercises: data.exercises,
      newPieces: data.newPieces,
      repertoire: data.repertoire
    }
  };
}