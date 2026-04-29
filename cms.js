// ============================================
// Husni Marikkar Architects — CMS
// Reads from content.json (same domain, no DNS)
// Writes back via GitHub API on admin save
// ============================================

const GITHUB_OWNER = 'yoosuf0806';
const GITHUB_REPO  = 'Husniwebsite';
const GITHUB_FILE  = 'content.json';
const GITHUB_TOKEN = localStorage.getItem('hma_gh_token') || '';
const CONTENT_URL  = '/content.json';

// ─── IN-MEMORY STORE ─────────────────────────────────────────────────────
let _data = null;        // full parsed content.json
let _sha  = null;        // GitHub blob SHA needed for updates
let _loaded = false;

// ─── LOAD ────────────────────────────────────────────────────────────────
// Fetches /content.json from same origin — works on any network, no DNS issues
async function loadContent() {
  if (_loaded) return _data;
  try {
    const r = await fetch(CONTENT_URL + '?v=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    _data   = await r.json();
    _loaded = true;
    console.log('[CMS] Loaded content.json');
  } catch(e) {
    console.error('[CMS] Failed to load content.json:', e.message);
    _data = { site: {}, projects: [], services: [], enquiries: [] };
  }
  return _data;
}

// ─── RENDER ──────────────────────────────────────────────────────────────
function renderAll(data) {
  if (!data) return;
  _applyText(data.site);
  _renderProjects(data.projects || []);
  _renderServices(data.services || []);
  _renderImages(data.site);
  _renderLinks(data.site);
  _renderSEO(data.site);
  _renderGA(data.site);
}

function _applyText(site) {
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = site[el.getAttribute('data-content')];
    if (val === undefined) return;
    if (el.tagName === 'META')  { el.setAttribute('content', val); return; }
    if (el.tagName === 'TITLE') { document.title = val; return; }
    if (el.tagName === 'A')     { el.textContent = val; return; }
    el.innerHTML = val;
  });
}

function _renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  const featuredEl = document.getElementById('featuredProject');
  if (!grid) return;
  const visible = projects.filter(p => p.visible !== false);
  if (!visible.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:48px;text-align:center;color:rgba(255,255,255,.4)">No projects yet.</div>';
    if (featuredEl) featuredEl.innerHTML = '';
    return;
  }
  const featured = visible.find(p => p.featured) || visible[0];
  if (featuredEl) {
    featuredEl.innerHTML = `
      <div class="featured-project">
        <div class="fp-image">
          <img src="${featured.image_url||''}" alt="${featured.title}" loading="lazy" onerror="this.style.opacity='0'"/>
          <div class="fp-badge">Featured Project</div>
        </div>
        <div class="fp-info">
          <div class="fp-label">${featured.category||'Architecture'} · ${featured.year||''}</div>
          <h3 class="fp-title">${featured.title}</h3>
          <p class="fp-desc">${(featured.description||'').slice(0,180)}${(featured.description||'').length>180?'…':''}</p>
          <div class="fp-meta">
            ${featured.client?`<div class="fp-meta-item"><label>Client</label><span>${featured.client}</span></div>`:''}
            ${featured.consultant?`<div class="fp-meta-item"><label>Architect</label><span>${featured.consultant}</span></div>`:''}
            ${featured.area?`<div class="fp-meta-item"><label>Area</label><span>${featured.area}</span></div>`:''}
            ${featured.role?`<div class="fp-meta-item"><label>Funded by</label><span>${featured.role}</span></div>`:''}
          </div>
          <a href="projects.html" class="fp-cta">View all projects →</a>
        </div>
      </div>`;
  }
  const rest = visible.filter(p => p.id !== featured.id).slice(0,3);
  grid.innerHTML = rest.map((p,i) => `
    <div class="project-card" onclick="location.href='projects.html'" role="link" tabindex="0">
      <img src="${p.image_url||''}" alt="${p.title}" loading="lazy" onerror="this.style.opacity='0'"/>
      <div class="project-overlay"></div>
      <div class="project-num">0${i+1}/0${rest.length}</div>
      <div class="project-info">
        <div class="project-name">${p.title}</div>
        <div class="project-type">${p.type||''}</div>
      </div>
    </div>`).join('');
}


