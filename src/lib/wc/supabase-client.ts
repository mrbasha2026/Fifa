// ============================================================
// Supabase-shaped data layer (REAL with mock fallback)
// ============================================================
// When NEXT_PUBLIC_SUPABASE_URL is set, this layer reads from
// the real Supabase database. Otherwise it falls back to the
// local mock data so the app still works for development.
//
// All functions return the SAME shape as before, so existing
// pages do not need to change.
// ============================================================

import {
  TEAMS,
  PLAYERS,
  ALL_MATCHES,
  STANDINGS,
  TOP_SCORERS,
  TOP_ASSISTS,
  TEAM_BY_ID,
  PLAYER_BY_ID,
  MATCH_BY_ID,
  TEAMS_BY_GROUP,
  STADIUMS,
  STADIUM_BY_ID,
} from './data';
import { getSupabase, isSupabaseConfigured } from './supabase-real';
import type {
  Team, Player, Match, StandingsRow, MatchEvent, MatchLineup,
  TopScorerRow, TopAssistRow, MatchStatistics,
} from './types';

const LATENCY = 200;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// ===== Mappers (Supabase schema → frontend types) =====
// The DB uses `group_id` (because `group` is reserved in SQL).
// Frontend types use `group`. Same for `stadium_id` (already aligned).
function mapTeam(t: any): Team {
  if (!t) return t;
  return {
    ...t,
    group: t.group_id ?? t.group,
  };
}
function mapMatch(m: any): Match {
  if (!m) return m;
  return {
    ...m,
    group: m.group_id ?? m.group,
  };
}
function mapStandings(s: any): StandingsRow {
  if (!s) return s;
  return {
    ...s,
    group: s.group_id ?? s.group,
    goal_diff: s.goal_diff ?? ((s.goals_for ?? 0) - (s.goals_against ?? 0)),
  };
}

// Helper: read rows from Supabase, fall back to mock
async function fetchTable<T>(
  table: string,
  mockSource: T[],
  orderBy?: string,
  ascending = true
): Promise<T[]> {
  const sb = getSupabase();
  if (!sb) return delay(mockSource);
  try {
    let query = sb.from(table).select('*');
    if (orderBy) query = query.order(orderBy, { ascending });
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fall back to mock if Supabase empty or errored
      return delay(mockSource);
    }
    return data as T[];
  } catch {
    return delay(mockSource);
  }
}

// ===== Convenience helpers (analogous to RPC functions) =====

export async function getStadiumById(id: string) {
  return delay(STADIUM_BY_ID[id] ?? null, 100);
}

export async function getLiveMatches(): Promise<Match[]> {
  const sb = getSupabase();
  if (!sb) return delay(ALL_MATCHES.filter(m => m.status === 'LIVE'));
  try {
    const { data, error } = await sb.from('matches').select('*').in('status', ['LIVE', 'HT']);
    if (error || !data) return delay(ALL_MATCHES.filter(m => m.status === 'LIVE'));
    return (data as any[]).length > 0 ? (data as any[]).map(mapMatch) : delay(ALL_MATCHES.filter(m => m.status === 'LIVE'));
  } catch {
    return delay(ALL_MATCHES.filter(m => m.status === 'LIVE'));
  }
}

export async function getUpcomingMatches(limit = 10): Promise<Match[]> {
  const sb = getSupabase();
  if (!sb) {
    return delay(
      ALL_MATCHES
        .filter(m => m.status === 'NS')
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
        .slice(0, limit)
    );
  }
  try {
    const { data, error } = await sb
      .from('matches')
      .select('*')
      .eq('status', 'NS')
      .order('date', { ascending: true })
      .limit(limit);
    if (error || !data || data.length === 0) {
      return delay(
        ALL_MATCHES
          .filter(m => m.status === 'NS')
          .sort((a, b) => +new Date(a.date) - +new Date(b.date))
          .slice(0, limit)
      );
    }
    return data as Match[];
  } catch {
    return delay(
      ALL_MATCHES
        .filter(m => m.status === 'NS')
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
        .slice(0, limit)
    );
  }
}

