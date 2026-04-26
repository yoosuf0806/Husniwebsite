-- ============================================
-- FIX STORAGE BUCKET
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images', 
  'site-images', 
  true, 
  52428800,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true, 
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml'];

-- Step 2: Drop any old storage policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
  END LOOP;
END $$;

-- Step 3: Create fully open storage policies
CREATE POLICY "allow_all_select" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON storage.objects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_delete" ON storage.objects FOR DELETE USING (true);

-- Step 4: Also fix all table permissions
ALTER TABLE IF EXISTS enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Verify
SELECT 'Bucket created:' as msg, id, name, public FROM storage.buckets WHERE id = 'site-images';
SELECT 'Storage policies:' as msg, policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
SELECT '✅ Storage ready!' as status;
