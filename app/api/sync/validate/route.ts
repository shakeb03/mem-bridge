import { NextRequest, NextResponse } from 'next/server';
import { ReadwiseHighlight, ReadwiseBook } from '@/types/readwise';
import { validateBatch } from '@/lib/validation';
import { formatHighlightBatch } from '@/lib/formatting';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { highlights, books } = body;

    if (!highlights || !Array.isArray(highlights)) {
      return NextResponse.json(
        { error: 'Highlights array is required' },
        { status: 400 }
      );
    }

    if (!books || !Array.isArray(books)) {
      return NextResponse.json(
        { error: 'Books array is required' },
        { status: 400 }
      );
    }

    // Format all highlights
    const formattedNotes = formatHighlightBatch(
      highlights as ReadwiseHighlight[],
      books as ReadwiseBook[]
    );

    // Extract formatted content strings
    const formattedContents = formattedNotes.map((note) => note.content);

    // Validate all highlights
    const validationSummary = validateBatch(
      highlights as ReadwiseHighlight[],
      formattedContents
    );

    return NextResponse.json({
      success: true,
      data: validationSummary,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate highlights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}