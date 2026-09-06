import { NextResponse } from 'next/server';
import { getLiveWeather, type LiveWeather } from '@/lib/weather';

// Cache live data for 10 minutes across all visitors, so Open-Meteo is
// queried at most ~6 times/hour instead of once per page view.
const TTL_MS = 10 * 60 * 1000;

let cache: { at: number; data: LiveWeather | null } | null = null;

export const runtime = 'nodejs';

export async function GET() {
  const now = Date.now();
  if (!cache || now - cache.at >= TTL_MS) {
    const data = await getLiveWeather();
    cache = { at: now, data };
  }
  if (!cache.data) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true, data: cache.data });
}
