import { NextRequest, NextResponse } from 'next/server';
import { MemClient } from '@/lib/mem';

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

    const client = new MemClient(apiKey);
    const isConnected = await client.testConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to Mem',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to connect to Mem. Please check your API key.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Mem test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to test Mem connection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}