// ============================================
// Supabase Client — Husni Marikkar Architects
// ============================================
const SUPA_URL = 'https://nthbgkuiusppwlpejtss.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGJna3VpdXNwcHdscGVqdHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjg5NTAsImV4cCI6MjA4Mjc0NDk1MH0.m0w7Jme2y_D3jxbnjhrWkwBYErdYEnnKHaCgAwhIlXM';

const db = {
  _h(extra = {}) {
    return {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY,
      'Content-Type': 'application/json',
      ...extra
    };
  },

  async get(table, params = '') {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { headers: this._h() });
      if (!r.ok) { console.warn('DB GET failed', table, r.status, await r.text()); return []; }
      return await r.json();
    } catch(e) { console.error('DB GET error', table, e); return []; }
  },

  async insert(table, data) {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: this._h({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify(data)
      });
      if (!r.ok) { console.warn('DB INSERT failed', table, r.status, await r.text()); }
      return r.ok;
    } catch(e) { console.error('DB INSERT error', table, e); return false; }
  },

  async update(table, id, data, idCol = 'id') {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method: 'PATCH',
        headers: this._h({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify(data)
      });
      if (!r.ok) { console.warn('DB UPDATE failed', table, r.status, await r.text()); }
      return r.ok;
    } catch(e) { console.error('DB UPDATE error', table, e); return false; }
  },

  // Batch upsert — sends ALL rows in one request
  async upsertBatch(table, rows, onConflict = 'key') {
    if (!rows || !rows.length) return true;
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
        method: 'POST',
        headers: this._h({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify(rows)
      });
      if (!r.ok) {
        const txt = await r.text();
        console.warn('DB UPSERT failed', table, r.status, txt);
        return false;
      }
      return true;
    } catch(e) { console.error('DB UPSERT error', table, e); return false; }
  },

  // Single upsert
  async upsert(table, data, onConflict = 'key') {
    return this.upsertBatch(table, [data], onConflict);
  },

  async delete(table, id, idCol = 'id') {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
        method: 'DELETE',
        headers: this._h()
      });
      if (!r.ok) { console.warn('DB DELETE failed', table, r.status, await r.text()); }
      return r.ok;
    } catch(e) { console.error('DB DELETE error', table, e); return false; }
  },

  async uploadImage(bucket, path, file) {
    try {
      const r = await fetch(`${SUPA_URL}/storage/v1/object/${bucket}/${path}`, {
        method: 'POST',
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': file.type, 'x-upsert': 'true' },
        body: file
      });
      if (!r.ok) { console.warn('Upload failed', r.status, await r.text()); return null; }
      return `${SUPA_URL}/storage/v1/object/public/${bucket}/${path}`;
    } catch(e) { console.error('Upload error', e); return null; }
  }
};

// =============================================
// Load all site content from Supabase and apply
// =============================================
async function loadSiteContent() {
  const rows = await db.get('site_content', 'select=key,value');
  if (!rows.length) return {};

  const content = {};
  rows.forEach(r => { content[r.key] = r.value; });

  // Apply to all [data-content] elements
  document.querySelectorAll('[data-content]').forEach(el => {
    const key = el.getAttribute('data-content');
    const val = content[key];
    if (val === undefined) return;
    // Special handling per tag
    if (el.tagName === 'META') { el.setAttribute('content', val); return; }
    if (el.tagName === 'TITLE') { document.title = val; return; }
    if (el.tagName === 'A') { el.textContent = val; return; }
    el.innerHTML = val;
  });

  // Hero image
  if (content['hero_image']) {
    const img = document.getElementById('heroImg');
    if (img) img.src = content['hero_image'];
  }
  // About image
  if (content['about_image']) {
    const img = document.getElementById('aboutImg');
    if (img) img.src = content['about_image'];
  }
  // Email link href
  const emailLink = document.getElementById('emailLink');
  if (emailLink && content['contact_email']) {
    emailLink.href = 'mailto:' + content['contact_email'];
    emailLink.textContent = content['contact_email'];
  }
  // WhatsApp links
  if (content['whatsapp_number']) {
    const waUrl = `https://wa.me/${content['whatsapp_number']}?text=Hi%20Husni%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you.`;
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = waUrl);
  }
  // Social links
  const li = document.getElementById('linkedinLink');
  const be = document.getElementById('behanceLink');
  if (li && content['linkedin_url'] && content['linkedin_url'] !== '#') { li.href = content['linkedin_url']; li.style.display = ''; }
  if (be && content['behance_url'] && content['behance_url'] !== '#') { be.href = content['behance_url']; be.style.display = ''; }

  // Google Analytics
  if (content['ga_tracking_id'] && content['ga_tracking_id'].startsWith('G-') && !window._gaLoaded) {
    window._gaLoaded = true;
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${content['ga_tracking_id']}`;
    s.async = true; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date()); gtag('config', content['ga_tracking_id']);
  }

  return content;
}

// =============================================
// Submit enquiry to Supabase
// =============================================
async function submitEnquiry(data) {
  const ok = await db.insert('enquiries', data);
  if (!ok) {
    // Fallback: save to localStorage
    try {
      const local = JSON.parse(localStorage.getItem('husni_enquiries') || '[]');
      local.unshift({ ...data, id: Date.now(), created_at: new Date().toISOString() });
      localStorage.setItem('husni_enquiries', JSON.stringify(local));
    } catch(e) {}
  }
  return ok;
}

window.db = db;
window.loadSiteContent = loadSiteContent;
window.submitEnquiry = submitEnquiry;
