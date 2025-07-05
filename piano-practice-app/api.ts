export async function fetchPieces() {
  const response = await fetch('/api/pieces');
  if (!response.ok) throw new Error('Failed to fetch pieces');
  return response.json();
}

export async function createPiece(data: any) {
  const response = await fetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create piece');
  return response.json();
}

export async function fetchExercises() {
  const response = await fetch('/api/exercises');
  if (!response.ok) throw new Error('Failed to fetch exercises');
  return response.json();
}

export async function createExercise(data: any) {
  const response = await fetch('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create exercise');
  return response.json();
}

export async function fetchTrainingSessions() {
  const response = await fetch('/api/training-sessions');
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
}

export async function createTrainingSession(data: any) {
  const response = await fetch('/api/training-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create session');
  return response.json();
}
