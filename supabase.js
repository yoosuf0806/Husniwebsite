// ============================================
// Husni Marikkar Architects — Data Layer
// Self-contained: renders with hardcoded defaults
// even when Supabase is unavailable or empty.
// ============================================

const SUPA_URL = 'https://nthbgkuiusppwlpejtss.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGJna3VpdXNwcHdscGVqdHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjg5NTAsImV4cCI6MjA4Mjc0NDk1MH0.m0w7Jme2y_D3jxbnjhrWkwBYErdYEnnKHaCgAwhIlXM';

// ─── HARDCODED DEFAULTS ──────────────────────────────────────────────────
// Site renders immediately with these values.
// Supabase overrides them when available.
// Admin "Save Changes" writes to Supabase which then overrides these.

const DEFAULT_CONTENT = {
  hero_eyebrow:    'Architecture & Interior Design',
  hero_line1:      'Your home,',
  hero_line2:      'reimagined',
  hero_line3:      'beautifully.',
  hero_body:       "Let's redesign your home together — creating refined spaces that reflect your lifestyle, crafted to your budget.",
  hero_badge_num:  '6+',
  hero_badge_label:'High-budget projects delivered',
  hero_image:      'images/hero.jpg',

  about_heading:   'Designing with purpose & precision.',
  about_p1:        "I'm Husni — a London-based architect and project manager. BSc Architecture and currently completing my Masters in Project Management at the University of Westminster. Over four years and 6+ high-budget projects, I've learned that good architecture is equal parts care, clarity and craft.",
  about_p2:        'I work closely with homeowners across Greater London and the Home Counties — translating how you actually live into refined, beautifully detailed spaces, delivered on time and on budget.',
  about_image:     'images/about.jpg',

  stat1_num:'6+',   stat1_label:'Projects',
  stat2_num:'4 Yrs', stat2_label:'Experience',
  stat3_num:'MSc',  stat3_label:'Westminster',
  stat4_num:'BIM',  stat4_label:'Certified',

  about_story_heading: 'My story',
  about_story_p1: "I grew up fascinated by the way buildings shape experience — how a well-considered room can make you feel calm, energised, or at home in a way you can't quite articulate.",
  about_story_p2: 'Over the past four years I've worked on a range of projects across Greater London and beyond — from full residential renovations to institutional extensions and major civic infrastructure.',
  about_story_p3: 'I work with homeowners who care about quality, who want their space to reflect who they are, and who want a single trusted professional managing the entire process.',
  about_work_heading: 'How I work',
  about_work_p1: 'Every project begins with listening. Before I pick up a pen or open Revit, I want to understand how you actually use your home.',
  about_work_p2: 'I use BIM software (Revit + 3D visualisation) throughout the process so you can see exactly what you\'re getting before anything is built.',
  about_timeline_heading: 'Timeline',
  tl1_year:'2024', tl1_title:'MSc Project Management — University of Westminster', tl1_desc:'Currently completing Masters specialising in construction project delivery.',
  tl2_year:'2023', tl2_title:'Ansell HR & Finance — Seeduwa, Sri Lanka',           tl2_desc:'Lead drafter and 3D BIM modeller for 15,000 sq ft commercial interior.',
  tl3_year:'2022', tl3_title:'Kandy Multimodal Transport Terminal',                 tl3_desc:'Design team member for World Bank-funded civic infrastructure spanning 39,364 sqm.',
  tl4_year:'2020', tl4_title:'BSc Architecture — University of Westminster',        tl4_desc:'Graduated with first-class honours.',
  about_believe_heading: 'What I believe',
  val1_title:'Clarity first',   val1_desc:"No jargon, no surprises. You'll always know where the project stands.",
  val2_title:'Craft matters',   val2_desc:'Details make the difference. I sweat the small stuff so you don\'t have to.',
  val3_title:'Budget is real',  val3_desc:"I design to your budget, not around it. Good architecture doesn't require unlimited funds.",
  cred1_label:'Education', cred1_val:'MSc Project Management', cred1_sub:'University of Westminster',
  cred2_label:'Education', cred2_val:'BSc Architecture',       cred2_sub:'University of Westminster',
  cred3_val:'Revit / BIM', cred3_sub:'AutoCAD · SketchUp · Lumion',
  cta_heading1:'Ready to reimagine', cta_heading2:'your home?',
  cta_subtext:'Initial consultations are always free and completely unhurried.',
  cta_btn1:'Start a Conversation', cta_btn2:'See My Work',

  projects_eyebrow: 'Selected Works',
  projects_heading:  '2020 — 2025',
  services_eyebrow:  'What I Offer',
  services_heading:  'Services designed for real homes.',

  contact_heading:     "Let's create something exceptional.",
  contact_subheading:  'Tell me a little about your home and what you\'re trying to achieve. Initial consultations are always free and unhurried.',
  contact_email:       'husni@husnimarikkar.co.uk',
  contact_phone:       '+44 7466 554153',
  contact_based:       'London, United Kingdom',
  contact_serving:     'Greater London & Home Counties',
  contact_availability:'Currently accepting new projects',
  whatsapp_number:     '447466554153',
  linkedin_url:        '#',
  behance_url:         '#',
  footer_copyright:    '© 2025 Husni Marikkar Architects. All rights reserved.',
  seo_title:       'Husni Marikkar Architects | Residential Architecture & Interior Design London',
  seo_description: 'London-based architect offering bespoke home renovation, interior design and new build architecture. University of Westminster graduate. Free initial consultation.',
  seo_keywords:    'architect London, residential interior design UK, home renovation architect',
  ga_tracking_id:  ''
};

