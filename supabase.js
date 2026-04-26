// Supabase client - shared across all pages
const SUPA_URL = 'https://nthbgkuiusppwlpejtss.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGJna3VpdXNwcHdscGVqdHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjg5NTAsImV4cCI6MjA4Mjc0NDk1MH0.m0w7Jme2y_D3jxbnjhrWkwBYErdYEnnKHaCgAwhIlXM';

const db = {
  headers: {
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + SUPA_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },

  async get(table, params = '') {
    try {
      const r = await fetch(SUPA_URL + '/rest/v1/' + table + '?' + params, { headers: this.headers });
      if (!r.ok) return [];
      return await r.json();
    } catch(e) { return []; }
  },

  async insert(table, data) {
    try {
      const r = await fetch(SUPA_URL + '/rest/v1/' + table, {
        method: 'POST', headers: this.headers, body: JSON.stringify(data)
      });
      return r.ok;
    } catch(e) { return false; }
  },

  async update(table, id, data, idCol = 'id') {
    try {
      const r = await fetch(SUPA_URL + '/rest/v1/' + table + '?' + idCol + '=eq.' + id, {
        method: 'PATCH', headers: {...this.headers, 'Prefer': 'return=minimal'}, body: JSON.stringify(data)
      });
      return r.ok;
    } catch(e) { return false; }
  },

  async upsert(table, data, onConflict = 'id') {
    try {
      const r = await fetch(SUPA_URL + '/rest/v1/' + table + '?on_conflict=' + onConflict, {
        method: 'POST', headers: {...this.headers, 'Prefer': 'resolution=merge-duplicates'}, body: JSON.stringify(data)
      });
      return r.ok;
    } catch(e) { return false; }
  },

  async delete(table, id, idCol = 'id') {
    try {
      const r = await fetch(SUPA_URL + '/rest/v1/' + table + '?' + idCol + '=eq.' + id, {
        method: 'DELETE', headers: this.headers
      });
      return r.ok;
    } catch(e) { return false; }
  },

  // Upload image to Supabase Storage
  async uploadImage(bucket, path, file) {
    try {
      const r = await fetch(SUPA_URL + '/storage/v1/object/' + bucket + '/' + path, {
        method: 'POST',
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': file.type },
        body: file
      });
      if (!r.ok) return null;
      return SUPA_URL + '/storage/v1/object/public/' + bucket + '/' + path;
    } catch(e) { return null; }
  }
};

// Load site content and apply to page
async function loadSiteContent() {
  const rows = await db.get('site_content', 'select=key,value');
  const content = {};
  rows.forEach(r => content[r.key] = r.value);
  // Apply to all data-content elements
  document.querySelectorAll('[data-content]').forEach(el => {
    const key = el.getAttribute('data-content');
    if (content[key] !== undefined) el.innerHTML = content[key];
  });
  return content;
}

// Submit enquiry to Supabase
async function submitEnquiry(data) {
  const ok = await db.insert('enquiries', data);
  if (!ok) {
    // Fallback to localStorage if Supabase fails
    const local = JSON.parse(localStorage.getItem('husni_enquiries') || '[]');
    local.unshift({...data, id: Date.now(), created_at: new Date().toISOString()});
    localStorage.setItem('husni_enquiries', JSON.stringify(local));
  }
  return ok;
}

window.db = db;
window.loadSiteContent = loadSiteContent;
window.submitEnquiry = submitEnquiry;
