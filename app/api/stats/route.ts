import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const totalSyncs = await kv.get<number>('stats:total_syncs') || 0;
    const totalNotesSynced = await kv.get<number>('stats:total_notes') || 0;
    const uniqueUsers = await kv.scard('stats:unique_users') || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalSyncs,
        totalNotesSynced,
        uniqueUsers,
        avgNotesPerSync: totalSyncs > 0 ? Math.round(totalNotesSynced / totalSyncs) : 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}