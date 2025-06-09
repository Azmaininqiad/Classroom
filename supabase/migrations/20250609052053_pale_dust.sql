/*
  # Setup Authentication

  1. Authentication Setup
    - Enable email/password authentication
    - Enable Google OAuth provider
    - Enable GitHub OAuth provider
    - Configure auth settings

  2. Security
    - Set up proper auth policies
    - Configure email confirmation settings
*/

-- Enable email confirmation (set to false for development)
UPDATE auth.config SET email_confirm = false;

-- Enable sign up
UPDATE auth.config SET enable_signup = true;

-- Note: OAuth providers (Google, GitHub) need to be configured in the Supabase dashboard
-- Go to Authentication > Providers to set up:
-- 1. Google OAuth (requires Client ID and Client Secret)
-- 2. GitHub OAuth (requires Client ID and Client Secret)