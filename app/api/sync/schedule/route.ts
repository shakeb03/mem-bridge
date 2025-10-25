import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface ScheduleConfig {
  userId: string;
  frequency: 'daily' | 'weekly' | 'manual';
  enabled: boolean;
  lastSync?: string;
  nextSync?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, frequency, enabled } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!frequency || !['daily', 'weekly', 'manual'].includes(frequency)) {
      return NextResponse.json(
        { error: 'Valid frequency is required (daily, weekly, or manual)' },
        { status: 400 }
      );
    }

    const scheduleConfig: ScheduleConfig = {
      userId,
      frequency,
      enabled: enabled !== false,
      lastSync: new Date().toISOString(),
    };

    // Calculate next sync time
    if (enabled && frequency !== 'manual') {
      const now = new Date();
      const nextSync = new Date(now);
      
      if (frequency === 'daily') {
        nextSync.setDate(nextSync.getDate() + 1);
      } else if (frequency === 'weekly') {
        nextSync.setDate(nextSync.getDate() + 7);
      }
      
      scheduleConfig.nextSync = nextSync.toISOString();
    }

    // Store schedule config
    const key = `schedule:${userId}`;
    
    if (process.env.KV_REST_API_URL) {
      await kv.set(key, JSON.stringify(scheduleConfig));
    }

    return NextResponse.json({
      success: true,
      data: scheduleConfig,
      message: enabled
        ? `Automatic sync scheduled (${frequency})`
        : 'Automatic sync disabled',
    });
  } catch (error) {
    console.error('Schedule sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to schedule sync',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

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

    const key = `schedule:${userId}`;
    
    let scheduleConfig: ScheduleConfig | null = null;
    
    if (process.env.KV_REST_API_URL) {
      const data = await kv.get<string>(key);
      scheduleConfig = data ? JSON.parse(data) : null;
    }

    if (!scheduleConfig) {
      return NextResponse.json({
        success: true,
        data: {
          userId,
          frequency: 'manual',
          enabled: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: scheduleConfig,
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get schedule',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}