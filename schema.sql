-- Run this once in the Neon SQL editor to create the usage tracking table.

CREATE TABLE IF NOT EXISTS usage_logs (
  id                   SERIAL       PRIMARY KEY,
  session_token        TEXT         NOT NULL,
  user_age             INTEGER      NOT NULL,
  device_type          TEXT         NOT NULL,        -- 'mobile' | 'desktop'
  timestamp            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  child_question       TEXT         NOT NULL,
  zuzu_response        TEXT         NOT NULL,
  was_redirected       BOOLEAN      NOT NULL DEFAULT FALSE,
  time_spent_seconds   INTEGER                        -- NULL until user clicks "Ask another"
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_session   ON usage_logs (session_token);
CREATE INDEX IF NOT EXISTS idx_usage_logs_timestamp ON usage_logs (timestamp);
