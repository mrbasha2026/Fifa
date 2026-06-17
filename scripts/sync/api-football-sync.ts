/**
 * ============================================================
 * World Cup 2026 — API-Football → Supabase Sync
 * ============================================================
 * This script fetches live data from API-Football and writes
 * it to Supabase. It is intended to be run on a schedule
 * (every 5-10 minutes for matches, every 30-60 minutes for
 * standings/scorers).
 *
 * Run manually:
 *   bun run scripts/sync/api-football-sync.ts
 *
 * Schedule with cron / Vercel Cron / Supabase Edge Functions:
 *   */5 * * * *  cd /app && bun run scripts/sync/api-football-sync.ts >> /var/log/wc-sync.log 2>&1
 *
 * Or via Next.js API route: POST /api/sync
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const API_KEY = process.env.API_FOOTBALL_KEY!;
const API_BASE = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}
if (!API_KEY) {
  console.error('❌ Missing API_FOOTBALL_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---- API-Football config ----
// WC 2026 league ID in API-Football: 1 (World Cup) — season 2026
// (verify in dashboard; may differ for your subscription)
const LEAGUE_ID = 1;
const SEASON = 2026;

async function apiFootball(endpoint: string, params: Record<string, string | number>) {
  const url = new URL(`${API_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-Football ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.response;
}

async function updateSyncState(id: string, status: 'success' | 'error', rows: number, error?: string) {
  await sb.from('sync_state').upsert({
    id,
    last_synced_at: new Date().toISOString(),
    last_status: status,
    last_error: error ?? null,
    rows_affected: rows,
  }, { onConflict: 'id' });
}

// ---- Sync functions ----

async function syncMatches() {
  console.log('⚽ Syncing matches...');
  try {
    const fixtures: any[] = await apiFootball('fixtures', {
      league: LEAGUE_ID,
      season: SEASON,
    });

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
    await updateSyncState('matches', 'success', matches.length);
    console.log(`   ✅ ${matches.length} matches synced`);
  } catch (e: any) {
    console.error('   ❌ matches:', e.message);
    await updateSyncState('matches', 'error', 0, e.message);
  }
}

async function syncStandings() {
  console.log('📊 Syncing standings...');
  try {
    const data: any[] = await apiFootball('standings', {
      league: LEAGUE_ID,
      season: SEASON,
    });
    if (!data.length) throw new Error('no standings returned');

    const rows: any[] = [];
    for (const group of data[0].league.standings) {
      for (const s of group) {
        rows.push({
          id: `${s.group.replace(/\s/g, '')}-${s.team.id}`,
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
    const { error } = await sb.from('standings').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    await updateSyncState('standings', 'success', rows.length);
    console.log(`   ✅ ${rows.length} standings rows synced`);
  } catch (e: any) {
    console.error('   ❌ standings:', e.message);
    await updateSyncState('standings', 'error', 0, e.message);
  }
}

async function syncTopScorers() {
  console.log('🎯 Syncing top scorers...');
  try {
    const data: any[] = await apiFootball('players/topscorers', {
      league: LEAGUE_ID,
      season: SEASON,
    });
    const rows = data.map((p: any) => ({
      player_id: String(p.player.id),
      team_id: String(p.statistics[0].team.id),
      goals: p.statistics[0].goals.total || 0,
      assists: p.statistics[0].goals.assists || 0,
      penalties: p.statistics[0].penalty?.scored || 0,
      matches_played: p.statistics[0].games.appearences || 0,
    }));
    const { error } = await sb.from('top_scorers').upsert(rows, { onConflict: 'player_id' });
    if (error) throw error;
    await updateSyncState('top_scorers', 'success', rows.length);
    console.log(`   ✅ ${rows.length} scorers synced`);
  } catch (e: any) {
    console.error('   ❌ top_scorers:', e.message);
    await updateSyncState('top_scorers', 'error', 0, e.message);
  }
}

async function syncTopAssists() {
  console.log('⭐ Syncing top assists...');
  try {
    const data: any[] = await apiFootball('players/topassists', {
      league: LEAGUE_ID,
      season: SEASON,
    });
    const rows = data.map((p: any) => ({
      player_id: String(p.player.id),
      team_id: String(p.statistics[0].team.id),
      assists: p.statistics[0].goals.assists || 0,
      goals: p.statistics[0].goals.total || 0,
      matches_played: p.statistics[0].games.appearences || 0,
    }));
    const { error } = await sb.from('top_assists').upsert(rows, { onConflict: 'player_id' });
    if (error) throw error;
    await updateSyncState('top_assists', 'success', rows.length);
    console.log(`   ✅ ${rows.length} assisters synced`);
  } catch (e: any) {
    console.error('   ❌ top_assists:', e.message);
    await updateSyncState('top_assists', 'error', 0, e.message);
  }
}

async function syncMatchEvents(matchId: string, fixtureId: string) {
  console.log(`⚡ Syncing events for match ${matchId}...`);
  try {
    const data: any[] = await apiFootball('fixtures/events', { fixture: fixtureId });
    const rows = data.map((ev: any) => ({
      id: `${matchId}-${ev.time.elapsed}-${ev.team.id}-${ev.player.id ?? 'x'}`,
      match_id: matchId,
      team_id: String(ev.team.id),
      type: mapEventType(ev.type),
      player: ev.player.name,
      player_ar: null,  // API-Football doesn't provide Arabic names
      player_id: ev.player.id ? String(ev.player.id) : null,
      minute: ev.time.elapsed,
      detail: ev.detail,
    }));
    const { error } = await sb.from('match_events').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    console.log(`   ✅ ${rows.length} events synced`);
  } catch (e: any) {
    console.error(`   ❌ events:`, e.message);
  }
}

// ---- Helpers ----
function mapRound(round: string | null): 'group' | 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL' | 'THIRD' {
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
  return { group: 1, R32: 2, R16: 3, QF: 4, SF: 5, THIRD: 6, FINAL: 6 }[round] ?? 1;
}
function mapStatus(s: string): 'NS' | 'LIVE' | 'HT' | 'FT' | 'AET' | 'PEN' {
  const map: Record<string, any> = {
    NS: 'NS', TBD: 'NS',
    '1H': 'LIVE', '2H': 'LIVE', ET: 'LIVE', BT: 'LIVE', P: 'LIVE', SUSP: 'LIVE', INT: 'LIVE',
    HT: 'HT',
    FT: 'FT', AET: 'AET', PEN: 'PEN',
    PST: 'NS', CANC: 'NS', ABD: 'NS', AWD: 'FT', WO: 'FT',
  };
  return map[s] ?? 'NS';
}
function mapEventType(t: string): 'goal' | 'card' | 'substitution' {
  const lt = t.toLowerCase();
  if (lt === 'goal' || lt.includes('var')) return 'goal';
  if (lt === 'card') return 'card';
  if (lt === 'subst') return 'substitution';
  return 'goal';
}

// ---- Main ----
async function main() {
  console.log(`\n🔄 Sync started at ${new Date().toISOString()}\n`);

  // Get latest matches first (for live updates)
  await syncMatches();

  // Heavier syncs — can run less frequently
  const hour = new Date().getUTCHours();
  if (hour % 1 === 0) {  // every run for demo; tune to 30-60 min in prod
    await syncStandings();
    await syncTopScorers();
    await syncTopAssists();
  }

  // Optionally sync events for recent LIVE/FT matches
  // ( Uncomment to enable — each match is one API call )
  // const { data: recentMatches } = await sb
  //   .from('matches')
  //   .select('id, fixture_id')
  //   .in('status', ['LIVE', 'FT', 'AET', 'PEN'])
  //   .gte('date', new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString())
  //   .limit(20);
  // for (const m of recentMatches ?? []) {
  //   if (m.fixture_id) await syncMatchEvents(m.id, m.fixture_id);
  // }

  console.log(`\n✅ Sync complete at ${new Date().toISOString()}\n`);
}

main().catch(err => {
  console.error('\n💥 Fatal:', err);
  process.exit(1);
});
