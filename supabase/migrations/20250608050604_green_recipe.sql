/*
  # Add attachments support to posts and assignments

  1. Schema Changes
    - Add `attachments` column to `posts` table to store file metadata as JSON array
    - Add `attachments` column to `assignments` table to store file metadata as JSON array
  
  2. Storage Setup
    - Storage bucket and policies are handled in separate migration file
*/

-- Add attachments column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE posts ADD COLUMN attachments text[];
  END IF;
END $$;

-- Add attachments column to assignments table  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assignments' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE assignments ADD COLUMN attachments text[];
  END IF;
END $$;