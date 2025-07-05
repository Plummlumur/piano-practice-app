import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pieces = await prisma.piece.findMany({
      orderBy: { dateAdded: 'desc' }
    });
    return NextResponse.json(pieces);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pieces' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const piece = await prisma.piece.create({
      data: {
        name: data.name,
        composer: data.composer,
        work: data.work || null,
        source: data.source || null,
        status: data.status || 'TRAINING'
      }
    });
    return NextResponse.json(piece);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create piece' }, { status: 500 });
  }
}
