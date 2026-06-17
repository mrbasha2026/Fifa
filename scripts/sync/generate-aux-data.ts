/**
 * ============================================================
 * Generate missing data tables from worldcup26.ir matches:
 * - Players (extracted from scorers' names)
 * - Match events (goals, with scorer name + minute)
 * - Top scorers (aggregated)
 * - Top assists (empty — no data available)
 * - Match statistics (auto-generated from scores)
 *
 * Fetches live data from worldcup26.ir, then writes
 * src/lib/wc/data-aux.ts with the generated auxiliary data.
 * ============================================================
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', '..', 'data', 'wc2026');

// Read teams from local file (these don't change)
const teamsRaw = JSON.parse(readFileSync(resolve(dataDir, 'teams.json'), 'utf8'));

// Fetch live matches from worldcup26.ir
async function fetchLiveMatches() {
  console.log('📡 Fetching live matches from worldcup26.ir...');
  const res = await fetch('https://worldcup26.ir/get/games');
  if (!res.ok) {
    console.log('   ⚠️ Live fetch failed, using local data');
    return JSON.parse(readFileSync(resolve(dataDir, 'matches.json'), 'utf8'));
  }
  const json = await res.json();
  const matches = json.games || json;
  console.log('   ✅ Fetched', matches.length, 'matches');
  return matches;
}

const matchesRaw = await fetchLiveMatches();

// Parse scorers string: {"Nestory Irankunda 27'","C. Metcalfe 75'"}
function parseScorers(s: string): Array<{ name: string; minute: number; detail?: string }> {
  if (!s || s === 'null') return [];
  const result: Array<{ name: string; minute: number; detail?: string }> = [];
  // Extract each "Name NN'" entry
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
  // Fallback: try simple "Name" entries without minutes
  if (result.length === 0) {
    const simple = s.match(/"([^"]+)"/g);
    if (simple) {
      simple.forEach(entry => {
        const name = entry.replace(/"/g, '').trim();
        if (name) result.push({ name, minute: 45 }); // default to 45'
      });
    }
  }
  return result;
}

// Build team lookup
const teamById: Record<string, any> = {};
teamsRaw.forEach((t: any) => { teamById[t.id] = t; });

// Arabic translations for common player first names / surnames patterns
// (we keep original Latin name since Arabic translations aren't provided by source)
const arabicPlayerNames: Record<string, string> = {
  'Lionel Messi': 'ليونيل ميسي',
  'K. Mbappé': 'كيليان مبابي',
  'Erling Haaland': 'إيرلينغ هالاند',
  'Cristiano Ronaldo': 'كريستيانو رونالدو',
};

// ===== Generate Players =====
const playersMap = new Map<string, { id: string; name: string; teamId: string; teamName: string; teamIdNum: string }>();

matchesRaw.forEach((m: any) => {
  if (m.finished !== 'TRUE' && m.finished !== true) return;
  const homeScorers = parseScorers(m.home_scorers);
  const awayScorers = parseScorers(m.away_scorers);

  homeScorers.forEach(s => {
    if (!playersMap.has(s.name)) {
      const playerId = `p-${m.home_team_id}-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
      playersMap.set(s.name, {
        id: playerId,
        name: s.name,
        teamId: `t${m.home_team_id}`,
        teamName: teamById[m.home_team_id]?.name_en || '',
        teamIdNum: m.home_team_id,
      });
    }
  });
  awayScorers.forEach(s => {
    if (!playersMap.has(s.name)) {
      const playerId = `p-${m.away_team_id}-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
      playersMap.set(s.name, {
        id: playerId,
        name: s.name,
        teamId: `t${m.away_team_id}`,
        teamName: teamById[m.away_team_id]?.name_en || '',
        teamIdNum: m.away_team_id,
      });
    }
  });
});

const players = Array.from(playersMap.values());

// ===== Generate Match Events =====
const events: Array<{ id: string; matchId: string; teamId: string; type: string; player: string; playerAr: string; minute: number; detail?: string }> = [];

matchesRaw.forEach((m: any) => {
  if (m.finished !== 'TRUE' && m.finished !== true) return;
  const matchId = `m${m.id}`;
  const homeScorers = parseScorers(m.home_scorers);
  const awayScorers = parseScorers(m.away_scorers);

  homeScorers.forEach((s, idx) => {
    events.push({
      id: `${matchId}-g-${s.minute}-${idx}`,
      matchId,
      teamId: `t${m.home_team_id}`,
      type: 'goal',
      player: s.name,
      playerAr: arabicPlayerNames[s.name] || s.name,
      minute: s.minute,
      detail: s.detail,
    });
  });
  awayScorers.forEach((s, idx) => {
    events.push({
      id: `${matchId}-g-${s.minute}-${idx}-away`,
      matchId,
      teamId: `t${m.away_team_id}`,
      type: 'goal',
      player: s.name,
      playerAr: arabicPlayerNames[s.name] || s.name,
      minute: s.minute,
      detail: s.detail,
    });
  });
});

// ===== Generate Top Scorers =====
const scorersMap = new Map<string, { playerId: string; name: string; teamId: string; goals: number; matches: Set<string> }>();

events.forEach(ev => {
  if (!scorersMap.has(ev.player)) {
    const playerInfo = playersMap.get(ev.player);
    scorersMap.set(ev.player, {
      playerId: playerInfo?.id || `p-x-${ev.player.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`,
      name: ev.player,
      teamId: ev.teamId,
      goals: 0,
      matches: new Set(),
    });
  }
  scorersMap.get(ev.player)!.goals++;
  scorersMap.get(ev.player)!.matches.add(ev.matchId);
});

const topScorers = Array.from(scorersMap.values())
  .map(s => ({
    player_id: s.playerId,
    team_id: s.teamId,
    goals: s.goals,
    assists: 0,
    penalties: 0,
    matches_played: s.matches.size,
  }))
  .sort((a, b) => b.goals - a.goals);

// ===== Generate Match Statistics (auto from scores) =====
function genStats(homeScore: number, awayScore: number) {
  // Auto-generate reasonable stats based on score
  const homeWin = homeScore > awayScore;
  return {
    possession: homeWin ? [54, 46] : [46, 54],
    shots: [10 + homeScore * 2, 8 + awayScore * 2],
    shots_on_target: [4 + homeScore, 3 + awayScore],
    corners: [5 + (homeScore > 0 ? 2 : 0), 4 + (awayScore > 0 ? 2 : 0)],
    fouls: [10 + Math.floor(Math.random() * 5), 12 + Math.floor(Math.random() * 5)],
    yellow_cards: [1 + Math.floor(Math.random() * 3), 1 + Math.floor(Math.random() * 3)],
    red_cards: [0, 0],
    passes: [400 + Math.floor(Math.random() * 200), 350 + Math.floor(Math.random() * 200)],
    pass_accuracy: [82 + Math.floor(Math.random() * 8), 78 + Math.floor(Math.random() * 8)],
  };
}

// Write output file (auxiliary data to be appended to data.ts)
const output = `// ============================================================
// World Cup 2026 — Auxiliary data (players, events, scorers)
// Auto-generated from worldcup26.ir match data
// Generated: ${new Date().toISOString()}
// ============================================================

import type { Player, MatchEvent, TopScorerRow, TopAssistRow, MatchStatistics } from './types';

// ===== Players extracted from scorers (${players.length} players) =====
export const PLAYERS: Player[] = ${JSON.stringify(players.map(p => ({
  id: p.id,
  name: p.name,
  name_ar: arabicPlayerNames[p.name] || p.name,
  team_id: p.teamId,
  position: 'FW' as const,
  nationality: p.teamName,
  nationality_ar: p.teamName,
  photo: '⚽',
  number: 9,
  age: undefined,
  club: undefined,
})), null, 2)};

// ===== Match events (${events.length} events) =====
export const MATCH_EVENTS: MatchEvent[] = ${JSON.stringify(events, null, 2)};

// ===== Top scorers (${topScorers.length} scorers) =====
export const TOP_SCORERS: TopScorerRow[] = ${JSON.stringify(topScorers, null, 2)};

// ===== Top assists (empty — source doesn't provide assist data) =====
export const TOP_ASSISTS: TopAssistRow[] = [];

// ===== Statistics generator for matches =====
export function generateMatchStats(homeScore: number, awayScore: number): MatchStatistics {
  const homeWin = homeScore > awayScore;
  return {
    possession: homeWin ? [54, 46] : [46, 54],
    shots: [10 + homeScore * 2, 8 + awayScore * 2],
    shots_on_target: [4 + homeScore, 3 + awayScore],
    corners: [5 + (homeScore > 0 ? 2 : 0), 4 + (awayScore > 0 ? 2 : 0)],
    fouls: [11, 13],
    yellow_cards: [2, 3],
    red_cards: [0, 0],
    passes: [487, 423],
    pass_accuracy: [86, 81],
  };
}
`;

writeFileSync(resolve(__dirname, '..', '..', 'src', 'lib', 'wc', 'data-aux.ts'), output);

console.log('✅ Generated data-aux.ts');
console.log('   Players:', players.length);
console.log('   Events:', events.length);
console.log('   Top scorers:', topScorers.length);
console.log('');
console.log('Top 5 scorers:');
topScorers.slice(0, 5).forEach((s, i) => {
  console.log('  ', i + 1, '.', s.player_id, '-', s.goals, 'goals');
});
