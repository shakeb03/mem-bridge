import { NextRequest, NextResponse } from 'next/server';
import { getCredentials } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const credentials = await getCredentials(userId);

    if (!credentials) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No credentials found',
      });
    }

    return NextResponse.json({
      success: true,
      data: credentials,
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve credentials',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}