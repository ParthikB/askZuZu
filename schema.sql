-- Run this once in the Neon SQL editor to create the usage tracking table.
-- If the table already exists, run just the ALTER TABLE statements at the bottom.

CREATE TABLE IF NOT EXISTS usage_logs (
  id                   SERIAL       PRIMARY KEY,
  session_token        TEXT         NOT NULL,
  user_age             INTEGER      NOT NULL,
  device_type          TEXT         NOT NULL,        -- 'mobile' | 'desktop'
  timestamp            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  child_question       TEXT         NOT NULL,
  zuzu_response        TEXT         NOT NULL,
  was_redirected       BOOLEAN      NOT NULL DEFAULT FALSE,
  time_spent_seconds   INTEGER,                      -- NULL until user clicks "Ask another"
  feedback_rating      TEXT,                         -- 'up' | 'down' | NULL
  feedback_tags        TEXT[],                       -- e.g. {'Response was boring'}
  word_clicks          TEXT[]                        -- vocabulary badges tapped, e.g. {'photosynthesis'}
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_session   ON usage_logs (session_token);
CREATE INDEX IF NOT EXISTS idx_usage_logs_timestamp ON usage_logs (timestamp);

-- If upgrading an existing table, run these separately:
-- ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS feedback_rating TEXT;
-- ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS feedback_tags TEXT[];
-- ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS word_clicks TEXT[];

-- Lightweight first-visit tracker (no PII — only timestamp + device type).
-- Populated once per browser via the zuzu_visited localStorage flag.
CREATE TABLE IF NOT EXISTS unique_opens (
  id          SERIAL       PRIMARY KEY,
  timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  device_type TEXT         NOT NULL   -- 'mobile' | 'desktop'
);

CREATE INDEX IF NOT EXISTS idx_unique_opens_timestamp ON unique_opens (timestamp);
