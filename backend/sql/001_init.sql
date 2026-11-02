CREATE TABLE IF NOT EXISTS app_state (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  state_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT,
  CONSTRAINT app_state_single_row CHECK (id = 1)
);

CREATE INDEX IF NOT EXISTS idx_app_state_updated_at ON app_state (updated_at DESC);
