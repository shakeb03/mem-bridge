import { NextRequest, NextResponse } from 'next/server';
import { MemClient } from '@/lib/mem';
import { formatHighlightBatch } from '@/lib/formatting';
import { getValidHighlights } from '@/lib/validation';
import { ValidationSummary } from '@/types/pipeline';
import { ReadwiseBook } from '@/types/readwise';

export const maxDuration = 300; // 5 minutes for large syncs

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, validationSummary, books } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mem API key is required' },
        { status: 400 }
      );
    }

    if (!validationSummary || !validationSummary.results) {
      return NextResponse.json(
        { error: 'Validation summary is required' },
        { status: 400 }
      );
    }

    // Get only valid highlights
    const validResults = getValidHighlights(validationSummary as ValidationSummary);
    const validHighlights = validResults.map((r) => r.highlight);

    if (validHighlights.length === 0) {
      return NextResponse.json(
        { error: 'No valid highlights to sync' },
        { status: 400 }
      );
    }

    // Format highlights into Mem notes
    const memNotes = formatHighlightBatch(
      validHighlights,
      books as ReadwiseBook[]
    );

    // Create Mem client and sync in batches
    const client = new MemClient(apiKey);
    const syncResult = await client.createNotesInBatches(memNotes);

    return NextResponse.json({
      success: true,
      data: {
        total: validHighlights.length,
        synced: syncResult.synced,
        errors: syncResult.errors,
        errorDetails: syncResult.errorDetails,
      },
    });
  } catch (error) {
    console.error('Sync execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute sync',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}