function _renderServices(services) {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  const ICONS = {
    home:     `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 22V10l9-7 9 7v12"/><path d="M10 22v-6h8v6"/></svg>`,
    building: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 24L14 4l10 20"/><path d="M8 18h12"/></svg>`,
    screen:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="20" height="16" rx="1"/><path d="M10 20v4M18 20v4M7 24h14"/></svg>`,
    grid:     `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="22" height="22" rx="1"/><path d="M3 10h22M10 10v15"/></svg>`,
    interior: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="22" height="17" rx="1"/><path d="M8 8V5a6 6 0 0 1 12 0v3"/><path d="M3 13h22"/></svg>`,
    document: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 3l11 9H3z"/><path d="M6 12v10M22 12v10M3 22h22"/></svg>`,
    default:  `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="14" cy="14" r="10"/><path d="M14 9v5l3 3"/></svg>`
  };
  const visible = services.filter(s => s.visible !== false);
  grid.innerHTML = visible.map((s, i) => `
    <div class="svc-card">
      <div class="svc-num">${String(i+1).padStart(2,'0')}</div>
      <div class="svc-icon-wrap">${ICONS[s.icon] || ICONS.default}</div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-desc">${s.description || ''}</div>
      <a href="services.html" class="svc-link">Learn more →</a>
    </div>`).join('');
}


function _renderGA(site) {
  if (!site.ga_tracking_id || !site.ga_tracking_id.startsWith('G-') || window._gaLoaded) return;
  window._gaLoaded = true;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${site.ga_tracking_id}`;
  s.async = true; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date()); gtag('config', site.ga_tracking_id);
}

// ─── GITHUB WRITE ─────────────────────────────────────────────────────────
// Gets current SHA then PUTs updated content.json
async function saveToGitHub(newData) {
  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
  const headers = {
    'Authorization': 'token ' + GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  // Step 1: Get current SHA
  try {
    const meta = await fetch(apiBase, { headers });
    if (meta.ok) {
      const m = await meta.json();
      _sha = m.sha;
    }
  } catch(e) {
    console.warn('[CMS] Could not fetch SHA:', e.message);
  }

  // Step 2: Update file
  newData.meta = { lastUpdated: new Date().toISOString(), version: (_data?.meta?.version || 0) + 1 };
  const body = {
    message: 'CMS update: ' + new Date().toISOString().slice(0,16).replace('T',' '),
    content: btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2)))),
    sha: _sha
  };

  const r = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`GitHub API ${r.status}: ${err.message || 'unknown error'}`);
  }
  _data = newData;
  return true;
}

// ─── ENQUIRY (localStorage — no DB needed) ────────────────────────────────
function saveEnquiry(data) {
  try {
    const list = JSON.parse(localStorage.getItem('husni_enquiries') || '[]');
    list.unshift({ ...data, id: Date.now(), read: false, created_at: new Date().toISOString() });
    localStorage.setItem('husni_enquiries', JSON.stringify(list));
    return true;
  } catch(e) { return false; }
}

function getEnquiries() {
  try { return JSON.parse(localStorage.getItem('husni_enquiries') || '[]'); }
  catch(e) { return []; }
}

function markEnquiryRead(id) {
  const list = getEnquiries().map(e => e.id === id ? { ...e, read: true } : e);
  localStorage.setItem('husni_enquiries', JSON.stringify(list));
}

function deleteEnquiry(id) {
  const list = getEnquiries().filter(e => e.id !== id);
  localStorage.setItem('husni_enquiries', JSON.stringify(list));
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────
window.CMS = { loadContent, renderAll, saveToGitHub, saveEnquiry, getEnquiries, markEnquiryRead, deleteEnquiry };
