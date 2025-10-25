import { NextRequest, NextResponse } from 'next/server';
import { saveCredentials } from '@/lib/storage';
import { Credentials } from '@/types/pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, credentials } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!credentials || !credentials.readwiseToken || !credentials.memApiKey) {
      return NextResponse.json(
        { error: 'Both Readwise token and Mem API key are required' },
        { status: 400 }
      );
    }

    await saveCredentials(userId, credentials as Credentials);

    return NextResponse.json({
      success: true,
      message: 'Credentials saved successfully',
    });
  } catch (error) {
    console.error('Save credentials error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save credentials',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}