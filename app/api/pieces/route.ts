import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCreatePieceRequest } from '@/lib/validation';
import { PieceResponse, APIError } from '@/lib/types';

export async function GET(): Promise<NextResponse<PieceResponse[] | APIError>> {
  try {
    const pieces = await prisma.piece.findMany({
      orderBy: { dateAdded: 'desc' }
    });
    return NextResponse.json(pieces);
  } catch (error) {
    console.error('Failed to fetch pieces:', error);
    return NextResponse.json({ error: 'Failed to fetch pieces' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<PieceResponse | APIError>> {
  try {
    const rawData = await request.json();
    const validation = validateCreatePieceRequest(rawData);
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
      }, { status: 400 });
    }

    const piece = await prisma.piece.create({
      data: {
        name: validation.data!.name,
        composer: validation.data!.composer,
        work: validation.data!.work || null,
        source: validation.data!.source || null,
        status: validation.data!.status || 'TRAINING'
      }
    });

    return NextResponse.json(piece, { status: 201 });
  } catch (error) {
    console.error('Failed to create piece:', error);
    return NextResponse.json({ error: 'Failed to create piece' }, { status: 500 });
  }
}
