import { NextRequest, NextResponse } from 'next/server';
import { MemClient } from '@/lib/mem';
import {
  formatHighlightBatch,
  formatHighlightsGroupedByBook,
} from '@/lib/formatting';
import { getValidHighlights } from '@/lib/validation';
import { ValidationSummary } from '@/types/pipeline';
import { ReadwiseBook } from '@/types/readwise';
import { kv } from '@vercel/kv';

export const maxDuration = 300; // 5 minutes for large syncs

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, validationSummary, books, groupByBook } = body;

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
    const memNotes = groupByBook
      ? formatHighlightsGroupedByBook(
          validHighlights,
          books as ReadwiseBook[]
        )
      : formatHighlightBatch(validHighlights, books as ReadwiseBook[]);

    // Create Mem client and sync in batches
    const client = new MemClient(apiKey);
    const syncResult = await client.createNotesInBatches(memNotes);

    const quotaErrorDetail = syncResult.errorDetails.find((detail) => {
      if (!detail || typeof detail !== 'object') return false;
      const errorObj = (detail as { error?: unknown }).error;
      if (!errorObj || typeof errorObj !== 'object') return false;
      const extracted = (errorObj as { error?: unknown }).error;
      if (!extracted || typeof extracted !== 'object') return false;
      return (extracted as { type?: string }).type === 'quota_exceeded';
    });

    let quotaDetails: {
      plan?: string;
      limit?: number;
      used?: number;
      resetTime?: string;
      upgradeUrl?: string;
      message?: string;
    } | null = null;

    if (quotaErrorDetail) {
      const errorObj = (quotaErrorDetail as { error?: unknown }).error as
        | { error?: unknown; message?: string }
        | undefined;
      const extracted = errorObj?.error as
        | {
            type?: string;
            message?: string;
            details?: {
              current_plan?: string;
              free_limit?: number;
              free_used?: number;
              reset_time?: string;
            };
            upgrade_info?: { upgrade_url?: string };
          }
        | undefined;

      if (extracted?.type === 'quota_exceeded') {
        quotaDetails = {
          plan: extracted.details?.current_plan,
          limit: extracted.details?.free_limit,
          used: extracted.details?.free_used,
          resetTime: extracted.details?.reset_time,
          upgradeUrl: extracted.upgrade_info?.upgrade_url,
          message: extracted.message || errorObj?.message,
        };
      }
    }

    const responseData = {
      total: validHighlights.length,
      totalHighlights: validHighlights.length,
      noteCount: memNotes.length,
      synced: syncResult.synced,
      errors: syncResult.errors,
      errorDetails: syncResult.errorDetails,
      quotaExceeded: Boolean(quotaDetails),
      quotaDetails,
    };

    try {
      // Generate anonymous user ID from API key hash
      const userId = Buffer.from(apiKey).toString('base64').substring(0, 16);
      
      // Increment counters
      if (syncResult.synced > 0) {
        await kv.incr('stats:total_syncs');
        await kv.incrby('stats:total_notes', syncResult.synced);
        await kv.sadd('stats:unique_users', userId);
      }
      
      // Store last sync timestamp
      if (syncResult.synced > 0) {
        await kv.set(`stats:last_sync:${userId}`, new Date().toISOString());
      }
    } catch (statsError) {
      // Don't fail the sync if analytics fail
      console.error('Analytics error:', statsError);
    }

    if (quotaDetails && syncResult.synced === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            quotaDetails.message || 'Mem quota exceeded: free plan limit reached',
          data: responseData,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData,
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
