// ═══════════════════════════════════════════
// PARDES ADMIN PANEL
// ═══════════════════════════════════════════

const CONFIG = {
  repo: 'drlevidruin/pardes-website',
  branch: 'main',
  // Token is entered at login and stored in sessionStorage (never committed to repo)
  get token() { return sessionStorage.getItem('pardes_gh_token') || ''; },
};

// Admin credentials: username → SHA-256(password)
const ADMINS = {
  "pardesadmin": "2fa7181a929287457126ac551c90b3a603a6ed00f478bc445e66a7ee569c98ca"
};

// ── State ──
let data = {};
let shas = {};
const panels = ['staff', 'faq', 'testimonials', 'contact', 'homepage'];

// ── Helpers ──
function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'textContent') e.textContent = v;
    else if (k === 'className') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  });
  if (children) {
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    });
  }
  return e;
}

function clear(container) { while (container.firstChild) container.removeChild(container.firstChild); }

function field(label, value, onchange, type) {
  const div = el('div', { className: 'field' });
  div.appendChild(el('label', { textContent: label }));
  if (type === 'textarea') {
    const ta = el('textarea', { value: value || '' });
    ta.textContent = value || '';
    ta.addEventListener('input', () => onchange(ta.value));
    div.appendChild(ta);
  } else {
    const inp = el('input', { type: type || 'text', value: value || '' });
    inp.addEventListener('input', () => onchange(inp.value));
    div.appendChild(inp);
  }
  return div;
}

function checkbox(label, checked, onchange) {
  const div = el('div', { className: 'cb-field' });
  const inp = el('input', { type: 'checkbox' });
  inp.checked = checked;
  inp.addEventListener('change', () => onchange(inp.checked));
  div.appendChild(inp);
  div.appendChild(el('label', { textContent: label }));
  return div;
}

function itemRow(children, onRemove) {
  const row = el('div', { className: 'item-row' });
  const btn = el('button', { className: 'remove-btn', textContent: 'x', onclick: onRemove });
  row.appendChild(btn);
  children.forEach(c => row.appendChild(c));
  return row;
}

// ── Auth ──
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;
  const hash = await sha256(pass);
  const token = document.getElementById('loginToken').value.trim();
  if (ADMINS[user] && ADMINS[user] === hash && token) {
    sessionStorage.setItem('pardes_admin', 'true');
    sessionStorage.setItem('pardes_gh_token', token);
    showAdmin();
  } else {
    const err = document.getElementById('loginError');
    err.style.display = 'block';
    setTimeout(() => { err.style.display = 'none'; }, 3000);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('pardes_admin');
  sessionStorage.removeItem('pardes_gh_token');
  location.reload();
});

document.getElementById('saveBtn').addEventListener('click', saveAll);

function showAdmin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  buildNav();
  loadAllData();
}

if (sessionStorage.getItem('pardes_admin') === 'true') showAdmin();

// ── Nav ──
function buildNav() {
  const nav = document.getElementById('adminNav');
  clear(nav);
  const labels = { staff: 'Staff', faq: 'FAQ', testimonials: 'Testimonials', contact: 'Contact Info', homepage: 'Homepage' };
  panels.forEach((p, i) => {
    const btn = el('button', { textContent: labels[p], 'data-panel': p, className: i === 0 ? 'active' : '' });
    btn.addEventListener('click', () => switchPanel(p));
    nav.appendChild(btn);
  });
}

function switchPanel(name) {
  document.querySelectorAll('.admin-nav button').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-panel') === name);
  });
  renderPanel(name);
}

// ── GitHub API ──
async function fetchFile(path) {
  const res = await fetch(
    'https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path + '?ref=' + CONFIG.branch,
    { headers: { 'Authorization': 'token ' + CONFIG.token, 'Accept': 'application/vnd.github.v3+json' } }
  );
  const json = await res.json();
  shas[path] = json.sha;
  return JSON.parse(atob(json.content));
}

