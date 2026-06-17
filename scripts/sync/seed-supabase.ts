/**
 * ============================================================
 * World Cup 2026 — Seed Script
 * Seeds Supabase with the mock data (48 teams, 16 stadiums,
 * 50+ players, 28 matches, standings, scorers, assists).
 *
 * Run with:
 *   bun run scripts/sync/seed-supabase.ts
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Make sure .env.local exists with the correct values.');
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Import the mock data (compiled by bun from TS)
import {
  TEAMS, PLAYERS, ALL_MATCHES, STANDINGS, TOP_SCORERS, TOP_ASSISTS, STADIUMS,
} from '../../src/lib/wc/data';

async function upsert(table: string, rows: any[], label: string) {
  if (rows.length === 0) {
    console.log(`   ⏭️  ${label}: no rows`);
    return;
  }
  const { error, count } = await sb
    .from(table)
    .upsert(rows, { onConflict: 'id', count: 'exact' });

  if (error) {
    console.error(`   ❌ ${label}:`, error.message);
    return;
  }
  console.log(`   ✅ ${label}: ${count ?? rows.length} rows`);
}

async function main() {
  console.log('\n🌱 Seeding Supabase with World Cup 2026 data...\n');

  // 1. Stadiums
  console.log('📍 Stadiums...');
  await upsert('stadiums', STADIUMS, 'stadiums');

  // 2. Teams (note: data uses `group` field; schema uses `group_id`)
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
  await upsert('players', PLAYERS, 'players');

  // 4. Matches (rename `group` → `group_id`)
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
    winner_id: m.winner_id,
    loser_id: m.loser_id,
    next_match_id: m.next_match_id,
    bracket_position: m.bracket_position,
    man_of_the_match: m.man_of_the_match,
  }));
  await upsert('matches', matches, 'matches');

  // 5. Match events
  console.log('⚡ Match events...');
  const events = ALL_MATCHES.flatMap(m => m.events ?? []);
  await upsert('match_events', events, 'match_events');

  // 6. Standings (rename `group` → `group_id`)
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

  // 7. Top scorers
  console.log('🎯 Top scorers...');
  await upsert('top_scorers', TOP_SCORERS, 'top_scorers');

  // 8. Top assists
  console.log('⭐ Top assists...');
  await upsert('top_assists', TOP_ASSISTS, 'top_assists');

  // 9. Update sync_state
  console.log('\n🔄 Updating sync_state...');
  const syncRows = [
    { id: 'teams', last_status: 'success', rows_affected: TEAMS.length },
    { id: 'players', last_status: 'success', rows_affected: PLAYERS.length },
    { id: 'matches', last_status: 'success', rows_affected: ALL_MATCHES.length },
    { id: 'standings', last_status: 'success', rows_affected: STANDINGS.length },
    { id: 'top_scorers', last_status: 'success', rows_affected: TOP_SCORERS.length },
    { id: 'top_assists', last_status: 'success', rows_affected: TOP_ASSISTS.length },
  ];
  const { error: syncErr } = await sb.from('sync_state').upsert(syncRows, { onConflict: 'id' });
  if (syncErr) console.error('   ❌ sync_state:', syncErr.message);
  else console.log('   ✅ sync_state updated');

  console.log('\n🎉 Seeding complete!\n');
  console.log('   Frontend will now read from Supabase.');
  console.log('   To set up API-Football sync, see scripts/sync/api-football-sync.ts\n');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
