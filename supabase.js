// ============================================
// Husni Marikkar Architects — Data Layer
// Single source of truth for all DB operations
// ============================================

const SUPA_URL = 'https://nthbgkuiusppwlpejtss.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGJna3VpdXNwcHdscGVqdHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjg5NTAsImV4cCI6MjA4Mjc0NDk1MH0.m0w7Jme2y_D3jxbnjhrWkwBYErdYEnnKHaCgAwhIlXM';

// ─── IN-MEMORY CACHE ─────────────────────────────────────────────────────
// Single cache object. Each section reads only its own slice.
// About changes never re-render Services and vice versa.
const _cache = {
  content:  {},   // key→value from site_content table
  projects: [],   // rows from projects table
  services: [],   // rows from services table
  settings: {},   // key→value from site_settings table
  loaded:   false // true after first successful fetchContent()
};

// ─── HTTP HELPERS ─────────────────────────────────────────────────────────
function _headers(extra = {}) {
  return {
    'apikey':        SUPA_KEY,
    'Authorization': 'Bearer ' + SUPA_KEY,
    'Content-Type':  'application/json',
    ...extra
  };
}

function _fetch(url, opts = {}, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...opts, signal: ctrl.signal })
    .finally(() => clearTimeout(tid));
}

// ─── CENTRALIZED FETCH ────────────────────────────────────────────────────
// ONE function, ONE call per page load. Fetches all four tables in parallel.
// Returns the populated cache. Subsequent calls return the cached version
// unless forceRefresh = true.
async function fetchContent(forceRefresh = false) {
  if (_cache.loaded && !forceRefresh) return _cache;

  try {
    const [contentRows, projectRows, serviceRows, settingRows] = await Promise.all([
      _get('site_content',  'select=key,value'),
      _get('projects',      'select=*&visible=eq.true&order=sort_order.asc'),
      _get('services',      'select=*&visible=eq.true&order=sort_order.asc'),
      _get('site_settings', 'select=key,value')
    ]);

    // Populate cache — each section's data is isolated in its own namespace
    _cache.content  = Object.fromEntries(contentRows.map(r  => [r.key,   r.value]));
    _cache.projects = projectRows;
    _cache.services = serviceRows;
    _cache.settings = Object.fromEntries(settingRows.map(r  => [r.key,   r.value]));
    _cache.loaded   = true;

    console.log(
      `[fetchContent] ✅ content:${contentRows.length} projects:${projectRows.length}`,
      `services:${serviceRows.length} settings:${settingRows.length}`
    );
  } catch (e) {
    console.error('[fetchContent] ❌ Failed:', e.message);
  }

  return _cache;
}

// ─── SECTION RENDERERS ────────────────────────────────────────────────────
// Each renderer receives only its data slice. Changing About never touches
// the Services DOM and vice versa.

function renderSection(section, cache) {
  switch (section) {
    case 'hero':     return _renderHero(cache.content);
    case 'about':    return _renderAbout(cache.content);
    case 'projects': return _renderProjects(cache.projects, cache.content);
    case 'services': return _renderServices(cache.services, cache.content);
    case 'contact':  return _renderContact(cache.content);
    case 'seo':      return _renderSEO(cache.content);
    default: console.warn('[renderSection] Unknown section:', section);
  }
}

// Render all sections at once (used on page load)
function renderAll(cache) {
  _applyDataContent(cache.content); // batch-apply all [data-content] elements
  _renderProjects(cache.projects, cache.content);
  _renderServices(cache.services, cache.content);
  _renderImages(cache.content);
  _renderLinks(cache.content);
  _renderSEO(cache.content);
  _renderVisibility(cache.settings);
  _renderGA(cache.content);
}

// ─── PRIVATE RENDERERS ────────────────────────────────────────────────────

