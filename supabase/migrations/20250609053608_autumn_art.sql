/*
  # Fix Authentication Configuration

  1. Authentication Settings
    - Disable email confirmation for development
    - Enable user signups
    - Configure OAuth settings

  2. Note
    - OAuth providers need to be configured in Supabase Dashboard
    - The auth.config table doesn't exist in newer Supabase versions
    - Settings are managed through the dashboard instead
*/

-- Note: In newer versions of Supabase, auth configuration is managed through the dashboard
-- These settings should be configured in your Supabase project dashboard:

-- 1. Go to Authentication > Settings
-- 2. Set "Enable email confirmations" to OFF (for development)
-- 3. Set "Enable sign ups" to ON

-- 4. Go to Authentication > Providers
-- 5. Configure Google OAuth:
--    - Enable Google provider
--    - Add Client ID and Client Secret from Google Cloud Console
--    - Redirect URL: https://xrahjhhjeamprikyjwyg.supabase.co/auth/v1/callback

-- 6. Configure GitHub OAuth:
--    - Enable GitHub provider  
--    - Add Client ID and Client Secret from GitHub OAuth App
--    - Redirect URL: https://xrahjhhjeamprikyjwyg.supabase.co/auth/v1/callback

-- No SQL commands needed - all configuration is done through the Supabase Dashboard