/**
 * GET /api/sync/status
 * Shows the status of API-Football connection and last sync times.
 * Useful for monitoring whether the API-Football account is active.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const apiBase = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

  let apiFootballStatus: any = {
    configured: Boolean(apiKey),
    endpoint: apiBase,
    accountActive: false,
    error: null as string | null,
  };

  // Test API-Football connection
  if (apiKey) {
    try {
      const res = await fetch(`${apiBase}/status`, {
        headers: { 'x-apisports-key': apiKey },
      });
      const json = await res.json();
      if (json.errors && Object.keys(json.errors).length > 0) {
        apiFootballStatus.error = JSON.stringify(json.errors);
        apiFootballStatus.accountActive = false;
      } else {
        apiFootballStatus.accountActive = true;
        if (json.response && json.response.account) {
          apiFootballStatus.account = {
            firstname: json.response.account.firstname,
            lastname: json.response.account.lastname,
            email: json.response.account.email,
          };
        }
        if (json.response && json.response.subscription) {
          apiFootballStatus.subscription = json.response.subscription;
        }
        if (json.response && json.response.requests) {
          apiFootballStatus.requests = json.response.requests;
        }
      }
    } catch (e: any) {
      apiFootballStatus.error = e.message;
      apiFootballStatus.accountActive = false;
    }
  }

  // Get last sync state from Supabase
  let syncState: any[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await sb.from('sync_state').select('*').order('last_synced_at', { ascending: false });
    syncState = data ?? [];
  }

  return NextResponse.json({
    apiFootball: apiFootballStatus,
    syncState,
    instructions: apiFootballStatus.error?.includes('suspended')
      ? '⚠️ Your API-Football account is suspended. Visit https://dashboard.api-football.com to activate your subscription.'
      : apiFootballStatus.accountActive
      ? '✅ API-Football is active. Run POST /api/sync to fetch real data.'
      : 'Configure API_FOOTBALL_KEY in .env.local',
    timestamp: new Date().toISOString(),
  });
}
