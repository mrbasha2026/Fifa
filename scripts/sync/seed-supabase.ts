/**
 * Seed Supabase with World Cup 2026 mock data.
 * Maps the mock data shape (with `group` field) to the schema shape (with `group_id`).
 *
 * Run with: bun run supabase:seed
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('❌ Missing Supabase env vars. Check .env.local');
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

import {
  TEAMS, PLAYERS, ALL_MATCHES, STANDINGS, TOP_SCORERS, TOP_ASSISTS, STADIUMS,
} from '../../src/lib/wc/data';
import { MATCH_EVENTS } from '../../src/lib/wc/data-aux';

async function upsert<T>(table: string, rows: T[], label: string, onConflict = 'id') {
  if (rows.length === 0) {
    console.log(`   ⏭️  ${label}: no rows`);
    return;
  }
  const { error, count } = await sb
    .from(table)
    .upsert(rows as any[], { onConflict, count: 'exact' });
  if (error) {
    console.error(`   ❌ ${label}:`, error.message);
    return;
  }
  console.log(`   ✅ ${label}: ${count ?? rows.length} rows`);
}

async function main() {
  console.log('\n🌱 Seeding Supabase with World Cup 2026 data...\n');

  // 1. Stadiums (no field renames needed)
  console.log('📍 Stadiums...');
  await upsert('stadiums', STADIUMS, 'stadiums');

  // 2. Teams — rename `group` → `group_id`, drop `events`
  console.log('🏳️  Teams...');
  const teams = TEAMS.map(t => ({
    id: t.id,
    name: t.name,
    name_ar: t.name_ar,
    logo: t.logo,
    flag: t.flag,
    group_id: t.group,
    fifa_code: t.fifa_code,
    fifa_ranking: t.fifa_ranking,
    coach: t.coach,
  }));
  await upsert('teams', teams, 'teams');

  // 3. Players
  console.log('👤 Players...');
  const players = PLAYERS.map(p => ({
    id: p.id,
    name: p.name,
    name_ar: p.name_ar,
    team_id: p.team_id,
    position: p.position,
    nationality: p.nationality,
    nationality_ar: p.nationality_ar,
    photo: p.photo,
    number: p.number,
    age: p.age,
    club: p.club,
  }));
  await upsert('players', players, 'players');

  // 4. Matches — rename `group` → `group_id`, drop relation fields
  console.log('⚽ Matches...');
  const matches = ALL_MATCHES.map(m => ({
    id: m.id,
    fixture_id: m.fixture_id,
    home_team_id: m.home_team_id || null,
    away_team_id: m.away_team_id || null,
    home_score: m.home_score,
    away_score: m.away_score,
    status: m.status,
    date: m.date,
    round: m.round,
    stage_order: m.stage_order,
    group_id: m.group || null,
    stadium_id: m.stadium_id || null,
    referee: m.referee,
    minute: m.minute,
    winner_id: m.winner_id ?? null,
    loser_id: m.loser_id ?? null,
    next_match_id: m.next_match_id ?? null,
    bracket_position: m.bracket_position,
    man_of_the_match: m.man_of_the_match ?? null,
  }));
  await upsert('matches', matches, 'matches');

  // 5. Match events — from data-aux.ts (extracted from scorers)
  console.log('⚡ Match events...');
  const events = (MATCH_EVENTS as any[]).map(ev => ({
    id: ev.id,
    match_id: ev.matchId || ev.match_id,
    team_id: ev.teamId || ev.team_id || null,
    type: ev.type,
    player: ev.player,
    player_ar: ev.playerAr || ev.player_ar,
    minute: ev.minute,
    detail: ev.detail,
  }));
  // Upsert in small batches (avoid payload size limits)
  const BATCH = 100;
  let eventsOk = 0, eventsFail = 0;
  for (let i = 0; i < events.length; i += BATCH) {
    const batch = events.slice(i, i + BATCH);
    const { error } = await sb.from('match_events').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`   ❌ match_events batch ${i}:`, error.message);
      eventsFail += batch.length;
    } else {
      eventsOk += batch.length;
    }
  }
  console.log(`   ${eventsFail === 0 ? '✅' : '⚠️'} match_events: ${eventsOk}/${events.length} (failed: ${eventsFail})`);

  // 6. Standings — rename `group` → `group_id`, drop computed `goal_diff`
  console.log('📊 Standings...');
  const standings = STANDINGS.map(s => ({
    id: s.id,
    group_id: s.group,
    team_id: s.team_id,
    played: s.played,
    win: s.win,
    draw: s.draw,
    lose: s.lose,
    goals_for: s.goals_for,
    goals_against: s.goals_against,
    points: s.points,
  }));
  await upsert('standings', standings, 'standings');

  // 7. Top scorers — PK is player_id (no `id` column)
  console.log('🎯 Top scorers...');
  const scorers = TOP_SCORERS.map(s => ({
    player_id: s.player_id,
    team_id: s.team_id,
    goals: s.goals,
    assists: s.assists,
    penalties: s.penalties ?? 0,
    matches_played: s.matches_played ?? 0,
  }));
  await upsert('top_scorers', scorers, 'top_scorers', 'player_id');

  // 8. Top assists — PK is player_id (no `id` column)
  console.log('⭐ Top assists...');
  const assists = TOP_ASSISTS.map(a => ({
    player_id: a.player_id,
    team_id: a.team_id,
    assists: a.assists,
    goals: a.goals,
    matches_played: a.matches_played ?? 0,
  }));
  await upsert('top_assists', assists, 'top_assists', 'player_id');

  // 9. sync_state
  console.log('\n🔄 Updating sync_state...');
  const syncRows = [
    { id: 'teams', last_status: 'success', rows_affected: TEAMS.length, last_synced_at: new Date().toISOString() },
    { id: 'players', last_status: 'success', rows_affected: PLAYERS.length, last_synced_at: new Date().toISOString() },
    { id: 'matches', last_status: 'success', rows_affected: ALL_MATCHES.length, last_synced_at: new Date().toISOString() },
    { id: 'standings', last_status: 'success', rows_affected: STANDINGS.length, last_synced_at: new Date().toISOString() },
    { id: 'top_scorers', last_status: 'success', rows_affected: TOP_SCORERS.length, last_synced_at: new Date().toISOString() },
    { id: 'top_assists', last_status: 'success', rows_affected: TOP_ASSISTS.length, last_synced_at: new Date().toISOString() },
  ];
  const { error: e9 } = await sb.from('sync_state').upsert(syncRows, { onConflict: 'id' });
  console.log(e9 ? `   ❌ sync_state: ${e9.message}` : '   ✅ sync_state updated');

  // Verify counts
  console.log('\n📊 Verification:');
  for (const [table, expected] of [
    ['teams', TEAMS.length],
    ['players', PLAYERS.length],
    ['matches', ALL_MATCHES.length],
    ['standings', STANDINGS.length],
    ['top_scorers', TOP_SCORERS.length],
    ['top_assists', TOP_ASSISTS.length],
    ['stadiums', STADIUMS.length],
  ] as const) {
    const { count, error } = await sb.from(table).select('*', { count: 'exact', head: true });
    console.log(`   ${error ? '❌' : '✅'} ${table}: ${count ?? 0}/${expected}`);
  }

  console.log('\n🎉 Seeding complete!\n');
}

main().catch(e => {
  console.error('\n💥 Fatal:', e);
  process.exit(1);
});
