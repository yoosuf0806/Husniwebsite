-- ============================================
-- HUSNI MARIKKAR ARCHITECTS — FULL SETUP
-- Run this FIRST in Supabase SQL Editor
-- ============================================

-- STEP 1: Create tables if they don't exist
CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT DEFAULT '',
  year TEXT DEFAULT '',
  location TEXT DEFAULT '',
  client TEXT DEFAULT '',
  consultant TEXT DEFAULT '',
  role TEXT DEFAULT '',
  area TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'residential',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'default',
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  project_type TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'homepage'
);

-- STEP 2: Disable RLS completely
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;

-- STEP 3: Grant full permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- STEP 4: Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('site-images', 'site-images', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public=true, file_size_limit=52428800;

DO $$ BEGIN
  DROP POLICY IF EXISTS "open_read" ON storage.objects;
  DROP POLICY IF EXISTS "open_insert" ON storage.objects;
  DROP POLICY IF EXISTS "open_update" ON storage.objects;
  DROP POLICY IF EXISTS "open_delete" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "open_read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "open_insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "open_update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "open_delete" ON storage.objects FOR DELETE USING (true);

-- STEP 5: Insert ALL default content
INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow',       'Architecture & Interior Design'),
  ('hero_line1',         'Your home,'),
  ('hero_line2',         'reimagined'),
  ('hero_line3',         'beautifully.'),
  ('hero_body',          'Let''s redesign your home together — creating refined spaces that reflect your lifestyle, crafted to your budget.'),
  ('hero_badge_num',     '6+'),
  ('hero_badge_label',   'High-budget projects delivered'),
  ('about_heading',      'Designing with purpose & precision.'),
  ('about_p1',           'I''m Husni — a London-based architect and project manager. BSc Architecture and currently completing my Masters in Project Management at the University of Westminster. Over four years and 6+ high-budget projects, I''ve learned that good architecture is equal parts care, clarity and craft.'),
  ('about_p2',           'I work closely with homeowners across Greater London and the Home Counties — translating how you actually live into refined, beautifully detailed spaces, delivered on time and on budget.'),
  ('stat1_num',          '6+'),
  ('stat1_label',        'Projects'),
  ('stat2_num',          '4 Years'),
  ('stat2_label',        'Experience'),
  ('stat3_num',          'MSc'),
  ('stat3_label',        'Westminster'),
  ('stat4_num',          'BIM/Revit'),
  ('stat4_label',        'Certified'),
  ('about_story_heading','My story'),
  ('about_story_p1',     'I grew up fascinated by the way buildings shape experience — how a well-considered room can make you feel calm, energised, or at home in a way you can''t quite articulate. That curiosity led me to study Architecture at undergraduate level, and eventually to specialise in Project Management at the University of Westminster.'),
  ('about_story_p2',     'Over the past four years I''ve worked on a range of projects across Greater London and beyond — from full residential renovations to institutional extensions and major civic infrastructure. Each project has deepened my belief that the best architecture is invisible: it simply works, looks beautiful, and makes life better.'),
  ('about_story_p3',     'I work with homeowners who care about quality, who want their space to reflect who they are, and who want a single trusted professional managing the entire process — from first sketch to final snag.'),
  ('about_work_heading', 'How I work'),
  ('about_work_p1',      'Every project begins with listening. Before I pick up a pen or open Revit, I want to understand how you actually use your home — the morning routine, the entertaining, the quiet moments. Architecture that doesn''t respond to those realities is just decoration.'),
  ('about_work_p2',      'I use BIM software (Revit + 3D visualisation) throughout the process so you can see exactly what you''re getting before anything is built. I keep my practice deliberately small — a limited number of projects at a time so every client receives my full attention.'),
  ('about_timeline_heading','Timeline'),
  ('tl1_year',           '2024'),
  ('tl1_title',          'MSc Project Management — University of Westminster'),
  ('tl1_desc',           'Currently completing Masters programme specialising in construction project delivery.'),
  ('tl2_year',           '2023'),
  ('tl2_title',          'Ansell HR & Finance — Seeduwa, Sri Lanka'),
  ('tl2_desc',           'Lead drafter and 3D BIM modeller for 15,000 sq ft commercial interior refurbishment.'),
  ('tl3_year',           '2022'),
  ('tl3_title',          'Kandy Multimodal Transport Terminal'),
  ('tl3_desc',           'Part of design team for World Bank-funded civic infrastructure project spanning 39,364 sqm.'),
  ('tl4_year',           '2020'),
  ('tl4_title',          'BSc Architecture — University of Westminster'),
  ('tl4_desc',           'Graduated with first-class honours. Dissertation focused on adaptive reuse in urban residential contexts.'),
  ('about_believe_heading','What I believe'),
  ('val1_title',         'Clarity first'),
  ('val1_desc',          'No jargon, no surprises. You''ll always know where the project stands and what decisions are coming next.'),
  ('val2_title',         'Craft matters'),
  ('val2_desc',          'Details make the difference. I sweat the small stuff so you don''t have to.'),
  ('val3_title',         'Budget is real'),
  ('val3_desc',          'I design to your budget, not around it. Good architecture doesn''t require unlimited funds.'),
  ('cred1_label',        'Education'),
  ('cred1_val',          'MSc Project Management'),
  ('cred1_sub',          'University of Westminster'),
  ('cred2_label',        'Education'),
  ('cred2_val',          'BSc Architecture'),
  ('cred2_sub',          'University of Westminster'),
  ('cred3_val',          'Revit / BIM'),
  ('cred3_sub',          'AutoCAD · SketchUp · Lumion'),
  ('cta_heading1',       'Ready to reimagine'),
  ('cta_heading2',       'your home?'),
  ('cta_subtext',        'Initial consultations are always free and completely unhurried.'),
  ('cta_btn1',           'Start a Conversation'),
  ('cta_btn2',           'See My Work'),
  ('projects_eyebrow',   'Selected Works'),
  ('projects_heading',   '2020 — 2025'),
  ('services_eyebrow',   'What I Offer'),
  ('services_heading',   'Services designed for real homes.'),
  ('contact_heading',    'Let''s create something exceptional.'),
  ('contact_subheading', 'Tell me a little about your home and what you''re trying to achieve. Initial consultations are always free and unhurried.'),
  ('contact_email',      'husni@husnimarikkar.co.uk'),
  ('contact_phone',      '+44 7466 554153'),
  ('contact_based',      'London, United Kingdom'),
  ('contact_serving',    'Greater London & Home Counties'),
  ('contact_availability','Currently accepting new projects'),
  ('whatsapp_number',    '447466554153'),
  ('linkedin_url',       '#'),
  ('behance_url',        '#'),
  ('seo_title',          'Husni Marikkar Architects | Residential Architecture & Interior Design London'),
  ('seo_description',    'London-based architect offering bespoke home renovation, interior design and new build architecture. University of Westminster graduate. Free initial consultation.'),
  ('seo_keywords',       'architect London, residential interior design UK, home renovation architect, affordable architect London, 3D BIM visualisation UK'),
  ('ga_tracking_id',     ''),
  ('footer_copyright',   '© 2025 Husni Marikkar Architects. All rights reserved.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- STEP 6: Insert default projects
DELETE FROM projects; -- Clear existing to avoid duplicates
INSERT INTO projects (title, type, year, location, client, consultant, role, area, description, image_url, category, featured, sort_order, visible) VALUES
  ('Ansell HR & Finance', 'Commercial Interior · Adaptive Reuse', '2023', 'Seeduwa, Sri Lanka', 'Ansell Lanka PVT LTD', 'Urban Development Authority', 'Drafting / 3D BIM', '15,000 sq ft', 'A complete interior refurbishment — adaptive reuse of existing storage space for 100 HR & Finance employees. Included façade elevation, interior arrangement, lighting, electrical layout and plumbing.', 'images/p1_ansell.jpg', 'commercial', false, 1, true),
  ('J''Pura Engineering Faculty', 'Institutional Extension', '2023', 'Sri Lanka', 'Ministry of Education', 'TSW Architects', 'Architect Assistant', '', 'Extension added to existing building as a new wing. Façade designed with steel, glass mullions and brick to match existing language. Coordinated drawings and schedules with client. Due 2027.', 'images/p2_jpura.jpg', 'civic', false, 2, true),
  ('Nova Apartments', 'Residential Interior Design', '2024–2026', 'Sri Lanka', 'Nicola Constructions', '', 'Interior Designer', '', 'Full interior design for residential apartment complex including bedroom, kitchen, gym and bathroom spaces. Modern yet refined approach with bespoke furniture layouts and custom lighting design.', 'images/p3_nova.jpg', 'residential', false, 3, true),
  ('Kandy Multimodal Terminal', 'Civic Infrastructure', '2020', 'Kandy, Sri Lanka', 'Ministry of Megapolis / UDA', 'Muditha Jayakody Associates', 'Design Team Member', '39,364 sqm', 'Major civic infrastructure project addressing public transport in Kandy. Terminal, parking, arcade and goods shed buildings connected via underground passageway and overhead skywalk. 330,000 passengers/day. Funded by World Bank.', 'images/p4_kmtt.jpg', 'civic', true, 4, true);

-- STEP 7: Insert default services
DELETE FROM services;
INSERT INTO services (name, description, icon, sort_order, visible) VALUES
  ('Home Renovation',       'Bespoke refurbishment of period and contemporary homes — seamlessly blending commission and full fit-out. I manage the entire process from design through planning to construction oversight, every decision made with your budget and lifestyle in mind.', 'home',     1, true),
  ('New Build Design',      'Bespoke architectural design for new homes, from initial sketch through planning to detailed construction drawings. The design process begins with understanding the site, the planning context and how you want to live.',                                 'building', 2, true),
  ('3D BIM Visualisation',  'Photorealistic BIM models so you can walk through your home before a single brick is laid. Built in Revit and rendered to photorealistic quality — explore material choices and lighting conditions before committing.',                              'screen',   3, true),
  ('Space Planning',        'Layout strategy that makes every room feel larger, lighter and more aligned with how you actually live. I specialise in finding the hidden potential in existing floor plans — removing the right wall, opening up a kitchen.',                       'grid',     4, true),
  ('Interior Design',       'Material palettes, furniture specification and lighting design — crafted to your taste and budget. From concept boards to bespoke joinery details, every element considered and complete.',                                                           'interior', 5, true),
  ('Planning & Approvals',  'Full planning application management — from pre-app advice through to decision and beyond. I know what planners respond to and how to present proposals persuasively.',                                                                               'document', 6, true);

-- STEP 8: Test write access
DO $$
BEGIN
  UPDATE site_content SET updated_at = NOW() WHERE key = 'hero_eyebrow';
  RAISE NOTICE '✅ Write test PASSED — admin saves will work!';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Write test FAILED: %', SQLERRM;
END $$;

SELECT key, LEFT(value,50) as value_preview FROM site_content ORDER BY key LIMIT 10;
SELECT title, visible FROM projects ORDER BY sort_order;
SELECT name, visible FROM services ORDER BY sort_order;
SELECT '✅ Setup complete! ' || COUNT(*)::text || ' content fields ready.' as result FROM site_content;
