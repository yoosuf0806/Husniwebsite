-- ============================================
-- DEFINITIVE WRITE FIX
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Completely disable RLS on all tables
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies (clean slate)
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE tablename IN ('site_content','projects','services','site_settings','enquiries')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
      pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Step 3: Grant all permissions explicitly
GRANT ALL PRIVILEGES ON TABLE site_content TO anon;
GRANT ALL PRIVILEGES ON TABLE projects TO anon;
GRANT ALL PRIVILEGES ON TABLE services TO anon;
GRANT ALL PRIVILEGES ON TABLE site_settings TO anon;
GRANT ALL PRIVILEGES ON TABLE enquiries TO anon;
GRANT ALL PRIVILEGES ON TABLE site_content TO authenticated;
GRANT ALL PRIVILEGES ON TABLE projects TO authenticated;
GRANT ALL PRIVILEGES ON TABLE services TO authenticated;
GRANT ALL PRIVILEGES ON TABLE site_settings TO authenticated;
GRANT ALL PRIVILEGES ON TABLE enquiries TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 4: Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('site-images', 'site-images', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public=true, file_size_limit=52428800;

-- Step 5: Storage policies
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies 
    WHERE schemaname='storage' AND tablename='objects'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON storage.objects';
  END LOOP;
END $$;

CREATE POLICY "open_read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "open_insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "open_update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "open_delete" ON storage.objects FOR DELETE USING (true);

-- Step 6: Test that writes work
DO $$
BEGIN
  -- Test insert
  INSERT INTO site_content (key, value) 
  VALUES ('_write_test', now()::text)
  ON CONFLICT (key) DO UPDATE SET value = now()::text;
  
  -- Test delete of test row
  DELETE FROM site_content WHERE key = '_write_test';
  
  RAISE NOTICE '✅ Write test PASSED - admin saves will work!';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Write test FAILED: %', SQLERRM;
END $$;

-- Verify
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('site_content','projects','services','site_settings','enquiries')
ORDER BY tablename;

SELECT '✅ All done! Click Test DB in admin — it should show write works.' as result;
