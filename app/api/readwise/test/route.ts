import { NextRequest, NextResponse } from 'next/server';
import { ReadwiseClient } from '@/lib/readwise';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Readwise token is required' },
        { status: 400 }
      );
    }

    const client = new ReadwiseClient(token);
    const isConnected = await client.testConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to Readwise',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to connect to Readwise. Please check your token.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Readwise test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to test Readwise connection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}