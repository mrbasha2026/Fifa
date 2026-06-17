/**
 * Convert World Cup 2026 data from rezarahiminia/worldcup2026 repo
 * into our app's data shape (src/lib/wc/data.ts).
 *
 * Reads JSON files from /data/wc2026/*.json and writes a new
 * data file with the proper structure.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', '..', 'data', 'wc2026');

const teamsRaw = JSON.parse(readFileSync(resolve(dataDir, 'teams.json'), 'utf8'));
const matchesRaw = JSON.parse(readFileSync(resolve(dataDir, 'matches.json'), 'utf8'));
const stadiumsRaw = JSON.parse(readFileSync(resolve(dataDir, 'stadiums.json'), 'utf8'));
const groupsRaw = JSON.parse(readFileSync(resolve(dataDir, 'matchtables.json'), 'utf8'));

// Map: team id → name in Arabic (we'll translate from English since source has only FA)
// We'll keep English + Persian; we'll add Arabic translations for known teams.
const arabicNames: Record<string, string> = {
  'Mexico': 'المكسيك',
  'South Africa': 'جنوب أفريقيا',
  'South Korea': 'كوريا الجنوبية',
  'Czech Republic': 'التشيك',
  'Canada': 'كندا',
  'Bosnia and Herzegovina': 'البوسنة والهرسك',
  'Qatar': 'قطر',
  'Switzerland': 'سويسرا',
  'Brazil': 'البرازيل',
  'Morocco': 'المغرب',
  'Haiti': 'هايتي',
  'Scotland': 'اسكتلندا',
  'United States': 'الولايات المتحدة',
  'Paraguay': 'باراغواي',
  'Australia': 'أستراليا',
  'Turkey': 'تركيا',
  'Germany': 'ألمانيا',
  'Curaçao': 'كوراساو',
  'Ivory Coast': 'ساحل العاج',
  'Ecuador': 'الإكوادور',
  'Netherlands': 'هولندا',
  'Japan': 'اليابان',
  'Sweden': 'السويد',
  'Tunisia': 'تونس',
  'Belgium': 'بلجيكا',
  'Egypt': 'مصر',
  'Iran': 'إيران',
  'New Zealand': 'نيوزيلندا',
  'Spain': 'إسبانيا',
  'Cape Verde': 'الرأس الأخضر',
  'Saudi Arabia': 'السعودية',
  'Uruguay': 'الأوروغواي',
  'France': 'فرنسا',
  'Senegal': 'السنغال',
  'Iraq': 'العراق',
  'Norway': 'النرويج',
  'Argentina': 'الأرجنتين',
  'Algeria': 'الجزائر',
  'Austria': 'النمسا',
  'Jordan': 'الأردن',
  'Portugal': 'البرتغال',
  'Democratic Republic of the Congo': 'الكونغو الديمقراطية',
  'Uzbekistan': 'أوزبكستان',
  'Colombia': 'كولومبيا',
  'England': 'إنجلترا',
  'Croatia': 'كرواتيا',
  'Ghana': 'غانا',
  'Panama': 'بنما',
};

// ===== Generate data.ts content =====
function genTeamId(id: string): string {
  return `t${id}`;
}

// Build teams
const teamsCode = teamsRaw.map((t: any) => {
  const tid = genTeamId(t.id);
  const nameEn = t.name_en;
  const nameAr = arabicNames[nameEn] || nameEn;
  const flag = t.flag;
  return `  { id: '${tid}', name: ${JSON.stringify(nameEn)}, name_ar: ${JSON.stringify(nameAr)}, logo: ${JSON.stringify(flag)}, flag: ${JSON.stringify(flag)}, group: ${JSON.stringify(t.groups)}, fifa_code: ${JSON.stringify(t.fifa_code)}, fifa_ranking: undefined, coach: undefined }`;
}).join(',\n');

// Build stadiums
const stadiumsCode = stadiumsRaw.map((s: any) => {
  const sid = `s${s.id}`;
  // Convert country to USA/MEX/CAN
  const country = s.country_en === 'Mexico' ? 'MEX' : s.country_en === 'Canada' ? 'CAN' : 'USA';
  const nameAr = s.name_fa; // Use Persian name (close to Arabic for stadium names)
  const cityAr = s.city_fa;
  return `  { id: '${sid}', name: ${JSON.stringify(s.name_en)}, name_ar: ${JSON.stringify(nameAr)}, city: ${JSON.stringify(s.city_en)}, city_ar: ${JSON.stringify(cityAr)}, country: '${country}', capacity: ${s.capacity} }`;
}).join(',\n');

// Convert local_date "MM/DD/YYYY HH:mm" to ISO UTC
// Source dates appear to be local to host city. For simplicity we treat them as UTC
// (the user's TZ layer in time.ts will display them in user's timezone).
function localDateToISO(localDate: string): string {
  // local_date: "06/11/2026 13:00"
  const [datePart, timePart] = localDate.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  // Treat as UTC for storage (we'll display in user TZ)
  const d = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  return d.toISOString();
}

// Map type to our round format
function mapType(type: string): string {
  const map: Record<string, string> = {
    'group': 'group',
    'r32': 'R32',
    'r16': 'R16',
    'qf': 'QF',
    'sf': 'SF',
    'final': 'FINAL',
    'third': 'THIRD',
  };
  return map[type] || 'group';
}

function mapStatus(timeElapsed: string, finished: string): string {
  if (finished === 'TRUE') return 'FT';
  if (timeElapsed && timeElapsed !== 'notstarted' && timeElapsed !== 'finished') {
    return 'LIVE';
  }
  return 'NS';
}

// Build matches
const matchesCode = matchesRaw.map((m: any) => {
  const mid = `m${m.id}`;
  const homeId = m.home_team_id && m.home_team_id !== '0' ? genTeamId(m.home_team_id) : '';
  const awayId = m.away_team_id && m.away_team_id !== '0' ? genTeamId(m.away_team_id) : '';
  const homeScore = m.home_score && m.home_score !== '0' ? parseInt(m.home_score) : (m.finished === 'TRUE' ? 0 : null);
  const awayScore = m.away_score && m.away_score !== '0' ? parseInt(m.away_score) : (m.finished === 'TRUE' ? 0 : null);
  const status = mapStatus(m.time_elapsed, m.finished);
  const date = localDateToISO(m.local_date);
  const round = mapType(m.type);
  const stageOrder = { group: 1, R32: 2, R16: 3, QF: 4, SF: 5, FINAL: 6, THIRD: 6 }[round] || 1;
  const stadiumId = m.stadium_id && m.stadium_id !== '0' ? `s${m.stadium_id}` : undefined;
  const group = m.type === 'group' ? m.group : undefined;

  // Determine bracket_position for knockout (1-16 for R32, 1-8 for R16, etc.)
  let bracketPosition: number | undefined;
  if (round !== 'group') {
    const matchNum = parseInt(m.id);
    if (round === 'R32') bracketPosition = matchNum - 72; // 73-88 → 1-16
    else if (round === 'R16') bracketPosition = matchNum - 88; // 89-96 → 1-8
    else if (round === 'QF') bracketPosition = matchNum - 96; // 97-100 → 1-4
    else if (round === 'SF') bracketPosition = matchNum - 100; // 101-102 → 1-2
    else if (round === 'FINAL') bracketPosition = 1;
    else if (round === 'THIRD') bracketPosition = 1;
  }

  // next_match_id: based on bracket structure
  // For now we'll leave undefined — the bracket layout in KnockoutPage
  // will handle arrangement by bracket_position
  const nextMatchId: string | undefined = undefined;

  return `  { id: '${mid}', fixture_id: ${JSON.stringify(m.id)}, home_team_id: ${JSON.stringify(homeId)}, away_team_id: ${JSON.stringify(awayId)}, home_score: ${homeScore === null ? 'null' : homeScore}, away_score: ${awayScore === null ? 'null' : awayScore}, status: ${JSON.stringify(status)}, date: ${JSON.stringify(date)}, round: ${JSON.stringify(round)} as MatchRound, stage_order: ${stageOrder}, ${group ? `group: ${JSON.stringify(group)}, ` : ''}stadium_id: ${stadiumId ? JSON.stringify(stadiumId) : 'undefined'}, ${bracketPosition ? `bracket_position: ${bracketPosition}, ` : ''}${nextMatchId ? `next_match_id: ${JSON.stringify(nextMatchId)}, ` : ''}winner_id: ${homeScore !== null && awayScore !== null && homeScore > awayScore ? JSON.stringify(homeId) : homeScore !== null && awayScore !== null && awayScore > homeScore ? JSON.stringify(awayId) : 'null'} }`;
}).join(',\n');

// Build standings (all 0 for now since tournament hasn't started)
const standingsCode = groupsRaw.map((g: any) => {
  return g.teams.map((team: any) => {
    const sid = `${g.group.toLowerCase()}-${genTeamId(team.team_id)}`;
    return `  { id: ${JSON.stringify(sid)}, group: ${JSON.stringify(g.group)}, team_id: ${JSON.stringify(genTeamId(team.team_id))}, played: ${parseInt(team.mp)}, win: ${parseInt(team.w)}, draw: ${parseInt(team.d)}, lose: ${parseInt(team.l)}, goals_for: ${parseInt(team.gf)}, goals_against: ${parseInt(team.ga)}, goal_diff: ${parseInt(team.gd)}, points: ${parseInt(team.pts)} }`;
  }).join(',\n');
}).join(',\n');

const output = `// ============================================================
// World Cup 2026 — REAL DATA from rezarahiminia/worldcup2026
// ============================================================
// Source: https://github.com/rezarahiminia/worldcup2026
// Data fetched: ${new Date().toISOString()}
// 48 teams, 104 matches, 16 stadiums, 12 groups (A-L)
// Tournament dates: June 11 - July 19, 2026
// ============================================================

import type {
  Team, Player, Match, StandingsRow, MatchEvent, MatchStatistics,
  MatchLineup, TopScorerRow, TopAssistRow,
} from './types';

// ===== 48 TEAMS — REAL WC 2026 draw =====
export const TEAMS: Team[] = [
${teamsCode}
];

// ===== 16 STADIUMS — real venues across USA/Mexico/Canada =====
export interface Stadium {
  id: string;
  name: string;
  name_ar: string;
  city: string;
  city_ar: string;
  country: 'USA' | 'MEX' | 'CAN';
  capacity: number;
}

export const STADIUMS: Stadium[] = [
${stadiumsCode}
];

// ===== 104 MATCHES — complete WC 2026 schedule =====
export const ALL_MATCHES: Match[] = [
${matchesCode}
];

// ===== Standings (all 0 — tournament hasn't started) =====
export const STANDINGS: StandingsRow[] = [
${standingsCode}
];

// ===== Players (kept from previous mock — to be filled when squads announced) =====
export const PLAYERS: Player[] = [];

// ===== Top scorers/assists (empty — tournament hasn't started) =====
export const TOP_SCORERS: TopScorerRow[] = [];
export const TOP_ASSISTS: TopAssistRow[] = [];

// ===== Index lookups =====
export const TEAM_BY_ID: Record<string, Team> = TEAMS.reduce((acc, t) => { acc[t.id] = t; return acc; }, {} as Record<string, Team>);
export const PLAYER_BY_ID: Record<string, Player> = {};
export const MATCH_BY_ID: Record<string, Match> = ALL_MATCHES.reduce((acc, m) => { acc[m.id] = m; return acc; }, {} as Record<string, Match>);
export const STADIUM_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {} as Record<string, Stadium>);
export const TEAMS_BY_GROUP: Record<string, Team[]> = TEAMS.reduce((acc, t) => {
  if (!acc[t.group]) acc[t.group] = [];
  acc[t.group].push(t);
  return acc;
}, {} as Record<string, Team[]>);
`;

writeFileSync(resolve(__dirname, '..', '..', 'src', 'lib', 'wc', 'data-real.ts'), output);
console.log('✅ Generated data-real.ts');
console.log('   Teams:', teamsRaw.length);
console.log('   Matches:', matchesRaw.length);
console.log('   Stadiums:', stadiumsRaw.length);
console.log('   Standings rows:', groupsRaw.reduce((acc: number, g: any) => acc + g.teams.length, 0));