export async function getRecentResults(limit = 10): Promise<Match[]> {
  const sb = getSupabase();
  const mockFallback = () =>
    delay(
      ALL_MATCHES
        .filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN')
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .slice(0, limit)
    );
  if (!sb) return mockFallback();
  try {
    const { data, error } = await sb
      .from('matches')
      .select('*')
      .in('status', ['FT', 'AET', 'PEN'])
      .order('date', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) return mockFallback();
    return (data as any[]).map(mapMatch);
  } catch {
    return mockFallback();
  }
}

export async function getMatchById(id: string): Promise<Match | null> {
  const sb = getSupabase();
  if (!sb) return delay(MATCH_BY_ID[id] ?? null, 150);
  try {
    const { data, error } = await sb.from('matches').select('*').eq('id', id).single();
    if (error || !data) return delay(MATCH_BY_ID[id] ?? null, 150);
    return mapMatch(data);
  } catch {
    return delay(MATCH_BY_ID[id] ?? null, 150);
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  const sb = getSupabase();
  if (!sb) return delay(TEAM_BY_ID[id] ?? null, 150);
  try {
    const { data, error } = await sb.from('teams').select('*').eq('id', id).single();
    if (error || !data) return delay(TEAM_BY_ID[id] ?? null, 150);
    return mapTeam(data);
  } catch {
    return delay(TEAM_BY_ID[id] ?? null, 150);
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const sb = getSupabase();
  if (!sb) return delay(PLAYER_BY_ID[id] ?? null, 150);
  try {
    const { data, error } = await sb.from('players').select('*').eq('id', id).single();
    if (error || !data) return delay(PLAYER_BY_ID[id] ?? null, 150);
    return data as Player;
  } catch {
    return delay(PLAYER_BY_ID[id] ?? null, 150);
  }
}

export async function getTeamsByGroup(group: string): Promise<Team[]> {
  const sb = getSupabase();
  if (!sb) return delay(TEAMS_BY_GROUP[group] ?? [], 150);
  try {
    const { data, error } = await sb.from('teams').select('*').eq('group_id', group);
    if (error || !data || data.length === 0) return delay(TEAMS_BY_GROUP[group] ?? [], 150);
    return (data as any[]).map(mapTeam);
  } catch {
    return delay(TEAMS_BY_GROUP[group] ?? [], 150);
  }
}

export async function getStandingsByGroup(group: string): Promise<StandingsRow[]> {
  const sb = getSupabase();
  const mockFallback = () =>
    delay(
      STANDINGS
        .filter(s => s.group === group)
        .sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for),
      150
    );
  if (!sb) return mockFallback();
  try {
    const { data, error } = await sb
      .from('standings')
      .select('*')
      .eq('group_id', group)
      .order('points', { ascending: false });
    if (error || !data || data.length === 0) return mockFallback();
    return (data as any[]).map(mapStandings);
  } catch {
    return mockFallback();
  }
}

export async function getAllStandings(): Promise<Record<string, StandingsRow[]>> {
  const sb = getSupabase();
  // Build mock fallback
  const mockResult: Record<string, StandingsRow[]> = {};
  const groups = Array.from(new Set(STANDINGS.map(s => s.group))).sort();
  for (const g of groups) {
    mockResult[g] = STANDINGS
      .filter(s => s.group === g)
      .sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for);
  }

  if (!sb) return delay(mockResult, 200);

  try {
    const { data, error } = await sb.from('standings').select('*');
    if (error || !data || data.length === 0) return delay(mockResult, 200);

    // Group by group_id
    const result: Record<string, StandingsRow[]> = {};
    (data as any[]).forEach(row => {
      const mapped = mapStandings(row);
      const g = mapped.group;
      if (!result[g]) result[g] = [];
      result[g].push(mapped);
    });
    // Sort each group
    Object.keys(result).forEach(g => {
      result[g].sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for);
    });
    return delay(result, 200);
  } catch {
    return delay(mockResult, 200);
  }
}

