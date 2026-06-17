/**
 * POST /api/sync
 * Triggers API-Football → Supabase sync.
 * Protected by SYNC_API_KEY header (set in .env.local).
 * Intended to be called by Vercel Cron / external scheduler.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local (for local dev; on Vercel env vars are auto-loaded)
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

export const maxDuration = 60;  // Vercel: 60s timeout
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Auth check
  const syncKey = process.env.SYNC_API_KEY;
  const providedKey = req.headers.get('x-sync-key') || req.nextUrl.searchParams.get('key');
  if (syncKey && providedKey !== syncKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_BASE = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

  if (!SUPABASE_URL || !SERVICE_KEY || !API_KEY) {
    return NextResponse.json({ error: 'server not configured' }, { status: 500 });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const LEAGUE_ID = 1;
  const SEASON = 2026;
  const startedAt = Date.now();
  const results: Record<string, any> = {};

  async function apiFootball(endpoint: string, params: Record<string, string | number>) {
    const url = new URL(`${API_BASE}/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const res = await fetch(url.toString(), {
      headers: { 'x-apisports-key': API_KEY },
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.response;
  }

  function mapStatus(s: string): string {
    const map: Record<string, string> = {
      NS: 'NS', TBD: 'NS',
      '1H': 'LIVE', '2H': 'LIVE', ET: 'LIVE', BT: 'LIVE', P: 'LIVE', SUSP: 'LIVE', INT: 'LIVE',
      HT: 'HT', FT: 'FT', AET: 'AET', PEN: 'PEN',
    };
    return map[s] ?? 'NS';
  }

  function mapRound(round: string | null): string {
    if (!round) return 'group';
    const r = round.toLowerCase();
    if (r.includes('group')) return 'group';
    if (r.includes('32')) return 'R32';
    if (r.includes('16')) return 'R16';
    if (r.includes('quarter') || r.includes('4')) return 'QF';
    if (r.includes('semi') || r.includes('2')) return 'SF';
    if (r.includes('final')) return 'FINAL';
    if (r.includes('3rd') || r.includes('third')) return 'THIRD';
    return 'group';
  }
  function stageOrder(round: string): number {
    return ({ group: 1, R32: 2, R16: 3, QF: 4, SF: 5, THIRD: 6, FINAL: 6 } as any)[round] ?? 1;
  }

  // ===== Sync matches =====
  try {
    const fixtures: any[] = await apiFootball('fixtures', { league: LEAGUE_ID, season: SEASON });
    const matches = fixtures.map((fx: any) => {
      const round = mapRound(fx.league.round);
      return {
        id: `wc26-${fx.fixture.id}`,
        fixture_id: String(fx.fixture.id),
        home_team_id: fx.teams.home.id ? String(fx.teams.home.id) : null,
        away_team_id: fx.teams.away.id ? String(fx.teams.away.id) : null,
        home_score: fx.goals.home,
        away_score: fx.goals.away,
        status: mapStatus(fx.fixture.status.short),
        date: fx.fixture.date,
        round,
        stage_order: stageOrder(round),
        stadium_id: fx.fixture.venue?.id ? String(fx.fixture.venue.id) : null,
        referee: fx.fixture.referee,
        minute: fx.fixture.status.elapsed,
        winner_id: fx.teams.home.winner ? String(fx.teams.home.id)
                 : fx.teams.away.winner ? String(fx.teams.away.id) : null,
      };
    });
    const { error } = await sb.from('matches').upsert(matches, { onConflict: 'id' });
    if (error) throw error;
    results.matches = { ok: true, count: matches.length };
  } catch (e: any) {
    results.matches = { ok: false, error: e.message };
  }

  // ===== Sync standings =====
  try {
    const data: any[] = await apiFootball('standings', { league: LEAGUE_ID, season: SEASON });
    const rows: any[] = [];
    if (data.length && data[0].league.standings) {
      for (const group of data[0].league.standings) {
        for (const s of group) {
          rows.push({
            id: `${String(s.group).replace(/\s/g, '')}-${s.team.id}`,
            group_id: s.group,
            team_id: String(s.team.id),
            played: s.all.played,
            win: s.all.win,
            draw: s.all.draw,
            lose: s.all.lose,
            goals_for: s.all.goals.for,
            goals_against: s.all.goals.against,
            points: s.points,
          });
        }
      }
    }
    const { error } = await sb.from('standings').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    results.standings = { ok: true, count: rows.length };
  } catch (e: any) {
    results.standings = { ok: false, error: e.message };
  }

  return NextResponse.json({
    ok: true,
    duration_ms: Date.now() - startedAt,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Use POST with x-sync-key header to trigger sync',
  });
}
