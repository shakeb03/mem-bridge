import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mem API key is required' },
        { status: 400 }
      );
    }

    // Basic format validation
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Check if it starts with expected prefix
    if (!apiKey.startsWith('sk-mem-')) {
      return NextResponse.json(
        { error: 'API key should start with sk-mem-' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API key format is valid. Will verify during sync.',
    });
  } catch (error) {
    console.error('Mem test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate API key',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}