import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCreateExerciseRequest } from '@/lib/validation';
import { ExerciseResponse, APIError } from '@/lib/types';

export async function GET(): Promise<NextResponse<ExerciseResponse[] | APIError>> {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ExerciseResponse | APIError>> {
  try {
    const rawData = await request.json();
    const validation = validateCreateExerciseRequest(rawData);
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
      }, { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: validation.data!.name
      }
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error('Failed to create exercise:', error);
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}
