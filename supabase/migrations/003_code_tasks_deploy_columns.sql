ALTER TABLE code_tasks
  ADD COLUMN IF NOT EXISTS branch TEXT,
  ADD COLUMN IF NOT EXISTS preview_url TEXT,
  ADD COLUMN IF NOT EXISTS pr_number INTEGER,
  ADD COLUMN IF NOT EXISTS deployed_at TIMESTAMPTZ;

ALTER TABLE code_tasks DROP CONSTRAINT IF EXISTS code_tasks_status_check;
ALTER TABLE code_tasks ADD CONSTRAINT code_tasks_status_check CHECK (
  status IN ('pending', 'running', 'done', 'preview-building', 'preview-ready', 'deploying', 'deployed', 'cancelled', 'error')
);
