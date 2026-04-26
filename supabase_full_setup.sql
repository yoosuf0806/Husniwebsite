-- ============================================
-- HUSNI MARIKKAR ARCHITECTS - FULL DB SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing tables cleanly
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;

-- 1. ENQUIRIES
CREATE TABLE enquiries (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'homepage'
);

-- 2. SITE CONTENT (all editable text)
CREATE TABLE site_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT,
  year TEXT,
  location TEXT,
  client TEXT,
  consultant TEXT,
  role TEXT,
  area TEXT,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'residential',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE
);

-- 4. SERVICES
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'default',
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE
);

-- 5. SITE SETTINGS
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries
CREATE POLICY "public_insert_enquiries" ON enquiries FOR INSERT TO anon WITH CHECK (true);
-- Public can read everything
CREATE POLICY "public_read_content" ON site_content FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_projects" ON projects FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_services" ON services FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT TO anon USING (true);
-- Authenticated (admin) can do everything
CREATE POLICY "auth_all_enquiries" ON enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_content" ON site_content FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_all_settings" ON site_settings FOR ALL TO authenticated USING (true);
-- Anon can also update/delete (for admin panel using anon key)
CREATE POLICY "anon_all_enquiries" ON enquiries FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_content" ON site_content FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_projects" ON projects FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_services" ON services FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_settings" ON site_settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============ DEFAULT CONTENT ============
INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow', 'Architecture & Interior Design'),
  ('hero_line1', 'Your home,'),
  ('hero_line2', 'reimagined'),
  ('hero_line3', 'beautifully.'),
  ('hero_body', 'Let''s redesign your home together — creating refined spaces that reflect your lifestyle, crafted to your budget.'),
  ('hero_badge_num', '6+'),
  ('hero_badge_label', 'High-budget projects delivered'),
  ('about_heading', 'Designing with purpose & precision.'),
  ('about_p1', 'I''m Husni — a London-based architect and project manager. BSc Architecture and currently completing my Masters in Project Management at the University of Westminster. Over four years and 6+ high-budget projects, I''ve learned that good architecture is equal parts care, clarity and craft.'),
  ('about_p2', 'I work closely with homeowners across Greater London and the Home Counties — translating how you actually live into refined, beautifully detailed spaces, delivered on time and on budget.'),
  ('stat1_num', '6+'),
  ('stat1_label', 'Projects'),
  ('stat2_num', '4 Years'),
  ('stat2_label', 'Experience'),
  ('stat3_num', 'MSc'),
  ('stat3_label', 'Westminster'),
  ('stat4_num', 'BIM/Revit'),
  ('stat4_label', 'Certified'),
  ('contact_email', 'husni@husnimarikkar.co.uk'),
  ('contact_phone', '+44 7466 554153'),
  ('contact_based', 'London, United Kingdom'),
  ('contact_serving', 'Greater London & Home Counties'),
  ('contact_availability', 'Currently accepting new projects'),
  ('whatsapp_number', '447466554153'),
  ('linkedin_url', '#'),
  ('behance_url', '#'),
  ('seo_title', 'Husni Marikkar Architects | Residential Architecture & Interior Design London'),
  ('seo_description', 'London-based architect offering bespoke home renovation, interior design and new build architecture. University of Westminster graduate. Free initial consultation.'),
  ('seo_keywords', 'architect London, residential interior design UK, home renovation architect, affordable architect London, 3D BIM visualisation UK'),
  ('ga_tracking_id', ''),
  ('footer_copyright', '© 2025 Husni Marikkar Architects. All rights reserved.');

-- ============ DEFAULT PROJECTS ============
INSERT INTO projects (title, type, year, location, client, consultant, role, area, description, image_url, category, featured, sort_order, visible) VALUES
  ('Ansell HR & Finance', 'Commercial Interior · Adaptive Reuse', '2023', 'Seeduwa, Sri Lanka', 'Ansell Lanka PVT LTD', 'Urban Development Authority', 'Drafting / 3D BIM', '15,000 sq ft', 'A complete interior refurbishment project — adaptive reuse of existing storage space. The interior housed around 100 employees of the HR & Finance department. Project included façade elevation, interior arrangement, lighting, electrical layout plans and plumbing layout.', 'images/p1_ansell.jpg', 'commercial', false, 1, true),
  ('J''Pura Engineering Faculty', 'Institutional Extension', '2023', 'Sri Lanka', 'Ministry of Education', 'TSW Architects', 'Architect Assistant', NULL, 'An extension added to the existing building as the new wing. The façade was designed with steel and glass mullions and a combination of brick to match the existing building language. I coordinated project drawings and schedules with the client. Construction is in progress and to be completed by 2027.', 'images/p2_jpura.jpg', 'civic', false, 2, true),
  ('Nova Apartments', 'Residential Interior Design', '2024–2026', 'Sri Lanka', 'Nicola Constructions', NULL, 'Interior Designer', NULL, 'Full interior design for a luxury residential apartment complex including master bedroom, kitchen, dining, gym and bathroom spaces. Modern aesthetic with warm tones, natural materials and considered lighting throughout.', 'images/p3_nova.jpg', 'residential', false, 3, true),
  ('Kandy Multimodal Terminal', 'Civic Infrastructure', '2020', 'Kandy, Sri Lanka', 'Ministry of Megapolis / UDA', 'Muditha Jayakody Associates', 'Design Team Member', '39,364 sqm', 'One of Sri Lanka''s most significant civic infrastructure projects — reimagining public transport in Kandy. Spanning 39,364 sqm with terminal building, parking, arcade and goods shed buildings connected via an underground passageway and overhead skywalk. Expected to handle 330,000 passengers per day with over 5,000 bus trips from 193 routes. Funded by The World Bank.', 'images/p4_kmtt.jpg', 'civic', true, 4, true);

-- ============ DEFAULT SERVICES ============
INSERT INTO services (name, description, icon, sort_order, visible) VALUES
  ('Home Renovation', 'Bespoke refurbishment of period and contemporary homes — seamlessly blending commission and full fit-out. I manage the entire process from design through planning to construction oversight.', 'renovation', 1, true),
  ('New Build Design', 'Bespoke architectural design for new homes, from initial sketch through planning to detailed construction drawings. The design process begins with your site, your context and how you want to live.', 'newbuild', 2, true),
  ('3D BIM Visualisation', 'Photorealistic BIM models so you can walk through your home before a single brick is laid. Built in Revit and rendered to photorealistic quality — make confident decisions without expensive on-site changes.', 'bim', 3, true),
  ('Space Planning', 'Layout strategy that makes every room feel larger, lighter and more aligned with how you actually live. Small interventions that transform how a home feels.', 'planning', 4, true),
  ('Interior Design', 'Material palettes, furniture specification and lighting design — crafted to your taste and budget. The goal is always coherence — spaces that feel considered and complete.', 'interior', 5, true),
  ('Planning & Approvals', 'Full planning application management — from pre-app advice through to decision and beyond. I know what planners respond to and how to present proposals persuasively.', 'approvals', 6, true);

-- ============ DEFAULT SETTINGS ============
INSERT INTO site_settings (key, value) VALUES
  ('section_about', 'true'),
  ('section_projects', 'true'),
  ('section_services', 'true'),
  ('section_contact', 'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

SELECT 'Setup complete! Tables created with default data.' as status;
SELECT 'site_content rows: ' || COUNT(*) as info FROM site_content;
SELECT 'projects rows: ' || COUNT(*) as info FROM projects;
SELECT 'services rows: ' || COUNT(*) as info FROM services;
