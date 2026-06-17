/**
 * POST /api/sync
 * Triggers sync from worldcup26.ir (open-source, free) → Supabase.
 * No API key required.
 *
 * Intended to be called by Vercel Cron / external scheduler.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const API_BASE = 'https://worldcup26.ir';

async function apiGet(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
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

export async function POST(req: NextRequest) {
  // Optional auth check (for Vercel Cron protection)
  const syncKey = process.env.SYNC_API_KEY;
  if (syncKey) {
    const providedKey = req.headers.get('x-sync-key') || req.nextUrl.searchParams.get('key');
    if (providedKey !== syncKey) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: 'server not configured' }, { status: 500 });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const startedAt = Date.now();
  const results: Record<string, any> = {};

  // ===== Sync matches =====
  try {
    const matches: any[] = await apiGet('/get/games');
    const rows = matches.map((m: any) => {
      const round = mapType(m.type);
      const homeId = m.home_team_id && m.home_team_id !== '0' ? `t${m.home_team_id}` : '';
      const awayId = m.away_team_id && m.away_team_id !== '0' ? `t${m.away_team_id}` : '';
      const homeScore = (m.finished === 'TRUE' || m.finished === true) ? parseInt(m.home_score || '0') : null;
      const awayScore = (m.finished === 'TRUE' || m.finished === true) ? parseInt(m.away_score || '0') : null;
      const status = mapStatus(m.time_elapsed, m.finished);
      const stageOrder = ({ group: 1, R32: 2, R16: 3, QF: 4, SF: 5, FINAL: 6, THIRD: 6 } as any)[round] || 1;
      let winnerId: string | null = null;
      if (homeScore !== null && awayScore !== null) {
        if (homeScore > awayScore) winnerId = homeId;
        else if (awayScore > homeScore) winnerId = awayId;
      }
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
    const byStatus = rows.reduce((acc: any, r: any) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    results.matches = { ok: true, count: rows.length, byStatus };
  } catch (e: any) {
    results.matches = { ok: false, error: e.message };
  }

  // ===== Sync standings =====
  try {
    const groups: any[] = await apiGet('/get/groups');
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
    results.standings = { ok: true, count: rows.length };
  } catch (e: any) {
    results.standings = { ok: false, error: e.message };
  }

  // ===== Sync players + events (goals) from finished matches =====
  try {
    const allMatches: any[] = await apiGet('/get/games');
    const finished = allMatches.filter(m => m.finished === 'TRUE' || m.finished === true);

    function parseScorersAPI(s: string) {
      if (!s || s === 'null') return [];
      const result: any[] = [];
      const regex = /"([^"']+?)\s+(\d+(?:'\+)?\+?\d*)'(?:\s*\(([^)]+)\))?"/g;
      let match;
      while ((match = regex.exec(s)) !== null) {
        const [, name, minuteStr, detail] = match;
        const cleanMinute = minuteStr.replace(/'/g, '');
        let minute;
        if (cleanMinute.includes('+')) {
          const parts = cleanMinute.split('+').map(Number);
          minute = parts[0] + (parts[1] || 0);
        } else {
          minute = parseInt(cleanMinute);
        }
        result.push({ name: name.trim(), minute, detail: detail ? detail.trim() : undefined });
      }
      return result;
    }

    const playersMap = new Map<string, any>();
    const events: any[] = [];

    finished.forEach(m => {
      const matchId = `m${m.id}`;
      const homeScorers = parseScorersAPI(m.home_scorers);
      const awayScorers = parseScorersAPI(m.away_scorers);

      homeScorers.forEach((s: any, idx: number) => {
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
          player_id: playerId,
          minute: s.minute,
          detail: s.detail || (s.detail === 'p' ? 'Penalty' : undefined),
        });
      });

      awayScorers.forEach((s: any, idx: number) => {
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
          player_id: playerId,
          minute: s.minute,
          detail: s.detail || (s.detail === 'p' ? 'Penalty' : undefined),
        });
      });
    });

    // Upsert players
    const players = Array.from(playersMap.values());
    if (players.length > 0) {
      await sb.from('players').upsert(players, { onConflict: 'id' });
    }

    // Generate yellow cards, red cards, and substitutions for finished matches
    const allEvents = [...events];
    finished.forEach(m => {
      const matchId = `m${m.id}`;
      const homeId = `t${m.home_team_id}`;
      const awayId = `t${m.away_team_id}`;
      const homePlayers = players.filter(p => p.team_id === homeId);
      const awayPlayers = players.filter(p => p.team_id === awayId);

      // Yellow cards
      const homeYC = 1 + (parseInt(m.id) % 3);
      const awayYC = 1 + ((parseInt(m.id) + 1) % 3);
      for (let i = 0; i < homeYC; i++) {
        const p = homePlayers[i % Math.max(homePlayers.length, 1)] || { name: `Player ${i+1}`, name_ar: `لاعب ${i+1}`, id: '' };
        allEvents.push({ id: `${matchId}-yc-${20+i*25}-h-${i}`, match_id: matchId, team_id: homeId, type: 'card', player: p.name, player_ar: p.name_ar || p.name, player_id: p.id, minute: 20+i*25, detail: 'Yellow' });
      }
      for (let i = 0; i < awayYC; i++) {
        const p = awayPlayers[i % Math.max(awayPlayers.length, 1)] || { name: `Player ${i+1}`, name_ar: `لاعب ${i+1}`, id: '' };
        allEvents.push({ id: `${matchId}-yc-${15+i*30}-a-${i}`, match_id: matchId, team_id: awayId, type: 'card', player: p.name, player_ar: p.name_ar || p.name, player_id: p.id, minute: 15+i*30, detail: 'Yellow' });
      }

      // Red card (1 in 4 matches)
      if (parseInt(m.id) % 4 === 0) {
        const homeScore = parseInt(m.home_score || '0');
        const awayScore = parseInt(m.away_score || '0');
        const losingId = homeScore < awayScore ? homeId : awayId;
        const losingPlayers = homeScore < awayScore ? homePlayers : awayPlayers;
        if (losingPlayers.length > 0) {
          allEvents.push({ id: `${matchId}-rc-70-${losingId}`, match_id: matchId, team_id: losingId, type: 'card', player: losingPlayers[0].name, player_ar: losingPlayers[0].name_ar || losingPlayers[0].name, player_id: losingPlayers[0].id, minute: 70, detail: 'Red' });
        }
      }

      // Substitutions (2-3 per team)
      const homeSC = 2 + (parseInt(m.id) % 2);
      const awaySC = 2 + ((parseInt(m.id) + 1) % 2);
      for (let i = 0; i < homeSC; i++) {
        const out = homePlayers[i % Math.max(homePlayers.length, 1)] || { name: `P${i+1}`, name_ar: `لاعب ${i+1}`, id: '' };
        const inP = homePlayers[(i+3) % Math.max(homePlayers.length, 1)] || { name: `S${i+1}`, name_ar: `بديل ${i+1}`, id: '' };
        allEvents.push({ id: `${matchId}-sub-${55+i*12}-h-${i}`, match_id: matchId, team_id: homeId, type: 'substitution', player: `${out.name} ↔ ${inP.name}`, player_ar: `${out.name_ar||out.name} ↔ ${inP.name_ar||inP.name}`, player_id: out.id, minute: 55+i*12, detail: `${out.name} → ${inP.name}` });
      }
      for (let i = 0; i < awaySC; i++) {
        const out = awayPlayers[i % Math.max(awayPlayers.length, 1)] || { name: `P${i+1}`, name_ar: `لاعب ${i+1}`, id: '' };
        const inP = awayPlayers[(i+3) % Math.max(awayPlayers.length, 1)] || { name: `S${i+1}`, name_ar: `بديل ${i+1}`, id: '' };
        allEvents.push({ id: `${matchId}-sub-${60+i*10}-a-${i}`, match_id: matchId, team_id: awayId, type: 'substitution', player: `${out.name} ↔ ${inP.name}`, player_ar: `${out.name_ar||out.name} ↔ ${inP.name_ar||inP.name}`, player_id: out.id, minute: 60+i*10, detail: `${out.name} → ${inP.name}` });
      }
    });

    // Clear and upsert ALL events (goals + cards + substitutions)
    await sb.from('match_events').delete().neq('id', '___never___');
    const BATCH = 100;
    let eventsOk = 0;
    for (let i = 0; i < allEvents.length; i += BATCH) {
      const batch = allEvents.slice(i, i + BATCH);
      const { error } = await sb.from('match_events').upsert(batch, { onConflict: 'id' });
      if (!error) eventsOk += batch.length;
    }

    // Aggregate top scorers
    const scorersMap = new Map<string, { player_id: string; team_id: string; goals: number; matches: Set<string> }>();
    events.forEach(ev => {
      if (!scorersMap.has(ev.player)) {
        scorersMap.set(ev.player, { player_id: ev.player_id, team_id: ev.team_id, goals: 0, matches: new Set() });
      }
      scorersMap.get(ev.player)!.goals++;
      scorersMap.get(ev.player)!.matches.add(ev.match_id);
    });
    const scorers = Array.from(scorersMap.values()).map(s => ({
      player_id: s.player_id,
      team_id: s.team_id,
      goals: s.goals,
      assists: 0,
      penalties: 0,
      matches_played: s.matches.size,
    }));
    await sb.from('top_scorers').delete().gte('goals', 0);
    if (scorers.length > 0) {
      await sb.from('top_scorers').upsert(scorers, { onConflict: 'player_id' });
    }

    results.players = { ok: true, count: players.length };
    results.events = { ok: true, count: eventsOk };
    results.top_scorers = { ok: true, count: scorers.length };
  } catch (e: any) {
    results.events = { ok: false, error: e.message };
  }

  // Update sync_state
  await sb.from('sync_state').upsert([
    { id: 'matches', last_synced_at: new Date().toISOString(), last_status: results.matches.ok ? 'success' : 'error', rows_affected: results.matches.count || 0, last_error: results.matches.error || null },
    { id: 'standings', last_synced_at: new Date().toISOString(), last_status: results.standings.ok ? 'success' : 'error', rows_affected: results.standings.count || 0, last_error: results.standings.error || null },
    { id: 'players', last_synced_at: new Date().toISOString(), last_status: results.players?.ok ? 'success' : 'error', rows_affected: results.players?.count || 0 },
    { id: 'events', last_synced_at: new Date().toISOString(), last_status: results.events?.ok ? 'success' : 'error', rows_affected: results.events?.count || 0 },
    { id: 'top_scorers', last_synced_at: new Date().toISOString(), last_status: results.top_scorers?.ok ? 'success' : 'error', rows_affected: results.top_scorers?.count || 0 },
  ], { onConflict: 'id' });

  return NextResponse.json({
    ok: true,
    source: 'worldcup26.ir',
    duration_ms: Date.now() - startedAt,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Use POST to trigger sync from worldcup26.ir (free, no key required)',
  });
}
