/*
  # Create Events Feed and User Profiles

  1. New Tables
    - `user_profiles` - Store user profile information
    - `events` - Store event posts (like Facebook feed)
    - `event_comments` - Store comments on events
    - `event_reactions` - Store reactions (like, love, etc.)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no auth required)
    - Allow anyone to create, read, update posts and profiles
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  location text,
  website text,
  achievements text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table (like Facebook feed)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id text,
  author_name text NOT NULL,
  author_avatar text,
  content text NOT NULL,
  event_type text DEFAULT 'general' CHECK (event_type IN ('general', 'achievement', 'announcement', 'workshop', 'conference', 'meetup')),
  attachments text[],
  location text,
  event_date timestamptz,
  tags text[],
  reactions_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_comments table
CREATE TABLE IF NOT EXISTS event_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_avatar text,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES event_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create event_reactions table
CREATE TABLE IF NOT EXISTS event_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_identifier text NOT NULL, -- email or name since no auth
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'love', 'celebrate', 'support', 'insightful')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_identifier, reaction_type)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles (public access)
CREATE POLICY "Anyone can view profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create profiles"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON user_profiles FOR UPDATE
  TO public
  USING (true);

-- Create policies for events (public access)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create events"
  ON events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete events"
  ON events FOR DELETE
  TO public
  USING (true);

-- Create policies for event_comments (public access)
CREATE POLICY "Anyone can view comments"
  ON event_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON event_comments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update comments"
  ON event_comments FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete comments"
  ON event_comments FOR DELETE
  TO public
  USING (true);

-- Create policies for event_reactions (public access)
CREATE POLICY "Anyone can view reactions"
  ON event_reactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create reactions"
  ON event_reactions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update reactions"
  ON event_reactions FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete reactions"
  ON event_reactions FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_author ON events(author_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reactions_event_id ON event_reactions(event_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);