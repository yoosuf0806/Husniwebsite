-- ============================================
-- COMPLETE FIX: RLS + Storage + Permissions
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Drop ALL existing policies on all tables
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies 
    WHERE tablename IN ('enquiries','site_content','projects','services','site_settings')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
  END LOOP;
END $$;

-- 2. Disable RLS completely (simplest fix for single-admin setup)
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 3. Grant full access to anon and authenticated roles
GRANT ALL ON enquiries TO anon, authenticated;
GRANT ALL ON site_content TO anon, authenticated;
GRANT ALL ON projects TO anon, authenticated;
GRANT ALL ON services TO anon, authenticated;
GRANT ALL ON site_settings TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. Create Supabase Storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-images', 'site-images', true, 10485760, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

-- 5. Drop existing storage policies
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload site-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete site-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read" ON storage.objects;

-- 6. Create open storage policies
CREATE POLICY "Public read site-images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Anyone can upload to site-images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Anyone can update site-images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'site-images');

CREATE POLICY "Anyone can delete site-images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'site-images');

-- 7. Verify everything
SELECT 'Tables accessible:' as check;
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('enquiries','site_content','projects','services','site_settings')
ORDER BY tablename;

SELECT 'Storage bucket:' as check;
SELECT id, name, public FROM storage.buckets WHERE id = 'site-images';

SELECT 'Content rows:' as check;
SELECT COUNT(*) as count FROM site_content;

SELECT 'Projects rows:' as check;
SELECT COUNT(*) as count FROM projects;

SELECT 'Services rows:' as check;
SELECT COUNT(*) as count FROM services;

SELECT '✅ All done! Admin should now work fully.' as status;
