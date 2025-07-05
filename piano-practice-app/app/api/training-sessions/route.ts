import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
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
        exercises: true,
        newPieces: true,
        repertoirePieces: true
      }
    });

    // Update last practiced dates
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

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