export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  const sb = getSupabase();
  const mockFallback = () =>
    delay(
      ALL_MATCHES
        .filter(m => m.home_team_id === teamId || m.away_team_id === teamId)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
      200
    );
  if (!sb) return mockFallback();
  try {
    const { data, error } = await sb
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order('date', { ascending: true });
    if (error || !data || data.length === 0) return mockFallback();
    return (data as any[]).map(mapMatch);
  } catch {
    return mockFallback();
  }
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const sb = getSupabase();
  if (!sb) return delay(PLAYERS.filter(p => p.team_id === teamId), 200);
  try {
    const { data, error } = await sb.from('players').select('*').eq('team_id', teamId);
    if (error || !data || data.length === 0) return delay(PLAYERS.filter(p => p.team_id === teamId), 200);
    return data as Player[];
  } catch {
    return delay(PLAYERS.filter(p => p.team_id === teamId), 200);
  }
}

export async function getEventsByMatch(matchId: string): Promise<MatchEvent[]> {
  const sb = getSupabase();
  const m = MATCH_BY_ID[matchId];
  const fallback = () => delay(m?.events ?? [], 200);
  if (!sb) return fallback();
  try {
    const { data, error } = await sb.from('match_events').select('*').eq('match_id', matchId).order('minute', { ascending: true });
    if (error || !data || data.length === 0) return fallback();
    return data as MatchEvent[];
  } catch {
    return fallback();
  }
}

export async function getKnockoutMatches(): Promise<Match[]> {
  const sb = getSupabase();
  const mockFallback = () =>
    delay(
      ALL_MATCHES
        .filter(m => m.round !== 'group')
        .sort((a, b) => a.stage_order - b.stage_order || (a.bracket_position ?? 0) - (b.bracket_position ?? 0)),
      200
    );
  if (!sb) return mockFallback();
  try {
    const { data, error } = await sb
      .from('matches')
      .select('*')
      .neq('round', 'group')
      .order('stage_order', { ascending: true });
    if (error || !data || data.length === 0) return mockFallback();
    return (data as any[]).map(mapMatch);
  } catch {
    return mockFallback();
  }
}

export async function getTopScorers(limit = 15): Promise<Array<TopScorerRow & { player?: Player; team?: Team }>> {
  const sb = getSupabase();
  const buildResult = (rows: TopScorerRow[]) =>
    rows
      .slice()
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .slice(0, limit)
      .map(row => ({
        ...row,
        player: PLAYER_BY_ID[row.player_id],
        team: TEAM_BY_ID[row.team_id],
      }));

  if (!sb) return delay(buildResult(TOP_SCORERS), 200);
  try {
    const { data, error } = await sb.from('top_scorers').select('*').order('goals', { ascending: false }).limit(limit);
    if (error || !data || data.length === 0) return delay(buildResult(TOP_SCORERS), 200);

    // Fetch player info from Supabase for each scorer
    const playerIds = (data as TopScorerRow[]).map(r => r.player_id).filter(Boolean);
    const teamIds = Array.from(new Set((data as TopScorerRow[]).map(r => r.team_id).filter(Boolean)));

    let playersMap: Record<string, Player> = {};
    let teamsMap: Record<string, Team> = {};

    if (playerIds.length > 0) {
      const { data: playersData } = await sb.from('players').select('*').in('id', playerIds);
      if (playersData) {
        (playersData as Player[]).forEach(p => { playersMap[p.id] = p; });
      }
    }
    if (teamIds.length > 0) {
      const { data: teamsData } = await sb.from('teams').select('*').in('id', teamIds);
      if (teamsData) {
        (teamsData as any[]).forEach(t => { teamsMap[t.id] = mapTeam(t); });
      }
    }

    const enriched = (data as TopScorerRow[]).map(row => ({
      ...row,
      player: playersMap[row.player_id] || PLAYER_BY_ID[row.player_id],
      team: teamsMap[row.team_id] || TEAM_BY_ID[row.team_id],
    }));
    return delay(enriched, 200);
  } catch {
    return delay(buildResult(TOP_SCORERS), 200);
  }
}

