import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCreateTrainingSessionRequest } from '@/lib/validation';
import { TrainingSessionResponse, APIError } from '@/lib/types';

export async function GET(): Promise<NextResponse<TrainingSessionResponse[] | APIError>> {
  try {
    const sessions = await prisma.trainingSession.findMany({
      include: {
        exercises: {
          include: { exercise: true }
        },
        newPieces: {
          include: { piece: true }
        },
        repertoirePieces: {
          include: { piece: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<TrainingSessionResponse | APIError>> {
  try {
    const rawData = await request.json();
    const validation = validateCreateTrainingSessionRequest(rawData);
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
      }, { status: 400 });
    }

    const data = validation.data!;

    // Verify that all referenced exercises and pieces exist
    const [exerciseCount, pieceCount] = await Promise.all([
      prisma.exercise.count({ where: { id: { in: data.exercises } } }),
      prisma.piece.count({ where: { id: { in: [...data.newPieces, ...data.repertoire] } } })
    ]);

    if (exerciseCount !== data.exercises.length) {
      return NextResponse.json({ 
        error: 'Some referenced exercises do not exist' 
      }, { status: 400 });
    }

    const totalPieceIds = [...data.newPieces, ...data.repertoire];
    if (pieceCount !== totalPieceIds.length) {
      return NextResponse.json({ 
        error: 'Some referenced pieces do not exist' 
      }, { status: 400 });
    }

    // Create the session with all related data
    const session = await prisma.trainingSession.create({
      data: {
        date: new Date(data.date),
        duration: data.duration,
        exercises: {
          create: data.exercises.map((id: number) => ({
            exerciseId: id
          }))
        },
        newPieces: {
          create: data.newPieces.map((id: number) => ({
            pieceId: id
          }))
        },
        repertoirePieces: {
          create: data.repertoire.map((id: number) => ({
            pieceId: id
          }))
        }
      },
      include: {
        exercises: {
          include: { exercise: true }
        },
        newPieces: {
          include: { piece: true }
        },
        repertoirePieces: {
          include: { piece: true }
        }
      }
    });

    // Update last practiced dates for exercises
    if (data.exercises.length > 0) {
      await prisma.exercise.updateMany({
        where: { id: { in: data.exercises } },
        data: { lastPracticed: new Date(data.date) }
      });
    }

    // Update piece play counts and last played dates
    const allPieceIds = [...data.newPieces, ...data.repertoire];
    if (allPieceIds.length > 0) {
      await prisma.piece.updateMany({
        where: { id: { in: allPieceIds } },
        data: { lastPlayed: new Date(data.date) }
      });

      // Increment play count for repertoire pieces
      if (data.repertoire.length > 0) {
        await prisma.piece.updateMany({
          where: { id: { in: data.repertoire } },
          data: { playCount: { increment: 1 } }
        });
      }
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
