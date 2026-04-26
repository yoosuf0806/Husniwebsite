-- ============================================
-- FIX: RLS Policies for Admin Write Access
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop conflicting policies
DROP POLICY IF EXISTS "anon_read_content" ON site_content;
DROP POLICY IF EXISTS "anon_all_content" ON site_content;
DROP POLICY IF EXISTS "service_all_content" ON site_content;
DROP POLICY IF EXISTS "anon_read_projects" ON projects;
DROP POLICY IF EXISTS "anon_all_projects" ON projects;
DROP POLICY IF EXISTS "service_all_projects" ON projects;
DROP POLICY IF EXISTS "anon_read_services" ON services;
DROP POLICY IF EXISTS "anon_all_services" ON services;
DROP POLICY IF EXISTS "service_all_services" ON services;
DROP POLICY IF EXISTS "anon_read_settings" ON site_settings;
DROP POLICY IF EXISTS "anon_all_settings" ON site_settings;
DROP POLICY IF EXISTS "service_all_settings" ON site_settings;
DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
DROP POLICY IF EXISTS "anon_all_enquiries" ON enquiries;
DROP POLICY IF EXISTS "service_all_enquiries" ON enquiries;

-- Simple open policies (admin uses anon key, so anon needs full access)
CREATE POLICY "full_access_content" ON site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);

-- Verify policies
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('site_content','projects','services','site_settings','enquiries')
ORDER BY tablename, policyname;