const DEFAULT_PROJECTS = [
  { id:1, title:'Ansell HR & Finance',           type:'Commercial Interior · Adaptive Reuse', year:'2023', location:'Seeduwa, Sri Lanka',  image_url:'images/p1_ansell.jpg', category:'commercial', sort_order:1, visible:true },
  { id:2, title:"J'Pura Engineering Faculty",     type:'Institutional Extension',              year:'2023', location:'Sri Lanka',           image_url:'images/p2_jpura.jpg',  category:'civic',       sort_order:2, visible:true },
  { id:3, title:'Nova Apartments',                type:'Residential Interior Design',          year:'2024', location:'Sri Lanka',           image_url:'images/p3_nova.jpg',   category:'residential', sort_order:3, visible:true },
  { id:4, title:'Kandy Multimodal Terminal',      type:'Civic Infrastructure',                 year:'2020', location:'Kandy, Sri Lanka',    image_url:'images/p4_kmtt.jpg',   category:'civic',       sort_order:4, visible:true }
];

const DEFAULT_SERVICES = [
  { id:1, name:'Home Renovation',       description:"Bespoke refurbishment of period and contemporary homes — seamlessly blending commission and full fit-out. I manage the entire process from design through planning to construction oversight.",                            icon:'home',     sort_order:1, visible:true },
  { id:2, name:'New Build Design',      description:'Bespoke architectural design for new homes, from initial sketch through planning to detailed construction drawings. The design process begins with understanding the site, the planning context and how you want to live.',  icon:'building', sort_order:2, visible:true },
  { id:3, name:'3D BIM Visualisation', description:'Photorealistic BIM models so you can walk through your home before a single brick is laid. Built in Revit — explore material choices and lighting conditions before committing.',                                          icon:'screen',   sort_order:3, visible:true },
  { id:4, name:'Space Planning',        description:'Layout strategy that makes every room feel larger, lighter and more aligned with how you actually live. I specialise in finding the hidden potential in existing floor plans.',                                              icon:'grid',     sort_order:4, visible:true },
  { id:5, name:'Interior Design',       description:'Material palettes, furniture specification and lighting design — crafted to your taste and budget. From concept boards to bespoke joinery details, every element considered and complete.',                                  icon:'interior', sort_order:5, visible:true },
  { id:6, name:'Planning & Approvals', description:'Full planning application management — from pre-app advice through to decision and beyond. I know what planners respond to and how to present proposals persuasively.',                                                      icon:'document', sort_order:6, visible:true }
];

// ─── IN-MEMORY CACHE ─────────────────────────────────────────────────────
const _cache = {
  content:  { ...DEFAULT_CONTENT  },
  projects: [ ...DEFAULT_PROJECTS ],
  services: [ ...DEFAULT_SERVICES ],
  settings: { section_about:'true', section_projects:'true', section_services:'true', section_contact:'true' },
  loaded:   false
};

// ─── HTTP HELPERS ──────────────────────────────────────────────────────────
function _headers(extra = {}) {
  return { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', ...extra };
}
function _fetch(url, opts = {}, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(t));
}
async function _get(table, params = '') {
  try {
    const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { headers: _headers() });
    if (!r.ok) return [];
    return await r.json();
  } catch(e) { return []; }
}

// ─── CENTRALIZED FETCH ─────────────────────────────────────────────────────
// Single function. One network round-trip (4 parallel queries).
// Returns cache immediately with defaults; merges DB data on top.
async function fetchContent(forceRefresh = false) {
  if (_cache.loaded && !forceRefresh) return _cache;

  try {
    const [cRows, pRows, sRows, stRows] = await Promise.all([
      _get('site_content',  'select=key,value'),
      _get('projects',      'select=*&visible=eq.true&order=sort_order.asc'),
      _get('services',      'select=*&visible=eq.true&order=sort_order.asc'),
      _get('site_settings', 'select=key,value')
    ]);

    // Merge DB values on top of defaults (DB wins, defaults fill gaps)
    if (cRows.length)  { cRows.forEach(r  => { _cache.content[r.key]  = r.value; }); }
    if (pRows.length)  { _cache.projects = pRows; }
    if (sRows.length)  { _cache.services = sRows; }
    if (stRows.length) { stRows.forEach(r => { _cache.settings[r.key] = r.value; }); }

    _cache.loaded = true;
    console.log(`[fetchContent] ✅ content:${cRows.length} projects:${pRows.length} services:${sRows.length}`);
  } catch(e) {
    console.warn('[fetchContent] DB unavailable, using defaults:', e.message);
    _cache.loaded = true; // prevent infinite retries
  }

  return _cache;
}

