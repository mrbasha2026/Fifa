// ============================================================
// Supabase-like client (Mock)
// ============================================================
// This module provides a Supabase-shaped interface for the
// React frontend. The frontend ONLY reads from this layer.
//
// In production you would replace the mock data fetching with
// a real `@supabase/supabase-js` client — the function
// signatures match the queries you'd run against Supabase.
//
// Example migration:
//   const { data } = await supabase.from('matches').select('*').eq('status','LIVE')
//   becomes:
//   const { data } = await db.from('matches').select().eq('status','LIVE')
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
} from './data';
import type {
  Team, Player, Match, StandingsRow, MatchEvent, MatchLineup,
  TopScorerRow, TopAssistRow, MatchStatistics,
} from './types';

// Simulate network latency for realistic skeleton loaders
const LATENCY = 250;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Build a Supabase-shaped chainable query builder
class QueryBuilder<T extends { id: string }> {
  private rows: T[] = [];
  private filters: Array<(row: T) => boolean> = [];

  constructor(private source: T[]) {
    this.rows = [...source];
  }

  private clone(): QueryBuilder<T> {
    const qb = new QueryBuilder(this.source);
    qb.rows = [...this.rows];
    qb.filters = [...this.filters];
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

  gt(column: keyof T, value: any) {
    const qb = this.clone();
    qb.rows = qb.rows.filter(r => (r as any)[column] > value);
    return qb;
  }

  lt(column: keyof T, value: any) {
    const qb = this.clone();
    qb.rows = qb.rows.filter(r => (r as any)[column] < value);
    return qb;
  }

  order(column: keyof T, opts: { ascending?: boolean } = {}) {
    const qb = this.clone();
    const asc = opts.ascending ?? true;
    qb.rows.sort((a, b) => {
      const av = (a as any)[column];
      const bv = (b as any)[column];
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
      case 'match_events': return new QueryBuilder<MatchEvent>(
        ALL_MATCHES.flatMap(m => m.events ?? [])
      );
      case 'match_lineups': return new QueryBuilder<MatchLineup>([]);
      default:
        return new QueryBuilder<any>([]);
    }
  },
};

// ===== Convenience helpers (analogous to RPC functions) =====

export async function getLiveMatches(): Promise<Match[]> {
  return delay(ALL_MATCHES.filter(m => m.status === 'LIVE'));
}

export async function getUpcomingMatches(limit = 10): Promise<Match[]> {
  return delay(
    ALL_MATCHES
      .filter(m => m.status === 'NS')
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .slice(0, limit)
  );
}

export async function getRecentResults(limit = 10): Promise<Match[]> {
  return delay(
    ALL_MATCHES
      .filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN')
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, limit)
  );
}

export async function getMatchById(id: string): Promise<Match | null> {
  return delay(MATCH_BY_ID[id] ?? null, 150);
}

export async function getTeamById(id: string): Promise<Team | null> {
  return delay(TEAM_BY_ID[id] ?? null, 150);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return delay(PLAYER_BY_ID[id] ?? null, 150);
}

export async function getTeamsByGroup(group: string): Promise<Team[]> {
  return delay(TEAMS_BY_GROUP[group] ?? [], 150);
}

export async function getStandingsByGroup(group: string): Promise<StandingsRow[]> {
  return delay(
    STANDINGS
      .filter(s => s.group === group)
      .sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for),
    150
  );
}

export async function getAllStandings(): Promise<Record<string, StandingsRow[]>> {
  const groups = Array.from(new Set(STANDINGS.map(s => s.group))).sort();
  const result: Record<string, StandingsRow[]> = {};
  for (const g of groups) {
    result[g] = STANDINGS
      .filter(s => s.group === g)
      .sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for);
  }
  return delay(result, 200);
}

export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  return delay(
    ALL_MATCHES
      .filter(m => m.home_team_id === teamId || m.away_team_id === teamId)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    200
  );
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  return delay(PLAYERS.filter(p => p.team_id === teamId), 200);
}

export async function getEventsByMatch(matchId: string): Promise<MatchEvent[]> {
  const m = MATCH_BY_ID[matchId];
  return delay(m?.events ?? [], 200);
}

export async function getKnockoutMatches(): Promise<Match[]> {
  return delay(
    ALL_MATCHES
      .filter(m => m.round !== 'group')
      .sort((a, b) => a.stage_order - b.stage_order || (a.bracket_position ?? 0) - (b.bracket_position ?? 0)),
    200
  );
}

export async function getTopScorers(limit = 15): Promise<Array<TopScorerRow & { player?: Player; team?: Team }>> {
  const rows = TOP_SCORERS
    .slice()
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, limit)
    .map(row => ({
      ...row,
      player: PLAYER_BY_ID[row.player_id],
      team: TEAM_BY_ID[row.team_id],
    }));
  return delay(rows, 200);
}

export async function getTopAssists(limit = 15): Promise<Array<TopAssistRow & { player?: Player; team?: Team }>> {
  const rows = TOP_ASSISTS
    .slice()
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
    .slice(0, limit)
    .map(row => ({
      ...row,
      player: PLAYER_BY_ID[row.player_id],
      team: TEAM_BY_ID[row.team_id],
    }));
  return delay(rows, 200);
}

export async function getMatchStatistics(matchId: string): Promise<MatchStatistics | null> {
  const m = MATCH_BY_ID[matchId];
  return delay(m?.statistics ?? null, 200);
}

export async function getMatchLineups(matchId: string): Promise<MatchLineup[]> {
  const m = MATCH_BY_ID[matchId];
  if (!m) return delay([], 200);
  // Dynamically build lineups if home/away are real teams
  const lineups: MatchLineup[] = [];
  if (m.home_team_id && TEAM_BY_ID[m.home_team_id]) {
    lineups.push(buildLineupLocal(matchId, m.home_team_id, '4-3-3'));
  }
  if (m.away_team_id && TEAM_BY_ID[m.away_team_id]) {
    lineups.push(buildLineupLocal(matchId, m.away_team_id, '4-2-3-1'));
  }
  return delay(lineups, 200);
}

function buildLineupLocal(matchId: string, teamId: string, formation: string): MatchLineup {
  const players = PLAYERS.filter(p => p.team_id === teamId);
  const team = TEAM_BY_ID[teamId];
  const starters = players.slice(0, 11).map(p => ({
    player_id: p.id, name: p.name, name_ar: p.name_ar, number: p.number, position: p.position,
  }));
  const substitutes = players.slice(11).map(p => ({
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