export async function getTopAssists(limit = 15): Promise<Array<TopAssistRow & { player?: Player; team?: Team; player_name?: string; player_name_ar?: string }>> {
  const sb = getSupabase();
  const buildResult = (rows: TopAssistRow[]) =>
    rows
      .slice()
      .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
      .slice(0, limit)
      .map(row => ({
        ...row,
        player: PLAYER_BY_ID[row.player_id],
        team: TEAM_BY_ID[row.team_id],
      }));

  if (!sb) return delay(buildResult(TOP_ASSISTS), 200);
  try {
    const { data, error } = await sb.from('top_assists').select('*').order('assists', { ascending: false }).limit(limit);
    if (error || !data || data.length === 0) return delay(buildResult(TOP_ASSISTS), 200);

    // Fetch player + team info from Supabase
    const playerIds = (data as TopAssistRow[]).map(r => r.player_id).filter(Boolean);
    const teamIds = Array.from(new Set((data as TopAssistRow[]).map(r => r.team_id).filter(Boolean)));

    let playersMap: Record<string, any> = {};
    let teamsMap: Record<string, Team> = {};

    if (playerIds.length > 0) {
      const { data: playersData } = await sb.from('players').select('*').in('id', playerIds);
      if (playersData) {
        (playersData as any[]).forEach(p => { playersMap[p.id] = p; });
      }
    }
    if (teamIds.length > 0) {
      const { data: teamsData } = await sb.from('teams').select('*').in('id', teamIds);
      if (teamsData) {
        (teamsData as any[]).forEach(t => { teamsMap[t.id] = mapTeam(t); });
      }
    }

    const enriched = (data as TopAssistRow[]).map(row => {
      const player = playersMap[row.player_id] || PLAYER_BY_ID[row.player_id];
      const team = teamsMap[row.team_id] || TEAM_BY_ID[row.team_id];
      return {
        ...row,
        player,
        team,
        player_name: player?.name || '—',
        player_name_ar: player?.name_ar || player?.name || '—',
      };
    });
    return delay(enriched, 200);
  } catch {
    return delay(buildResult(TOP_ASSISTS), 200);
  }
}

export async function getMatchStatistics(matchId: string): Promise<MatchStatistics | null> {
  // Try local cache first
  const m = MATCH_BY_ID[matchId];
  if (m?.statistics) return delay(m.statistics, 200);

  // Try fetching match from Supabase to get scores
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('matches').select('home_score, away_score, status').eq('id', matchId).single();
      if (data && (data as any).home_score !== null && (data as any).away_score !== null) {
        const hs = (data as any).home_score, as = (data as any).away_score;
        const homeWin = hs > as;
        return {
          possession: homeWin ? [54, 46] : [46, 54],
          shots: [10 + hs * 2, 8 + as * 2],
          shots_on_target: [4 + hs, 3 + as],
          corners: [5 + (hs > 0 ? 2 : 0), 4 + (as > 0 ? 2 : 0)],
          fouls: [11, 13],
          yellow_cards: [2, 3],
          red_cards: [0, 0],
          passes: [487, 423],
          pass_accuracy: [86, 81],
        } as MatchStatistics;
      }
    } catch {}
  }

  // Fallback to local data
  if (m && m.home_score !== null && m.away_score !== null) {
    const hs = m.home_score, as = m.away_score;
    const homeWin = hs > as;
    return delay({
      possession: homeWin ? [54, 46] : [46, 54],
      shots: [10 + hs * 2, 8 + as * 2],
      shots_on_target: [4 + hs, 3 + as],
      corners: [5 + (hs > 0 ? 2 : 0), 4 + (as > 0 ? 2 : 0)],
      fouls: [11, 13],
      yellow_cards: [2, 3],
      red_cards: [0, 0],
      passes: [487, 423],
      pass_accuracy: [86, 81],
    } as MatchStatistics, 200);
  }

  return delay(null, 200);
}

export async function getMatchLineups(matchId: string): Promise<MatchLineup[]> {
  // Try fetching from Supabase first
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('match_lineups').select('*').eq('match_id', matchId);
      if (!error && data && data.length > 0) {
        return data as MatchLineup[];
      }
    } catch {}
  }

  // Fallback: generate locally from players data
  const m = MATCH_BY_ID[matchId];
  if (!m) return delay([], 200);

  // Fetch match from Supabase if not in local cache
  let match = m;
  if (!match.home_team_id && sb) {
    try {
      const { data } = await sb.from('matches').select('*').eq('id', matchId).single();
      if (data) match = mapMatch(data);
    } catch {}
  }

  const lineups: MatchLineup[] = [];
  if (match.home_team_id) {
    lineups.push(await buildLineupFromDB(matchId, match.home_team_id, '4-3-3'));
  }
  if (match.away_team_id) {
    lineups.push(await buildLineupFromDB(matchId, match.away_team_id, '4-2-3-1'));
  }
  return delay(lineups, 200);
}