// ─── RENDER ALL ────────────────────────────────────────────────────────────
function renderAll(cache) {
  _applyDataContent(cache.content);
  _renderProjects(cache.projects, cache.content);
  _renderServices(cache.services, cache.content);
  _renderImages(cache.content);
  _renderLinks(cache.content);
  _renderSEO(cache.content);
  _renderVisibility(cache.settings);
  _renderGA(cache.content);
}

function renderSection(section, cache) {
  switch (section) {
    case 'hero':     _applyDataContentPrefix('hero_', cache.content); _renderImages(cache.content); break;
    case 'about':    _applyDataContentPrefix('about_', cache.content); _applyDataContentPrefix('stat', cache.content); _renderImages(cache.content); break;
    case 'projects': _renderProjects(cache.projects, cache.content); break;
    case 'services': _renderServices(cache.services, cache.content); break;
    case 'contact':  _applyDataContentPrefix('contact_', cache.content); _renderLinks(cache.content); break;
    case 'seo':      _renderSEO(cache.content); break;
  }
}

// ─── PRIVATE RENDERERS ─────────────────────────────────────────────────────

function _applyDataContent(content) {
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = content[el.getAttribute('data-content')];
    if (val === undefined) return;
    if (el.tagName === 'META')  { el.setAttribute('content', val); return; }
    if (el.tagName === 'TITLE') { document.title = val; return; }
    if (el.tagName === 'A')     { el.textContent = val; return; }
    el.innerHTML = val;
  });
}

function _applyDataContentPrefix(prefix, content) {
  document.querySelectorAll(`[data-content^="${prefix}"]`).forEach(el => {
    const val = content[el.getAttribute('data-content')];
    if (val === undefined) return;
    if (el.tagName === 'A') el.textContent = val;
    else el.innerHTML = val;
  });
}

function _renderProjects(projects, content) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const items = (projects || []).filter(p => p.visible !== false).slice(0, 4);
  if (!items.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:48px;text-align:center;color:rgba(255,255,255,.4)">No projects yet.</div>';
    return;
  }
  grid.innerHTML = items.map((p, i) => `
    <div class="project-card" onclick="location.href='projects.html'" role="link" tabindex="0">
      <img src="${p.image_url || ''}" alt="${p.title}" loading="lazy"
        onerror="this.style.opacity='0'"/>
      <div class="project-overlay"></div>
      <div class="project-num">0${i+1}/0${items.length}</div>
      <div class="project-info">
        <div class="project-name">${p.title}</div>
        <div class="project-type">${p.type || ''}</div>
      </div>
    </div>`).join('');
}

function _renderServices(services, content) {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  const ICONS = {
    home:     `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M5 22V10l9-7 9 7v12"/><path d="M10 22v-6h8v6"/></svg>`,
    building: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M4 24L14 4l10 20"/><path d="M8 18h12"/></svg>`,
    screen:   `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="4" y="4" width="20" height="16" rx="1"/><path d="M10 20v4M18 20v4M7 24h14"/></svg>`,
    grid:     `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="3" y="3" width="22" height="22" rx="1"/><path d="M3 10h22M10 10v15"/></svg>`,
    interior: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="3" y="8" width="22" height="17" rx="1"/><path d="M8 8V5a6 6 0 0 1 12 0v3"/><path d="M3 13h22"/></svg>`,
    document: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M14 3l11 9H3z"/><path d="M6 12v10M22 12v10M3 22h22"/></svg>`,
    default:  `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><circle cx="14" cy="14" r="10"/><path d="M14 9v5l3 3"/></svg>`
  };
  const items = (services || []).filter(s => s.visible !== false);
  grid.innerHTML = items.map(s => `
    <div class="service-tile">
      ${ICONS[s.icon] || ICONS.default}
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.description || ''}</div>
    </div>`).join('');
}

function _renderImages(content) {
  const h = document.getElementById('heroImg');
  const a = document.getElementById('aboutImg');
  if (h && content['hero_image'])  { h.src = content['hero_image'];  h.onerror = () => { h.style.opacity='0'; }; }
  if (a && content['about_image']) { a.src = content['about_image']; a.onerror = () => { a.style.opacity='0'; }; }
}