async function saveFile(path, content, message) {
  const body = {
    message: message,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    sha: shas[path],
    branch: CONFIG.branch
  };
  const res = await fetch(
    'https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path,
    {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + CONFIG.token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );
  const json = await res.json();
  if (json.content) shas[path] = json.content.sha;
  return res.ok;
}

async function loadAllData() {
  setStatus('Loading...');
  try {
    data.staff = await fetchFile('data/staff-leadership.json');
    data.faq = await fetchFile('data/faq.json');
    data.testimonials = await fetchFile('data/testimonials.json');
    data.contact = await fetchFile('data/contact.json');
    data.homepage = await fetchFile('data/homepage.json');
    renderPanel('staff');
    setStatus('Loaded', 'ok');
    setTimeout(() => setStatus(''), 2000);
  } catch (err) {
    setStatus('Failed to load. Check token in admin-app.js', 'err');
    console.error(err);
  }
}

function setStatus(msg, cls) {
  const s = document.getElementById('saveStatus');
  s.textContent = msg;
  s.className = 'save-status' + (cls ? ' ' + cls : '');
}

async function saveAll() {
  const btn = document.getElementById('saveBtn');
  btn.disabled = true;
  setStatus('Saving...');
  try {
    const results = await Promise.all([
      saveFile('data/staff-leadership.json', data.staff, 'Update staff via admin'),
      saveFile('data/faq.json', data.faq, 'Update FAQ via admin'),
      saveFile('data/testimonials.json', data.testimonials, 'Update testimonials via admin'),
      saveFile('data/contact.json', data.contact, 'Update contact info via admin'),
      saveFile('data/homepage.json', data.homepage, 'Update homepage via admin'),
    ]);
    if (results.every(Boolean)) {
      setStatus('Saved! Site updates in ~2 min.', 'ok');
    } else {
      setStatus('Some saves failed.', 'err');
    }
  } catch (err) {
    setStatus('Error: ' + err.message, 'err');
  }
  btn.disabled = false;
}

// ── Panel Renderers ──
function renderPanel(name) {
  const container = document.getElementById('editorContainer');
  clear(container);
  const panel = el('div', { className: 'editor-panel active' });

  switch (name) {
    case 'staff': renderStaff(panel); break;
    case 'faq': renderFaq(panel); break;
    case 'testimonials': renderTestimonials(panel); break;
    case 'contact': renderContact(panel); break;
    case 'homepage': renderHomepage(panel); break;
  }

  container.appendChild(panel);
}

function renderStaff(panel) {
  panel.appendChild(el('h2', { textContent: 'Leadership Team', style: 'margin-bottom:1rem;color:#343e85' }));
  const list = el('div');

  data.staff.members.forEach((m, i) => {
    list.appendChild(itemRow([
      field('Name', m.name, v => { data.staff.members[i].name = v; }),
      field('Title', m.title, v => { data.staff.members[i].title = v; }),
      field('Initials', m.initials, v => { data.staff.members[i].initials = v; }),
      field('Email', m.email, v => { data.staff.members[i].email = v; }),
    ], () => { data.staff.members.splice(i, 1); renderPanel('staff'); }));
  });

  panel.appendChild(list);
  panel.appendChild(el('button', {
    className: 'add-btn',
    textContent: '+ Add Team Member',
    onclick: () => { data.staff.members.push({ name: '', title: '', initials: '', email: '', featured: true }); renderPanel('staff'); }
  }));
}

function renderFaq(panel) {
  panel.appendChild(el('h2', { textContent: 'FAQ Items', style: 'margin-bottom:1rem;color:#343e85' }));
  const list = el('div');

  data.faq.questions.forEach((q, i) => {
    list.appendChild(itemRow([
      field('Question', q.question, v => { data.faq.questions[i].question = v; }),
      field('Answer', q.answer, v => { data.faq.questions[i].answer = v; }, 'textarea'),
      checkbox('Show on Homepage', q.showOnHomepage, v => { data.faq.questions[i].showOnHomepage = v; }),
    ], () => { data.faq.questions.splice(i, 1); renderPanel('faq'); }));
  });

  panel.appendChild(list);
  panel.appendChild(el('button', {
    className: 'add-btn',
    textContent: '+ Add Question',
    onclick: () => { data.faq.questions.push({ question: '', answer: '', showOnHomepage: false }); renderPanel('faq'); }
  }));
}

function renderTestimonials(panel) {
  panel.appendChild(el('h2', { textContent: 'Parent Testimonials', style: 'margin-bottom:1rem;color:#343e85' }));
  const list = el('div');

  data.testimonials.testimonials.forEach((t, i) => {
    list.appendChild(itemRow([
      field('Quote', t.quote, v => { data.testimonials.testimonials[i].quote = v; }, 'textarea'),
      field('Name', t.name, v => { data.testimonials.testimonials[i].name = v; }),
      field('Detail', t.detail, v => { data.testimonials.testimonials[i].detail = v; }),
      field('Initials', t.initials, v => { data.testimonials.testimonials[i].initials = v; }),
    ], () => { data.testimonials.testimonials.splice(i, 1); renderPanel('testimonials'); }));
  });

  panel.appendChild(list);
  panel.appendChild(el('button', {
    className: 'add-btn',
    textContent: '+ Add Testimonial',
    onclick: () => { data.testimonials.testimonials.push({ quote: '', name: '', detail: '', initials: '' }); renderPanel('testimonials'); }
  }));
}

function renderContact(panel) {
  panel.appendChild(el('h2', { textContent: 'Contact Information', style: 'margin-bottom:1rem;color:#343e85' }));
  const c = data.contact;

  const mainCard = el('div', { className: 'editor-card' });
  mainCard.appendChild(el('h3', { textContent: 'Main Campus' }));
  mainCard.appendChild(field('Name', c.mainCampus.name, v => { c.mainCampus.name = v; }));
  mainCard.appendChild(field('Address', c.mainCampus.address, v => { c.mainCampus.address = v; }));
  mainCard.appendChild(field('Phone', c.mainCampus.phone, v => { c.mainCampus.phone = v; }));
  panel.appendChild(mainCard);

  const msapCard = el('div', { className: 'editor-card' });
  msapCard.appendChild(el('h3', { textContent: 'MSAP Campus' }));
  msapCard.appendChild(field('Name', c.msapCampus.name, v => { c.msapCampus.name = v; }));
  msapCard.appendChild(field('Address', c.msapCampus.address, v => { c.msapCampus.address = v; }));
  msapCard.appendChild(field('Phone', c.msapCampus.phone, v => { c.msapCampus.phone = v; }));
  panel.appendChild(msapCard);

  const genCard = el('div', { className: 'editor-card' });
  genCard.appendChild(el('h3', { textContent: 'General' }));
  genCard.appendChild(field('Email', c.email, v => { c.email = v; }));
  panel.appendChild(genCard);

  const hoursCard = el('div', { className: 'editor-card' });
  hoursCard.appendChild(el('h3', { textContent: 'School Hours' }));
  c.hours.forEach((h, i) => {
    const row = el('div', { className: 'item-row' });
    row.appendChild(field('Division', h.division, v => { c.hours[i].division = v; }));
    row.appendChild(field('Schedule', h.schedule, v => { c.hours[i].schedule = v; }));
    hoursCard.appendChild(row);
  });
  panel.appendChild(hoursCard);
}

function renderHomepage(panel) {
  panel.appendChild(el('h2', { textContent: 'Homepage Content', style: 'margin-bottom:1rem;color:#343e85' }));
  const h = data.homepage;

  const heroCard = el('div', { className: 'editor-card' });
  heroCard.appendChild(el('h3', { textContent: 'Hero Section' }));
  heroCard.appendChild(field('Headline', h.heroHeadline, v => { h.heroHeadline = v; }));
  heroCard.appendChild(field('Subtext', h.heroSubtext, v => { h.heroSubtext = v; }));
  panel.appendChild(heroCard);

  const proofCard = el('div', { className: 'editor-card' });
  proofCard.appendChild(el('h3', { textContent: 'Proof Bar Stats' }));
  h.proofStats.forEach((s, i) => {
    const row = el('div', { className: 'item-row' });
    row.appendChild(field('Number', s.number, v => { h.proofStats[i].number = v; }));
    row.appendChild(field('Label', s.label, v => { h.proofStats[i].label = v; }));
    proofCard.appendChild(row);
  });
  panel.appendChild(proofCard);

  const originCard = el('div', { className: 'editor-card' });
  originCard.appendChild(el('h3', { textContent: 'Origin Story' }));
  originCard.appendChild(field('Heading', h.originStory.heading, v => { h.originStory.heading = v; }));
  originCard.appendChild(field('Paragraph 1', h.originStory.para1, v => { h.originStory.para1 = v; }, 'textarea'));
  originCard.appendChild(field('Paragraph 2', h.originStory.para2, v => { h.originStory.para2 = v; }, 'textarea'));
  panel.appendChild(originCard);
}