async function buildLineupFromDB(matchId: string, teamId: string, formation: string): Promise<MatchLineup> {
  // Fetch players for this team from Supabase
  const sb = getSupabase();
  let players: Player[] = PLAYERS.filter(p => p.team_id === teamId);
  let team = TEAM_BY_ID[teamId];

  if (sb) {
    try {
      const { data: playersData } = await sb.from('players').select('*').eq('team_id', teamId);
      if (playersData && playersData.length > 0) {
        players = playersData as Player[];
      }
      const { data: teamData } = await sb.from('teams').select('*').eq('id', teamId).single();
      if (teamData) team = mapTeam(teamData);
    } catch {}
  }

  const starters = players.slice(0, Math.min(11, players.length)).map(p => ({
    player_id: p.id, name: p.name, name_ar: p.name_ar, number: p.number, position: p.position,
  }));
  const substitutes = players.slice(11, 11 + 7).map(p => ({
    player_id: p.id, name: p.name, name_ar: p.name_ar, number: p.number, position: p.position,
  }));
  return {
    id: `${matchId}-lineup-${teamId}`,
    match_id: matchId,
    team_id: teamId,
    formation,
    starters,
    substitutes,
    coach: team?.coach,
  };
}

// ===== DB-shaped chainable query builder (kept for backwards compat) =====
class QueryBuilder<T extends { id: string }> {
  private rows: T[];
  constructor(private source: T[]) { this.rows = [...source]; }
  private clone(): QueryBuilder<T> {
    const qb = new QueryBuilder(this.source);
    qb.rows = [...this.rows];
    return qb;
  }
  select(_columns?: string) { return this.clone(); }
  eq(column: keyof T, value: any) {
    const qb = this.clone();
    qb.rows = qb.rows.filter(r => (r as any)[column] === value);
    return qb;
  }
  neq(column: keyof T, value: any) {
    const qb = this.clone();
    qb.rows = qb.rows.filter(r => (r as any)[column] !== value);
    return qb;
  }
  in(column: keyof T, values: any[]) {
    const qb = this.clone();
    qb.rows = qb.rows.filter(r => values.includes((r as any)[column]));
    return qb;
  }
  order(column: keyof T, opts: { ascending?: boolean } = {}) {
    const qb = this.clone();
    const asc = opts.ascending ?? true;
    qb.rows.sort((a, b) => {
      const av = (a as any)[column]; const bv = (b as any)[column];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (asc ? 1 : -1);
    });
    return qb;
  }
  limit(n: number) {
    const qb = this.clone();
    qb.rows = qb.rows.slice(0, n);
    return qb;
  }
  single() {
    return delay({ data: this.rows[0] ?? null, error: null as Error | null });
  }
  then<TResult>(onFulfilled: (value: { data: T[] | null; error: Error | null }) => TResult) {
    return delay({ data: this.rows, error: null as Error | null }).then(onFulfilled);
  }
}

export const db = {
  from(table: string): QueryBuilder<any> {
    switch (table) {
      case 'teams':       return new QueryBuilder<Team>(TEAMS);
      case 'players':     return new QueryBuilder<Player>(PLAYERS);
      case 'matches':     return new QueryBuilder<Match>(ALL_MATCHES);
      case 'standings':   return new QueryBuilder<StandingsRow>(STANDINGS);
      case 'top_scorers': return new QueryBuilder<TopScorerRow>(TOP_SCORERS);
      case 'top_assists': return new QueryBuilder<TopAssistRow>(TOP_ASSISTS);
      case 'stadiums':    return new QueryBuilder<any>(STADIUMS);
      case 'match_events': return new QueryBuilder<MatchEvent>(
        ALL_MATCHES.flatMap(m => m.events ?? [])
      );
      case 'match_lineups': return new QueryBuilder<MatchLineup>([]);
      default:
        return new QueryBuilder<any>([]);
    }
  },
};

export { isSupabaseConfigured };
