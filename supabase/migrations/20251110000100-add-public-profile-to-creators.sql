-- Migration: Add public profile support for creators
-- Description: Introduce visibility flag and public metadata for creator profiles

ALTER TABLE creators
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

ALTER TABLE creators
ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id);

-- Optional public bio storage distinct from internal notes
ALTER TABLE creators
ADD COLUMN IF NOT EXISTS public_bio TEXT;

-- Ensure updated_at reflects column changes
UPDATE creators
SET updated_at = NOW()
WHERE TRUE;

