// ============================================
// Supabase Client — Husni Marikkar Architects
// ============================================
const SUPA_URL = 'https://nthbgkuiusppwlpejtss.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGJna3VpdXNwcHdscGVqdHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjg5NTAsImV4cCI6MjA4Mjc0NDk1MH0.m0w7Jme2y_D3jxbnjhrWkwBYErdYEnnKHaCgAwhIlXM';
const TIMEOUT_MS = 8000;

// Fetch with timeout - prevents "Saving... forever" 
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

const db = {
  headers() {
    return {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY,
      'Content-Type': 'application/json'
    };
  },

  // READ
  async get(table, params = '') {
    try {
      const r = await fetchWithTimeout(
        `${SUPA_URL}/rest/v1/${table}?${params}`,
        { headers: this.headers() }
      );
      if (!r.ok) {
        console.warn(`GET ${table} failed: ${r.status}`);
        return [];
      }
      return await r.json();
    } catch(e) {
      console.error(`GET ${table} error:`, e.message);
      return [];
    }
  },

  // INSERT single row
  async insert(table, data) {
    try {
      const r = await fetchWithTimeout(
        `${SUPA_URL}/rest/v1/${table}`,
        {
          method: 'POST',
          headers: { ...this.headers(), 'Prefer': 'return=minimal' },
          body: JSON.stringify(data)
        }
      );
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.warn(`INSERT ${table} failed: ${r.status}`, txt);
      }
      return r.ok;
    } catch(e) {
      console.error(`INSERT ${table} error:`, e.message);
      return false;
    }
  },

  // UPDATE by id
  async update(table, id, data, idCol = 'id') {
    try {
      const r = await fetchWithTimeout(
        `${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`,
        {
          method: 'PATCH',
          headers: { ...this.headers(), 'Prefer': 'return=minimal' },
          body: JSON.stringify(data)
        }
      );
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.warn(`UPDATE ${table} failed: ${r.status}`, txt);
      }
      return r.ok;
    } catch(e) {
      console.error(`UPDATE ${table} error:`, e.message);
      return false;
    }
  },

  // DELETE by id
  async delete(table, id, idCol = 'id') {
    try {
      const r = await fetchWithTimeout(
        `${SUPA_URL}/rest/v1/${table}?${idCol}=eq.${id}`,
        { method: 'DELETE', headers: this.headers() }
      );
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.warn(`DELETE ${table} failed: ${r.status}`, txt);
      }
      return r.ok;
    } catch(e) {
      console.error(`DELETE ${table} error:`, e.message);
      return false;
    }
  },

  // UPSERT single row
  async upsert(table, data, onConflict = 'key') {
    return this.upsertBatch(table, [data], onConflict);
  },

  // UPSERT multiple rows in one request
  async upsertBatch(table, rows, onConflict = 'key') {
    if (!rows || !rows.length) return true;
    try {
      const r = await fetchWithTimeout(
        `${SUPA_URL}/rest/v1/${table}?on_conflict=${onConflict}`,
        {
          method: 'POST',
          headers: {
            ...this.headers(),
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(rows)
        }
      );
      if (!r.ok) {
        // Safely read error text without hanging
        let txt = '';
        try { txt = await Promise.race([r.text(), new Promise((_,rj)=>setTimeout(()=>rj('timeout'),2000))]); } catch(_){}
        console.warn(`UPSERT ${table} failed: ${r.status}`, txt);
        return false;
      }
      return true;
    } catch(e) {
      if (e.name === 'AbortError') {
        console.error(`UPSERT ${table} timed out after ${TIMEOUT_MS}ms`);
      } else {
        console.error(`UPSERT ${table} error:`, e.message);
      }
      return false;
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(bucket, path, file) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 30000); // 30s for uploads
      const r = await fetch(
        `${SUPA_URL}/storage/v1/object/${bucket}/${path}`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPA_KEY,
            'Authorization': 'Bearer ' + SUPA_KEY,
            'Content-Type': file.type,
            'x-upsert': 'true'
          },
          body: file,
          signal: controller.signal
        }
      ).finally(() => clearTimeout(id));
      if (!r.ok) {
        let txt = '';
        try { txt = await r.text(); } catch(_){}
        console.warn(`Upload to ${bucket}/${path} failed: ${r.status}`, txt);
        return null;
      }
      return `${SUPA_URL}/storage/v1/object/public/${bucket}/${path}`;
    } catch(e) {
      console.error('Upload error:', e.message);
      return null;
    }
  }
};

// ============================================
// Load all content from Supabase → apply to page
// ============================================
async function loadSiteContent() {
  const rows = await db.get('site_content', 'select=key,value');
  if (!rows.length) return {};

  const content = {};
  rows.forEach(r => { content[r.key] = r.value; });

  // Apply [data-content] attributes
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = content[el.getAttribute('data-content')];
    if (val === undefined) return;
    if (el.tagName === 'META') { el.setAttribute('content', val); return; }
    if (el.tagName === 'TITLE') { document.title = val; return; }
    el.innerHTML = val;
  });

  // Images
  if (content['hero_image']) {
    const img = document.getElementById('heroImg');
    if (img) img.src = content['hero_image'];
  }
  if (content['about_image']) {
    const img = document.getElementById('aboutImg');
    if (img) img.src = content['about_image'];
  }

  // Email link
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

  // SEO
  if (content['seo_title']) document.title = content['seo_title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && content['seo_description']) metaDesc.content = content['seo_description'];

  return content;
}

// ============================================
// Submit enquiry
// ============================================
async function submitEnquiry(data) {
  const ok = await db.insert('enquiries', data);
  if (!ok) {
    // Fallback: localStorage
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
