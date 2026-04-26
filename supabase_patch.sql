-- Run this in Supabase SQL Editor to add missing content keys
INSERT INTO site_content (key, value) VALUES
  ('stat1_num', '6+'),
  ('stat1_label', 'Projects'),
  ('stat2_num', '4 Years'),
  ('stat2_label', 'Experience'),
  ('stat3_num', 'MSc'),
  ('stat3_label', 'Westminster'),
  ('stat4_num', 'BIM/Revit'),
  ('stat4_label', 'Certified'),
  ('seo_title', 'Husni Marikkar Architects | Residential Architecture & Interior Design London'),
  ('seo_description', 'London-based architect offering bespoke home renovation, interior design and new build architecture. University of Westminster graduate. Free initial consultation.'),
  ('seo_keywords', 'architect London, residential interior design UK, home renovation architect, affordable architect London'),
  ('linkedin_url', '#'),
  ('behance_url', '#')
ON CONFLICT (key) DO NOTHING;

SELECT key, value FROM site_content ORDER BY key;
