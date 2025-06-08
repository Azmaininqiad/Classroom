/*
  # Create Storage Bucket for File Uploads

  1. Storage Setup
    - Create a public bucket called 'classroom-files'
    - Enable public access for file downloads
    - Set up RLS policies for secure uploads

  2. Security
    - Allow anyone to upload files (no authentication required)
    - Allow public read access to files
    - Allow anyone to delete files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('classroom-files', 'classroom-files', true);

-- Allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'classroom-files');

-- Allow anyone to upload files (no authentication required)
CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'classroom-files');

-- Allow anyone to update files
CREATE POLICY "Anyone can update files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'classroom-files');

-- Allow anyone to delete files
CREATE POLICY "Anyone can delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'classroom-files');