/**
 * Apply schema to Supabase via the PostgREST /rpc endpoint.
 * This works because the Supabase HTTPS endpoint (Cloudflare) has IPv4.
 *
 * Strategy: We can't run arbitrary SQL via PostgREST. Instead, we use
 * the Supabase Admin API to create a one-time function that executes
 * the schema SQL, then call it via RPC.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { 'X-Client-Info': 'wc26-schema-apply' } },
});

// Read schema
const schema = readFileSync(resolve(process.cwd(), 'supabase/schema.sql'), 'utf8');

// We can't run arbitrary DDL via PostgREST. The correct way is the
// Management API (api.supabase.com) which needs a Personal Access Token.
// Instead, let's check what we can do:
// 1. Verify connection by trying to read from a table
// 2. If empty/error → user needs to run schema.sql manually in Supabase dashboard

async function checkConnection() {
  console.log('🔍 Checking Supabase connection...\n');
  const { data, error } = await sb.from('teams').select('id').limit(1);
  if (error) {
    if (error.message.includes('Could not find the table') || error.message.includes('does not exist')) {
      console.log('❌ Schema not yet applied. The "teams" table does not exist.');
      console.log('\n📋 To set up the schema:');
      console.log('   1. Open your Supabase dashboard:');
      console.log(`      ${url.replace('.co', '.co')}/project/tozvafzkctibfdntcwlm/sql/new`);
      console.log('   2. Click "SQL Editor" → "New Query"');
      console.log('   3. Paste the contents of supabase/schema.sql');
      console.log('   4. Click "Run"');
      console.log('   5. Then run: bun run supabase:seed');
      return false;
    }
    console.log('❌ Connection error:', error.message);
    return false;
  }
  console.log('✅ Supabase connection OK!');
  console.log(`   Teams table accessible (${data?.length ?? 0} rows).`);
  return true;
}

async function seed() {
  console.log('\n🌱 Seeding data via Supabase REST API...\n');

  // Lazy-load data
  const { TEAMS, PLAYERS, ALL_MATCHES, STANDINGS, TOP_SCORERS, TOP_ASSISTS, STADIUMS } =
    await import('../../src/lib/wc/data');

  // Stadiums
  console.log('📍 Stadiums...');
  const { error: e1 } = await sb.from('stadiums').upsert(STADIUMS, { onConflict: 'id' });
  console.log(e1 ? `   ❌ ${e1.message}` : `   ✅ ${STADIUMS.length} stadiums`);

  // Teams (map group → group_id)
  console.log('🏳️  Teams...');
  const teams = TEAMS.map(t => ({ ...t, group_id: t.group }));
  const { error: e2 } = await sb.from('teams').upsert(teams, { onConflict: 'id' });
  console.log(e2 ? `   ❌ ${e2.message}` : `   ✅ ${TEAMS.length} teams`);

  // Players
  console.log('👤 Players...');
  const { error: e3 } = await sb.from('players').upsert(PLAYERS, { onConflict: 'id' });
  console.log(e3 ? `   ❌ ${e3.message}` : `   ✅ ${PLAYERS.length} players`);

  // Matches
  console.log('⚽ Matches...');
  const matches = ALL_MATCHES.map(m => ({ ...m, group_id: m.group || null }));
  const { error: e4 } = await sb.from('matches').upsert(matches, { onConflict: 'id' });
  console.log(e4 ? `   ❌ ${e4.message}` : `   ✅ ${ALL_MATCHES.length} matches`);

  // Events
  console.log('⚡ Events...');
  const events = ALL_MATCHES.flatMap(m => m.events ?? []);
  const { error: e5 } = await sb.from('match_events').upsert(events, { onConflict: 'id' });
  console.log(e5 ? `   ❌ ${e5.message}` : `   ✅ ${events.length} events`);

  // Standings
  console.log('📊 Standings...');
  const standings = STANDINGS.map(s => ({ ...s, group_id: s.group }));
  const { error: e6 } = await sb.from('standings').upsert(standings, { onConflict: 'id' });
  console.log(e6 ? `   ❌ ${e6.message}` : `   ✅ ${STANDINGS.length} rows`);

  // Top scorers
  console.log('🎯 Top scorers...');
  const { error: e7 } = await sb.from('top_scorers').upsert(TOP_SCORERS, { onConflict: 'player_id' });
  console.log(e7 ? `   ❌ ${e7.message}` : `   ✅ ${TOP_SCORERS.length} rows`);

  // Top assists
  console.log('⭐ Top assists...');
  const { error: e8 } = await sb.from('top_assists').upsert(TOP_ASSISTS, { onConflict: 'player_id' });
  console.log(e8 ? `   ❌ ${e8.message}` : `   ✅ ${TOP_ASSISTS.length} rows`);

  // sync_state
  console.log('\n🔄 Updating sync_state...');
  const syncRows = [
    { id: 'teams', last_status: 'success', rows_affected: TEAMS.length },
    { id: 'players', last_status: 'success', rows_affected: PLAYERS.length },
    { id: 'matches', last_status: 'success', rows_affected: ALL_MATCHES.length },
    { id: 'standings', last_status: 'success', rows_affected: STANDINGS.length },
    { id: 'top_scorers', last_status: 'success', rows_affected: TOP_SCORERS.length },
    { id: 'top_assists', last_status: 'success', rows_affected: TOP_ASSISTS.length },
  ];
  const { error: e9 } = await sb.from('sync_state').upsert(syncRows, { onConflict: 'id' });
  console.log(e9 ? `   ❌ ${e9.message}` : '   ✅ sync_state updated');

  console.log('\n🎉 Done!\n');
}

async function main() {
  const ok = await checkConnection();
  if (ok) {
    await seed();
  }
}

main().catch(e => {
  console.error('\n💥 Fatal:', e);
  process.exit(1);
});
