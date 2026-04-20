CREATE TABLE IF NOT EXISTS data_query_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT NOT NULL,
  query TEXT NOT NULL,
  row_count INTEGER,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  error TEXT
);

ALTER TABLE data_query_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Full access data_query_log" ON data_query_log FOR ALL USING (true);