function _renderLinks(content) {
  const email = content['contact_email'];
  const el = document.getElementById('emailLink');
  if (el && email) { el.href = 'mailto:' + email; el.textContent = email; }
  if (content['whatsapp_number']) {
    const url = `https://wa.me/${content['whatsapp_number']}?text=Hi%20Husni%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you.`;
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = url);
  }
  const li = document.getElementById('linkedinLink');
  const be = document.getElementById('behanceLink');
  if (li && content['linkedin_url'] && content['linkedin_url'] !== '#') { li.href = content['linkedin_url']; li.style.display = ''; }
  if (be && content['behance_url'] && content['behance_url'] !== '#')   { be.href = content['behance_url']; be.style.display = ''; }
}

function _renderSEO(content) {
  if (content['seo_title']) document.title = content['seo_title'];
  const m = document.querySelector('meta[name="description"]');
  if (m && content['seo_description']) m.content = content['seo_description'];
}

function _renderVisibility(settings) {
  ['about','projects','services','contact'].forEach(s => {
    const el = document.getElementById('section-' + s);
    if (el) el.style.display = settings['section_' + s] === 'false' ? 'none' : '';
  });
}

function _renderGA(content) {
  const id = content['ga_tracking_id'];
  if (!id || !id.startsWith('G-') || window._gaLoaded) return;
  window._gaLoaded = true;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.async = true; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date()); gtag('config', id);
}

// ─── DB OPS ────────────────────────────────────────────────────────────────
const db = {
  get: _get,

  async insert(table, data) {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}`, {
        method:'POST', headers:_headers({'Prefer':'return=minimal'}), body:JSON.stringify(data)
      });
      if (!r.ok) console.warn(`INSERT ${table} ${r.status}`);
      return r.ok;
    } catch(e) { console.error(`INSERT ${table}:`, e.message); return false; }
  },

  async update(table, id, data, idCol = 'id') {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method:'PATCH', headers:_headers({'Prefer':'return=minimal'}), body:JSON.stringify(data)
      });
      if (!r.ok) console.warn(`UPDATE ${table} ${r.status}`);
      return r.ok;
    } catch(e) { console.error(`UPDATE ${table}:`, e.message); return false; }
  },

  async delete(table, id, idCol = 'id') {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method:'DELETE', headers:_headers()
      });
      if (!r.ok) console.warn(`DELETE ${table} ${r.status}`);
      return r.ok;
    } catch(e) { console.error(`DELETE ${table}:`, e.message); return false; }
  },

  async upsertBatch(table, rows, onConflict = 'key') {
    if (!rows?.length) return true;
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
        method:'POST',
        headers:_headers({'Prefer':'resolution=merge-duplicates,return=minimal'}),
        body:JSON.stringify(rows)
      });
      if (!r.ok) {
        let txt = '';
        try { txt = await Promise.race([r.text(), new Promise((_,rj)=>setTimeout(()=>rj(),2000))]); } catch(_){}
        console.warn(`UPSERT ${table} ${r.status}`, txt);
      }
      return r.ok;
    } catch(e) {
      console.error(`UPSERT ${table}:`, e.name === 'AbortError' ? 'timeout' : e.message);
      return false;
    }
  },

  upsert(table, data, onConflict='key') { return this.upsertBatch(table, [data], onConflict); },

  async uploadImage(bucket, path, file) {
    try {
      const r = await _fetch(`${SUPA_URL}/storage/v1/object/${bucket}/${path}`, {
        method:'POST',
        headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':file.type,'x-upsert':'true'},
        body:file
      }, 30000);
      if (!r.ok) { console.warn(`Upload ${path} ${r.status}`); return null; }
      return `${SUPA_URL}/storage/v1/object/public/${bucket}/${path}`;
    } catch(e) { console.error('Upload:', e.message); return null; }
  }
};

// ─── ENQUIRY ───────────────────────────────────────────────────────────────
async function submitEnquiry(data) {
  const ok = await db.insert('enquiries', data);
  if (!ok) {
    try {
      const local = JSON.parse(localStorage.getItem('husni_enquiries') || '[]');
      local.unshift({...data, id:Date.now(), created_at:new Date().toISOString()});
      localStorage.setItem('husni_enquiries', JSON.stringify(local));
    } catch(_) {}
  }
  return ok;
}

// ─── PUBLIC API ────────────────────────────────────────────────────────────
async function loadSiteContent() {
  const cache = await fetchContent();
  renderAll(cache);
  return cache.content;
}

window.db             = db;
window.fetchContent   = fetchContent;
window.renderAll      = renderAll;
window.renderSection  = renderSection;
window.loadSiteContent= loadSiteContent;
window.submitEnquiry  = submitEnquiry;