// Applies all [data-content="key"] elements in one DOM pass
function _applyDataContent(content) {
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = content[el.getAttribute('data-content')];
    if (val === undefined || val === null) return;
    if (el.tagName === 'META')  { el.setAttribute('content', val); return; }
    if (el.tagName === 'TITLE') { document.title = val; return; }
    if (el.tagName === 'A')     { el.textContent = val; return; }
    el.innerHTML = val;
  });
}

function _renderHero(content) {
  // Hero-specific: badge, images handled outside data-content
  const badge = document.getElementById('heroImg');
  if (badge && content['hero_image']) badge.src = content['hero_image'];
  // data-content handles all text fields
  _applyDataContentSection('hero_', content);
}

function _renderAbout(content) {
  // About is isolated — only reads about_* and stat*_ keys
  // Services keys are never touched here
  _applyDataContentSection('about_', content);
  _applyDataContentSection('stat',   content);
  _applyDataContentSection('tl',     content);
  _applyDataContentSection('val',    content);
  _applyDataContentSection('cred',   content);
  _applyDataContentSection('cta_',   content);
  const img = document.getElementById('aboutImg');
  if (img && content['about_image']) img.src = content['about_image'];
}

function _renderProjects(projects, content) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  if (!projects.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:48px;text-align:center;color:rgba(255,255,255,.4)">No projects yet.</div>';
    return;
  }
  grid.innerHTML = projects.slice(0, 4).map((p, i) => `
    <div class="project-card" onclick="location.href='projects.html'" role="link" aria-label="${p.title}">
      <img src="${p.image_url || 'images/hero.svg'}" alt="${p.title}" loading="lazy"
        onerror="this.style.display='none'"/>
      <div class="project-overlay"></div>
      <div class="project-num">0${i+1}/0${Math.min(projects.length,4)}</div>
      <div class="project-info">
        <div class="project-name">${p.title}</div>
        <div class="project-type">${p.type || ''}</div>
      </div>
    </div>`).join('');
}

function _renderServices(services, content) {
  // Services is isolated — only reads from services[] array and services_* content keys
  // About keys are never touched here
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  const ICONS = {
    home:     `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M5 22V10l9-7 9 7v12"/><path d="M10 22v-6h8v6"/></svg>`,
    building: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M4 24L14 4l10 20"/><path d="M8 18h12"/></svg>`,
    screen:   `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="4" y="4" width="20" height="16" rx="1"/><path d="M10 20v4M18 20v4M7 24h14"/></svg>`,
    grid:     `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="3" y="3" width="22" height="22" rx="1"/><path d="M3 10h22M10 10v15"/></svg>`,
    interior: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><rect x="3" y="8" width="22" height="17" rx="1"/><path d="M8 8V5a6 6 0 0 1 12 0v3"/><path d="M3 13h22"/></svg>`,
    document: `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><path d="M14 3l11 9H3z"/><path d="M6 12v10M22 12v10M3 22h22"/></svg>`,
    default:  `<svg class="service-icon" viewBox="0 0 28 28" fill="none" stroke="#1B2A4A" stroke-width="1.5"><circle cx="14" cy="14" r="10"/></svg>`
  };
  grid.innerHTML = services.map(s => `
    <div class="service-tile">
      ${ICONS[s.icon] || ICONS.default}
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.description || ''}</div>
    </div>`).join('');
}

function _renderContact(content) {
  // Contact-only: email href, WhatsApp links
  const email = content['contact_email'];
  const el = document.getElementById('emailLink');
  if (el && email) { el.href = 'mailto:' + email; el.textContent = email; }
}

function _renderImages(content) {
  if (content['hero_image']) {
    const img = document.getElementById('heroImg');
    if (img) img.src = content['hero_image'];
  }
  if (content['about_image']) {
    const img = document.getElementById('aboutImg');
    if (img) img.src = content['about_image'];
  }
}

function _renderLinks(content) {
  if (content['whatsapp_number']) {
    const url = `https://wa.me/${content['whatsapp_number']}?text=Hi%20Husni%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you.`;
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = url);
  }
  const li = document.getElementById('linkedinLink');
  const be = document.getElementById('behanceLink');
  if (li && content['linkedin_url'] && content['linkedin_url'] !== '#') { li.href = content['linkedin_url']; li.style.display = ''; }
  if (be && content['behance_url'] && content['behance_url'] !== '#') { be.href = content['behance_url']; be.style.display = ''; }
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
  if (id && id.startsWith('G-') && !window._gaLoaded) {
    window._gaLoaded = true;
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s.async = true; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date()); gtag('config', id);
  }
}

