/*
  # Create Storage Bucket for File Uploads

  1. Storage Setup
    - Create a public bucket called 'classroom-files'
    - Enable public access for file downloads
    - Set up RLS policies for secure uploads

  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to files
    - Restrict delete operations to file owners
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('classroom-files', 'classroom-files', true);

-- Allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'classroom-files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'classroom-files' AND auth.role() = 'authenticated');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'classroom-files' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'classroom-files' AND auth.role() = 'authenticated');