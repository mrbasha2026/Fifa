/**
 * GET /api/health
 * Health check + Supabase connection status.
 */
import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabase } from '@/lib/wc/supabase-real';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isSupabaseConfigured;
  let connected = false;
  let tableCount = 0;
  let error: string | null = null;

  if (configured) {
    try {
      const sb = getSupabase();
      if (sb) {
        const { data, error: e } = await sb.from('teams').select('id').limit(1);
        if (e) {
          error = e.message;
        } else {
          connected = true;
          tableCount = (data ?? []).length;
        }
      }
    } catch (e: any) {
      error = e.message;
    }
  }

  return NextResponse.json({
    ok: true,
    supabase: {
      configured,
      connected,
      tableCount,
      error,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    },
    apiFootball: {
      configured: Boolean(process.env.API_FOOTBALL_KEY),
    },
    timestamp: new Date().toISOString(),
  });
}
