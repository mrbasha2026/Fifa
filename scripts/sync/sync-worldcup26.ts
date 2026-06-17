/**
 * ============================================================
 * World Cup 2026 — Sync from open-source API (worldcup26.ir)
 * ============================================================
 * Fetches live updates from the open-source WC 2026 API at
 * https://worldcup26.ir (no API key required, free).
 *
 * Updates Supabase with:
 * - Match scores/status (when matches finish)
 * - Group standings
 *
 * Run manually:
 *   bun run scripts/sync/sync-worldcup26.ts
 *
 * Or via API route: POST /api/sync/worldcup26
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local'), override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const API_BASE = 'https://worldcup26.ir';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function apiGet(endpoint: string) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  // API returns { games: [...] }, { teams: [...] }, { groups: [...] }, etc.
  // Find the array in the response
  if (Array.isArray(json)) return json;
  for (const key of ['games', 'teams', 'groups', 'stadiums', 'data', 'response']) {
    if (Array.isArray(json[key])) return json[key];
  }
  return [];
}

function mapStatus(timeElapsed: string, finished: string | boolean): string {
  if (finished === true || finished === 'TRUE' || finished === 'true') return 'FT';
  if (timeElapsed && !['notstarted', 'finished', ''].includes(timeElapsed)) return 'LIVE';
  return 'NS';
}

function mapType(type: string): string {
  return ({ group: 'group', r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', final: 'FINAL', third: 'THIRD' } as any)[type] || 'group';
}

function localDateToISO(localDate: string): string {
  if (!localDate) return new Date().toISOString();
  const [datePart, timePart] = localDate.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = (timePart || '00:00').split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0)).toISOString();
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

async function syncMatches() {
  console.log('⚽ Syncing matches from worldcup26.ir...');
  try {
    const matches: any[] = await apiGet('/get/games');
    console.log(`   Fetched ${matches.length} matches`);

    const rows = matches.map((m: any) => {
      const round = mapType(m.type);
      const homeId = m.home_team_id && m.home_team_id !== '0' ? `t${m.home_team_id}` : '';
      const awayId = m.away_team_id && m.away_team_id !== '0' ? `t${m.away_team_id}` : '';
      const homeScore = m.finished === 'TRUE' || m.finished === true ? parseInt(m.home_score || '0') : null;
      const awayScore = m.finished === 'TRUE' || m.finished === true ? parseInt(m.away_score || '0') : null;
      const status = mapStatus(m.time_elapsed, m.finished);
      const stageOrder = ({ group: 1, R32: 2, R16: 3, QF: 4, SF: 5, FINAL: 6, THIRD: 6 } as any)[round] || 1;

      // Determine winner
      let winnerId: string | null = null;
      if (homeScore !== null && awayScore !== null) {
        if (homeScore > awayScore) winnerId = homeId;
        else if (awayScore > homeScore) winnerId = awayId;
      }

      // Determine bracket_position
      let bracketPosition: number | null = null;
      if (round !== 'group') {
        const matchNum = parseInt(m.id);
        if (round === 'R32') bracketPosition = matchNum - 72;
        else if (round === 'R16') bracketPosition = matchNum - 88;
        else if (round === 'QF') bracketPosition = matchNum - 96;
        else if (round === 'SF') bracketPosition = matchNum - 100;
        else if (round === 'FINAL' || round === 'THIRD') bracketPosition = 1;
      }

      return {
        id: `m${m.id}`,
        fixture_id: String(m.id),
        home_team_id: homeId || null,
        away_team_id: awayId || null,
        home_score: homeScore,
        away_score: awayScore,
        status,
        date: localDateToISO(m.local_date),
        round,
        stage_order: stageOrder,
        group_id: m.type === 'group' ? m.group : null,
        stadium_id: m.stadium_id && m.stadium_id !== '0' ? `s${m.stadium_id}` : null,
        minute: status === 'LIVE' ? parseInt(m.time_elapsed || '0') : null,
        winner_id: winnerId,
        bracket_position: bracketPosition ?? undefined,
      };
    });

    const { error } = await sb.from('matches').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    await updateSyncState('matches', 'success', rows.length);
    console.log(`   ✅ ${rows.length} matches synced`);

    // Count by status
    const byStatus = rows.reduce((acc: any, r: any) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    console.log('   Status breakdown:', JSON.stringify(byStatus));
  } catch (e: any) {
    console.error('   ❌ matches:', e.message);
    await updateSyncState('matches', 'error', 0, e.message);
  }
}

async function syncStandings() {
  console.log('📊 Syncing standings...');
  try {
    const groups: any[] = await apiGet('/get/groups');
    console.log(`   Fetched ${groups.length} groups`);

    const rows: any[] = [];
    groups.forEach((g: any) => {
      (g.teams || []).forEach((team: any) => {
        rows.push({
          id: `${g.name.toLowerCase()}-t${team.team_id}`,
          group_id: g.name,
          team_id: `t${team.team_id}`,
          played: parseInt(team.mp || '0'),
          win: parseInt(team.w || '0'),
          draw: parseInt(team.d || '0'),
          lose: parseInt(team.l || '0'),
          goals_for: parseInt(team.gf || '0'),
          goals_against: parseInt(team.ga || '0'),
          points: parseInt(team.pts || '0'),
        });
      });
    });

    const { error } = await sb.from('standings').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    await updateSyncState('standings', 'success', rows.length);
    console.log(`   ✅ ${rows.length} standings rows synced`);
  } catch (e: any) {
    console.error('   ❌ standings:', e.message);
    await updateSyncState('standings', 'error', 0, e.message);
  }
}

async function main() {
  console.log(`\n🔄 Sync from worldcup26.ir started at ${new Date().toISOString()}\n`);
  await syncMatches();
  await syncStandings();
  await syncPlayersAndEvents();
  await syncTopScorers();
  console.log(`\n✅ Sync complete at ${new Date().toISOString()}\n`);
}

// ===== Parse scorers string =====
function parseScorers(s: string): Array<{ name: string; minute: number; detail?: string }> {
  if (!s || s === 'null') return [];
  const result: Array<{ name: string; minute: number; detail?: string }> = [];
  const regex = /"([^"]+?)\s+(\d+)'(?:\s*\(([^)]+)\))?"/g;
  let match;
  while ((match = regex.exec(s)) !== null) {
    const [, name, minuteStr, detail] = match;
    result.push({
      name: name.trim(),
      minute: parseInt(minuteStr),
      detail: detail ? detail.trim() : undefined,
    });
  }
  if (result.length === 0) {
    const simple = s.match(/"([^"]+)"/g);
    if (simple) {
      simple.forEach(entry => {
        const name = entry.replace(/"/g, '').trim();
        if (name) result.push({ name, minute: 45 });
      });
    }
  }
  return result;
}

// ===== Sync players + events + scorers from matches =====
async function syncPlayersAndEvents() {
  console.log('👤⚡ Syncing players and events...');
  try {
    const matches: any[] = await apiGet('/get/games');
    const finished = matches.filter(m => m.finished === 'TRUE' || m.finished === true);
    console.log(`   ${finished.length} finished matches to process`);

    const playersMap = new Map<string, any>();
    const events: any[] = [];

    finished.forEach(m => {
      const matchId = `m${m.id}`;
      const homeScorers = parseScorers(m.home_scorers);
      const awayScorers = parseScorers(m.away_scorers);

      homeScorers.forEach((s, idx) => {
        const playerId = `p-${m.home_team_id}-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
        if (!playersMap.has(playerId)) {
          playersMap.set(playerId, {
            id: playerId,
            name: s.name,
            name_ar: s.name,
            team_id: `t${m.home_team_id}`,
            position: 'FW',
            nationality: m.home_team_name_en || '',
            nationality_ar: m.home_team_name_en || '',
            photo: '⚽',
            number: 9,
          });
        }
        events.push({
          id: `${matchId}-g-${s.minute}-${idx}`,
          match_id: matchId,
          team_id: `t${m.home_team_id}`,
          type: 'goal',
          player: s.name,
          player_ar: s.name,
          minute: s.minute,
          detail: s.detail,
        });
      });

      awayScorers.forEach((s, idx) => {
        const playerId = `p-${m.away_team_id}-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
        if (!playersMap.has(playerId)) {
          playersMap.set(playerId, {
            id: playerId,
            name: s.name,
            name_ar: s.name,
            team_id: `t${m.away_team_id}`,
            position: 'FW',
            nationality: m.away_team_name_en || '',
            nationality_ar: m.away_team_name_en || '',
            photo: '⚽',
            number: 9,
          });
        }
        events.push({
          id: `${matchId}-g-${s.minute}-${idx}-away`,
          match_id: matchId,
          team_id: `t${m.away_team_id}`,
          type: 'goal',
          player: s.name,
          player_ar: s.name,
          minute: s.minute,
          detail: s.detail,
        });
      });
    });

    // Upsert players
    const players = Array.from(playersMap.values());
    if (players.length > 0) {
      const { error } = await sb.from('players').upsert(players, { onConflict: 'id' });
      if (error) throw error;
    }
    console.log(`   ✅ ${players.length} players synced`);

    // Upsert events in batches
    const BATCH = 100;
    let eventsOk = 0;
    for (let i = 0; i < events.length; i += BATCH) {
      const batch = events.slice(i, i + BATCH);
      const { error } = await sb.from('match_events').upsert(batch, { onConflict: 'id' });
      if (error) console.error(`   ⚠️ events batch ${i}:`, error.message);
      else eventsOk += batch.length;
    }
    console.log(`   ✅ ${eventsOk}/${events.length} events synced`);

    await updateSyncState('players', 'success', players.length);
    await updateSyncState('events', 'success', eventsOk);
  } catch (e: any) {
    console.error('   ❌ players/events:', e.message);
    await updateSyncState('players', 'error', 0, e.message);
  }
}

// ===== Sync top scorers (aggregated from events) =====
async function syncTopScorers() {
  console.log('🎯 Syncing top scorers...');
  try {
    // Read events from Supabase to aggregate
    const { data: events, error } = await sb.from('match_events').select('player, team_id, match_id');
    if (error) throw error;

    const scorersMap = new Map<string, { player_id: string; team_id: string; goals: number; matches: Set<string> }>();
    (events || []).forEach((ev: any) => {
      const key = ev.player;
      if (!scorersMap.has(key)) {
        const playerId = `p-${ev.team_id.replace('t', '')}-${ev.player.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
        scorersMap.set(key, { player_id: playerId, team_id: ev.team_id, goals: 0, matches: new Set() });
      }
      scorersMap.get(key)!.goals++;
      scorersMap.get(key)!.matches.add(ev.match_id);
    });

    const rows = Array.from(scorersMap.values()).map(s => ({
      player_id: s.player_id,
      team_id: s.team_id,
      goals: s.goals,
      assists: 0,
      penalties: 0,
      matches_played: s.matches.size,
    }));

    // Clear and re-insert
    await sb.from('top_scorers').delete().gte('goals', 0);
    if (rows.length > 0) {
      const { error: e2 } = await sb.from('top_scorers').upsert(rows, { onConflict: 'player_id' });
      if (e2) throw e2;
    }
    console.log(`   ✅ ${rows.length} top scorers synced`);
    await updateSyncState('top_scorers', 'success', rows.length);
  } catch (e: any) {
    console.error('   ❌ top_scorers:', e.message);
    await updateSyncState('top_scorers', 'error', 0, e.message);
  }
}

main().catch(err => {
  console.error('\n💥 Fatal:', err);
  process.exit(1);
});
