import { NextRequest, NextResponse } from 'next/server';
import { ReadwiseClient } from '@/lib/readwise';

export const maxDuration = 60; // 60 seconds timeout for long-running fetch

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, dateRange, updatedAfter } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Readwise token is required' },
        { status: 400 }
      );
    }

    const client = new ReadwiseClient(token);

    // Fetch highlights based on parameters
    let highlights;
    if (dateRange && dateRange.start && dateRange.end) {
      highlights = await client.fetchHighlightsByDateRange(
        dateRange.start,
        dateRange.end
      );
    } else if (updatedAfter) {
      highlights = await client.fetchAllHighlights(undefined, updatedAfter);
    } else {
      highlights = await client.fetchAllHighlights();
    }

    // Fetch books for additional metadata
    const books = await client.fetchBooks();

    return NextResponse.json({
      success: true,
      data: {
        highlights,
        books,
        count: highlights.length,
      },
    });
  } catch (error) {
    console.error('Readwise fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch highlights from Readwise',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}