// ============================================================
// World Cup 2026 - TypeScript Types
// These types mirror the Supabase schema described in the spec
// ============================================================

export type MatchStatus = 'NS' | 'LIVE' | 'HT' | 'FT' | 'AET' | 'PEN';
export type MatchRound =
  | 'group'
  | 'R16'
  | 'QF'
  | 'SF'
  | 'FINAL'
  | 'THIRD';

export type EventType = 'goal' | 'card' | 'substitution';
export type Position = 'GK' | 'DF' | 'MF' | 'FW';

export interface Team {
  id: string;
  name: string;
  name_ar: string;
  logo: string; // emoji or url
  flag: string; // emoji
  group: string; // A..L
  fifa_code: string; // KSA, BRA, etc.
  fifa_ranking?: number;
  coach?: string;
}

export interface Player {
  id: string;
  name: string;
  name_ar: string;
  team_id: string;
  position: Position;
  nationality: string;
  nationality_ar: string;
  photo: string; // emoji or url
  number: number;
  age?: number;
  club?: string;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  team_id: string;
  type: EventType;
  player: string;
  player_ar?: string;
  minute: number;
  detail?: string; // e.g. "Yellow Card", "Penalty", "Own Goal"
}

export interface MatchLineup {
  id: string;
  match_id: string;
  team_id: string;
  formation: string; // e.g. "4-3-3"
  starters: PlayerLineupEntry[];
  substitutes: PlayerLineupEntry[];
  coach?: string;
}

export interface PlayerLineupEntry {
  player_id: string;
  name: string;
  name_ar: string;
  number: number;
  position: Position;
}

export interface StandingsRow {
  id: string;
  group: string;
  team_id: string;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export interface MatchStatistics {
  possession: [number, number];
  shots: [number, number];
  shots_on_target: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellow_cards: [number, number];
  red_cards: [number, number];
  passes: [number, number];
  pass_accuracy: [number, number];
}

export interface Match {
  id: string;
  fixture_id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  date: string; // ISO
  round: MatchRound;
  stage_order: number;
  group?: string;
  stadium?: string;
  city?: string;
  referee?: string;
  minute?: number; // for LIVE matches
  // Knockout specific
  winner_id?: string | null;
  loser_id?: string | null;
  next_match_id?: string | null;
  bracket_position?: number;
  // Relations
  events?: MatchEvent[];
  statistics?: MatchStatistics;
  lineups?: MatchLineup[];
  man_of_the_match?: string | null;
}

export interface TopScorerRow {
  player_id: string;
  goals: number;
  assists: number;
  team_id: string;
  penalties?: number;
  matches_played?: number;
}

export interface TopAssistRow {
  player_id: string;
  assists: number;
  goals: number;
  team_id: string;
  matches_played?: number;
}

// ===== UI / Navigation =====
export type PageKey =
  | 'home'
  | 'matches'
  | 'match-details'
  | 'groups'
  | 'knockout'
  | 'teams'
  | 'team-details'
  | 'players'
  | 'top-scorers'
  | 'top-assists'
  | 'favorites';

export interface NavState {
  page: PageKey;
  params?: Record<string, string>;
}

export type FavoriteKind = 'team' | 'match' | 'player';
