import { NextRequest, NextResponse } from 'next/server';
import { MemClient } from '@/lib/mem';
import { MemNote } from '@/types/mem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, note } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mem API key is required' },
        { status: 400 }
      );
    }

    if (!note || !note.input) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    const client = new MemClient(apiKey);
    const memNote: MemNote = {
      input: note.content,
    };

    const result = await client.createNote(memNote);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Mem create note error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create note in Mem',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}