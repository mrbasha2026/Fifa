/**
 * Clear all match-related tables and re-seed with realistic data.
 * Use this when match data shape changes drastically.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('\n🧹 Clearing all match-related tables...\n');

  // Delete in dependency order
  const tables = ['match_events', 'match_lineups', 'top_scorers', 'top_assists', 'standings', 'matches'];
  for (const t of tables) {
    const { error, count } = await sb.from(t).delete({ count: 'exact' }).neq('id', '___never___');
    // For tables without 'id' column, use a different filter
    if (error) {
      // Try deleting all by a column that always exists
      const { error: e2, count: c2 } = await sb.from(t).delete({ count: 'exact' }).gte('created_at', '1970-01-01');
      console.log(`   ${t}: ${e2 ? '❌ ' + e2.message : `✅ ${c2 ?? 0} deleted`}`);
    } else {
      console.log(`   ${t}: ✅ ${count ?? 0} deleted`);
    }
  }

  console.log('\n✅ Done. Now run: bun run supabase:seed\n');
}

main().catch(e => {
  console.error('💥 Fatal:', e);
  process.exit(1);
});
