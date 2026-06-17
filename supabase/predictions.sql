-- ============================================================
-- Predictions table (no auth — stored by session ID in localStorage)
-- ============================================================
CREATE TABLE IF NOT EXISTS predictions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  match_id text NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  predictor_name text NOT NULL,
  predicted_home_score integer NOT NULL,
  predicted_away_score integer NOT NULL,
  actual_home_score integer,
  actual_away_score integer,
  is_correct boolean,
  is_exact boolean,
  points integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_name ON predictions(predictor_name);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_predictions" ON predictions FOR ALL TO anon USING (true) WITH CHECK (true);