// Apply only keys matching a prefix (section isolation helper)
function _applyDataContentSection(prefix, content) {
  document.querySelectorAll(`[data-content^="${prefix}"]`).forEach(el => {
    const val = content[el.getAttribute('data-content')];
    if (val === undefined) return;
    if (el.tagName === 'A') { el.textContent = val; return; }
    el.innerHTML = val;
  });
}

// ─── LOW-LEVEL DB OPS ────────────────────────────────────────────────────

async function _get(table, params = '') {
  try {
    const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { headers: _headers() });
    if (!r.ok) { console.warn(`GET ${table} ${r.status}`); return []; }
    return await r.json();
  } catch(e) { console.error(`GET ${table}:`, e.message); return []; }
}

const db = {
  get: _get,

  async insert(table, data) {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: _headers({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify(data)
      });
      if (!r.ok) console.warn(`INSERT ${table} ${r.status}`, await r.text().catch(()=>''));
      return r.ok;
    } catch(e) { console.error(`INSERT ${table}:`, e.message); return false; }
  },

  async update(table, id, data, idCol = 'id') {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method: 'PATCH',
        headers: _headers({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify(data)
      });
      if (!r.ok) console.warn(`UPDATE ${table} ${r.status}`, await r.text().catch(()=>''));
      return r.ok;
    } catch(e) { console.error(`UPDATE ${table}:`, e.message); return false; }
  },

  async delete(table, id, idCol = 'id') {
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method: 'DELETE', headers: _headers()
      });
      if (!r.ok) console.warn(`DELETE ${table} ${r.status}`);
      return r.ok;
    } catch(e) { console.error(`DELETE ${table}:`, e.message); return false; }
  },

  async upsertBatch(table, rows, onConflict = 'key') {
    if (!rows?.length) return true;
    try {
      const r = await _fetch(`${SUPA_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
        method: 'POST',
        headers: _headers({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify(rows)
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

  upsert(table, data, onConflict = 'key') {
    return this.upsertBatch(table, [data], onConflict);
  },

  async uploadImage(bucket, path, file) {
    try {
      const r = await _fetch(`${SUPA_URL}/storage/v1/object/${bucket}/${path}`, {
        method: 'POST',
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': file.type, 'x-upsert': 'true' },
        body: file
      }, 30000);
      if (!r.ok) { console.warn(`Upload ${path} ${r.status}`, await r.text().catch(()=>'')); return null; }
      return `${SUPA_URL}/storage/v1/object/public/${bucket}/${path}`;
    } catch(e) { console.error('Upload:', e.message); return null; }
  }
};

// ─── ENQUIRY SUBMIT ───────────────────────────────────────────────────────
async function submitEnquiry(data) {
  const ok = await db.insert('enquiries', data);
  if (!ok) {
    try {
      const local = JSON.parse(localStorage.getItem('husni_enquiries') || '[]');
      local.unshift({ ...data, id: Date.now(), created_at: new Date().toISOString() });
      localStorage.setItem('husni_enquiries', JSON.stringify(local));
    } catch(_) {}
  }
  return ok;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────
// Legacy alias so existing pages calling loadSiteContent() still work
async function loadSiteContent() {
  const cache = await fetchContent();
  renderAll(cache);
  return cache.content;
}

window.db            = db;
window.fetchContent  = fetchContent;
window.renderSection = renderSection;
window.renderAll     = renderAll;
window.loadSiteContent = loadSiteContent;
window.submitEnquiry = submitEnquiry;
