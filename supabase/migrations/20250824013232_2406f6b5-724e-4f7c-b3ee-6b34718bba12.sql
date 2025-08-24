-- Remove sensitive OAuth tokens from client-accessible table
-- These will be moved to secure backend storage

-- Drop the sensitive token columns
ALTER TABLE public.social_accounts 
DROP COLUMN IF EXISTS access_token,
DROP COLUMN IF EXISTS refresh_token,
DROP COLUMN IF EXISTS token_expires_at;

-- Add a secure reference ID instead
ALTER TABLE public.social_accounts 
ADD COLUMN token_reference_id text;

-- Update table comment to reflect security change
COMMENT ON TABLE public.social_accounts IS 'Social media account connections - tokens stored securely in backend only';