-- ============================================================
-- World Cup 2026 — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- This schema creates 8 tables + RLS policies (read-only for
-- anon, full access for service_role used by sync scripts).
-- ============================================================

-- ===== 1. stadiums =====
CREATE TABLE IF NOT EXISTS stadiums (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_ar text NOT NULL,
  city text NOT NULL,
  city_ar text NOT NULL,
  country text NOT NULL CHECK (country IN ('USA', 'MEX', 'CAN')),
  capacity integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== 2. teams =====
CREATE TABLE IF NOT EXISTS teams (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_ar text NOT NULL,
  logo text,
  flag text NOT NULL,
  group_id text NOT NULL,           -- 'A'..'L' (use group_id since `group` is reserved-ish)
  fifa_code text NOT NULL,
  fifa_ranking integer,
  coach text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_teams_group ON teams(group_id);

-- ===== 3. players =====
CREATE TABLE IF NOT EXISTS players (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_ar text NOT NULL,
  team_id text NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  position text NOT NULL CHECK (position IN ('GK','DF','MF','FW')),
  nationality text NOT NULL,
  nationality_ar text NOT NULL,
  photo text,
  number integer NOT NULL DEFAULT 1,
  age integer,
  club text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- ===== 4. matches =====
CREATE TABLE IF NOT EXISTS matches (
  id text PRIMARY KEY,
  fixture_id text,                  -- API-Football fixture id
  home_team_id text REFERENCES teams(id),
  away_team_id text REFERENCES teams(id),
  home_score integer,
  away_score integer,
  status text NOT NULL DEFAULT 'NS' CHECK (status IN ('NS','LIVE','HT','FT','AET','PEN')),
  date timestamptz NOT NULL,
  round text NOT NULL CHECK (round IN ('group','R32','R16','QF','SF','FINAL','THIRD')),
  stage_order integer NOT NULL DEFAULT 1,
  group_id text,                    -- only for group stage
  stadium_id text REFERENCES stadiums(id),
  referee text,
  minute integer,                   -- for LIVE matches
  winner_id text REFERENCES teams(id),
  loser_id text REFERENCES teams(id),
  next_match_id text REFERENCES matches(id),
  bracket_position integer,
  man_of_the_match text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round);
CREATE INDEX IF NOT EXISTS idx_matches_group ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_next ON matches(next_match_id);

-- ===== 5. match_events =====
CREATE TABLE IF NOT EXISTS match_events (
  id text PRIMARY KEY,
  match_id text NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id text REFERENCES teams(id),
  type text NOT NULL CHECK (type IN ('goal','card','substitution')),
  player text NOT NULL,
  player_ar text,
  player_id text,
  minute integer NOT NULL,
  detail text,                       -- e.g. 'Penalty', 'Yellow', 'Red', 'Own Goal'
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_events_minute ON match_events(minute);

-- ===== 6. match_lineups =====
CREATE TABLE IF NOT EXISTS match_lineups (
  id text PRIMARY KEY,
  match_id text NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id text NOT NULL REFERENCES teams(id),
  formation text NOT NULL,
  starters jsonb NOT NULL DEFAULT '[]'::jsonb,
  substitutes jsonb NOT NULL DEFAULT '[]'::jsonb,
  coach text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lineups_match ON match_lineups(match_id);

-- ===== 7. standings =====
CREATE TABLE IF NOT EXISTS standings (
  id text PRIMARY KEY,
  group_id text NOT NULL,
  team_id text NOT NULL REFERENCES teams(id),
  played integer NOT NULL DEFAULT 0,
  win integer NOT NULL DEFAULT 0,
  draw integer NOT NULL DEFAULT 0,
  lose integer NOT NULL DEFAULT 0,
  goals_for integer NOT NULL DEFAULT 0,
  goals_against integer NOT NULL DEFAULT 0,
  goal_diff integer GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_standings_group ON standings(group_id);
CREATE INDEX IF NOT EXISTS idx_standings_points ON standings(points DESC);

-- ===== 8. top_scorers =====
CREATE TABLE IF NOT EXISTS top_scorers (
  player_id text PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  team_id text NOT NULL REFERENCES teams(id),
  goals integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  penalties integer NOT NULL DEFAULT 0,
  matches_played integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_top_scorers_goals ON top_scorers(goals DESC);

-- ===== 9. top_assists =====
CREATE TABLE IF NOT EXISTS top_assists (
  player_id text PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  team_id text NOT NULL REFERENCES teams(id),
  assists integer NOT NULL DEFAULT 0,
  goals integer NOT NULL DEFAULT 0,
  matches_played integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_top_assists ON top_assists(assists DESC);

-- ===== 10. sync_state (tracks last sync times) =====
CREATE TABLE IF NOT EXISTS sync_state (
  id text PRIMARY KEY,                -- e.g. 'matches', 'standings', 'top_scorers'
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  last_status text,                   -- 'success' | 'error'
  last_error text,
  rows_affected integer DEFAULT 0
);

-- ============================================================
-- Row Level Security (RLS)
-- Anon role: READ-ONLY (frontend never writes)
-- Service role: FULL ACCESS (sync scripts only)
-- ============================================================
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_scorers ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_assists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_state ENABLE ROW LEVEL SECURITY;

-- Anon can SELECT (no auth required — public read)
CREATE POLICY "anon_read_stadiums"    ON stadiums    FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_teams"       ON teams       FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_players"     ON players     FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_matches"     ON matches     FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_events"      ON match_events FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_lineups"     ON match_lineups FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_standings"   ON standings   FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_scorers"     ON top_scorers FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_assists"     ON top_assists FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_sync_state"  ON sync_state  FOR SELECT TO anon USING (true);

-- (Service role bypasses RLS by default — no policies needed)

COMMENT ON TABLE matches IS 'World Cup 2026 matches — group + knockout (R32→R16→QF→SF→FINAL→THIRD)';
COMMENT ON TABLE teams IS '48 national teams in 12 groups (A-L)';
COMMENT ON TABLE sync_state IS 'Tracks last sync times for each data feed';
