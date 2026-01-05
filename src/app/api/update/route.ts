import { NextRequest, NextResponse } from 'next/server';
import { runScraping } from '@/lib/scrape';

// Scheduled endpoint for daily updates
export async function GET(request: NextRequest) {
  // Security: Only allow Vercel cron or internal requests
  const auth = request.headers.get('authorization');

  if (process.env.NODE_ENV === 'production' &&
      !auth?.startsWith('Bearer vercel-cron')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Scheduled update started');
    const result = await runScraping();

    return NextResponse.json({
      success: true,
      message: 'Update completed',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Scheduled update failed:', error);
    return NextResponse.json(
      { error: 'Update failed', message: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint for manual triggers
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret } = body;

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runScraping();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', message: error.message }, { status: 500 });
  }
}