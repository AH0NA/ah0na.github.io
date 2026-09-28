// Floating hearts + tap/click sparkles + the "open my letter" button
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bits = ['💖','🌸','✨','🎀','💗','🦋'];
function spawn(x, y, rise) {
  if (still) return;
  const s = document.createElement('span');
  s.className = 'float';
  s.textContent = bits[Math.floor(Math.random() * bits.length)];
  s.style.left = x + 'px';
  s.style.fontSize = 16 + Math.random() * 22 + 'px';
  if (rise) s.style.animationDuration = 6 + Math.random() * 5 + 's';
  else { s.style.bottom = 'auto'; s.style.top = y + 'px'; s.style.animationDuration = '1.6s'; }
  document.body.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}
setInterval(() => spawn(Math.random() * innerWidth, 0, true), 900);
addEventListener('pointerdown', e => { for (let i = 0; i < 4; i++) spawn(e.clientX + (Math.random() * 60 - 30), e.clientY, false); });

const openBtn = document.getElementById('openBtn');
if (openBtn) openBtn.addEventListener('click', () => {
  const letter = document.getElementById('letter');
  letter.hidden = !letter.hidden;
  openBtn.textContent = letter.hidden ? 'Open your surprise 🎁' : 'Close 💌';
  for (let i = 0; i < 25; i++) spawn(Math.random() * innerWidth, 0, true);
});

// ---------- Content loading (data/data.js, optionally a published Google Sheet) ----------
const FALLBACK = 'images/placeholder.svg';
const paragraphs = t => String(t || '').trim().split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
function setImg(img, src) { img.onerror = () => { img.onerror = null; img.src = FALLBACK; }; img.src = src; }
const photoSrc = (s, i) => !s.photo ? `data/story${i + 1}.jpg` : /^(https?:|data:)/.test(s.photo) ? s.photo : 'data/' + s.photo;

function parseCSV(text) {            // handles quotes, commas and line breaks inside cells
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
async function getStories() {
  if (SITE.sheetUrl) {
    try {
      const r = await fetch(SITE.sheetUrl); if (!r.ok) throw 0;
      const [head, ...rows] = parseCSV(await r.text());
      const col = k => head.findIndex(h => h.trim().toLowerCase() === k);
      const [t, d, p, x] = ['title', 'date', 'photo', 'text'].map(col);
      const list = rows.filter(r => (r[t] || '').trim()).map(r => ({ title: r[t].trim(), date: (r[d] || '').trim(), photo: (r[p] || '').trim(), text: r[x] || '' }));
      if (list.length) return list;
    } catch (e) { /* offline or bad link: use data.js */ }
  }
  return SITE.stories;
}

async function initMain() {
  setImg(document.getElementById('profile'), SITE.profilePhoto);
  const box = document.getElementById('letter'); box.replaceChildren();
  paragraphs(SITE.message).forEach((p, i) => box.append(el('p', i === 0 ? 'letter-title' : '', p)));
  const grid = document.getElementById('grid'), stories = await getStories();
  if (!stories.length) { grid.append(el('div', 'note', 'No memories yet. Add one in data/data.js.')); return; }
  stories.forEach((s, i) => {
    const a = el('a', 'card polaroid'); a.href = `story.html?n=${i + 1}`;
    const img = el('img'); img.alt = s.title; setImg(img, photoSrc(s, i));
    a.append(img, el('em', '', s.title), el('small', '', s.date)); grid.append(a);
  });
}
async function initStory() {
  const root = document.getElementById('story'), stories = await getStories();
  const n = parseInt(new URLSearchParams(location.search).get('n'), 10) || 1, s = stories[n - 1];
  if (!s) { root.append(el('div', 'note', 'This memory was not found.')); return; }
  document.title = s.title + ' 💕';
  const fig = el('figure', 'polaroid'), img = el('img'); img.alt = s.title; setImg(img, photoSrc(s, n - 1));
  fig.append(img, el('figcaption', '', s.title));
  const box = el('div', 'text'); paragraphs(s.text).forEach(p => box.append(el('p', '', p)));
  const pager = el('div', 'pager'), prev = el('a', 'btn', '← Previous'), next = el('a', 'btn', 'Next →');
  prev.href = `story.html?n=${n - 1}`; next.href = `story.html?n=${n + 1}`;
  pager.append(n > 1 ? prev : el('span')); if (n < stories.length) pager.append(next);
  root.append(fig, el('h1', '', s.title), el('span', 'date', s.date), box, pager);
}
if (document.body.dataset.page === 'main') initMain();
if (document.body.dataset.page === 'story') initStory();
