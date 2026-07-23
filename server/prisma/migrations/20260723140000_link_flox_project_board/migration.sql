-- Link Flox projects to legacy Express task boards
ALTER TABLE "flox_projects" ADD COLUMN IF NOT EXISTS "boardProjectId" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "flox_projects_boardProjectId_key" ON "flox_projects"("boardProjectId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'flox_projects_boardProjectId_fkey'
  ) THEN
    ALTER TABLE "flox_projects"
      ADD CONSTRAINT "flox_projects_boardProjectId_fkey"
      FOREIGN KEY ("boardProjectId") REFERENCES "Project"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
