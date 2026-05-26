// ===== УТИЛІТИ =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmtUSD = n => new Intl.NumberFormat('uk-UA', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0
}).format(n);

// ===== ДАНІ =====
const TYPE_LABELS = { sedan: 'Седан', suv: 'Позашляховик', sport: 'Спорткар', electric: 'Електро' };

const CARS = [
  {
    id: 'amg-gt', title: 'Mercedes-AMG GT 63 S', type: 'sport', price: 185000,
    power: 'V8 Biturbo 630 к.с.', accel: '0–100 км/г: 3.2 с', drive: 'RWD',
    desc: 'Квінтесенція AMG: 630-сильний V8, задній привід та гоночний характер.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/amggt63/900/600)',
      '[picsum.photos](https://picsum.photos/seed/amggt63int/900/600)',
      '[picsum.photos](https://picsum.photos/seed/amggt63side/900/600)'
    ]
  },
  {
    id: 's-class', title: 'Mercedes-Benz S-Class', type: 'sedan', price: 142000,
    power: 'I6 Mild-Hybrid 367 к.с.', accel: '0–100 км/г: 4.9 с', drive: '4MATIC',
    desc: 'Еталон комфорту, технологій і тиші. Новий стандарт бізнес-класу.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/sclass2024/900/600)',
      '[picsum.photos](https://picsum.photos/seed/sclassint/900/600)',
      '[picsum.photos](https://picsum.photos/seed/sclassnight/900/600)'
    ]
  },
  {
    id: 'g-class', title: 'Mercedes-Benz G 63 AMG', type: 'suv', price: 220000,
    power: 'V8 Biturbo 585 к.с.', accel: '0–100 км/г: 4.5 с', drive: '4MATIC',
    desc: 'Легендарний позашляховик із харизмою та топовим інтер’єром.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/gclass63/900/600)',
      '[picsum.photos](https://picsum.photos/seed/gclassint/900/600)',
      '[picsum.photos](https://picsum.photos/seed/gclassoff/900/600)'
    ]
  },
  {
    id: 'eqs', title: 'Mercedes-Benz EQS 580', type: 'electric', price: 138000,
    power: 'Dual Motor 523 к.с.', accel: '0–100 км/г: 4.3 с', drive: 'AWD',
    desc: 'Електричний флагман з запасом ходу до 770 км і Hyperscreen.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/eqs580/900/600)',
      '[picsum.photos](https://picsum.photos/seed/eqsint/900/600)',
      '[picsum.photos](https://picsum.photos/seed/eqsnight/900/600)'
    ]
  },
  {
    id: 'gle-coupe', title: 'Mercedes-AMG GLE 53 Coupé', type: 'suv', price: 98000,
    power: 'I6 EQ Boost 435 к.с.', accel: '0–100 км/г: 5.3 с', drive: '4MATIC+',
    desc: 'ДинамічнийSUV-купе AMG з простором для сім’ї.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/glecoupe/900/600)',
      '[picsum.photos](https://picsum.photos/seed/glegcint/900/600)',
      '[picsum.photos](https://picsum.photos/seed/glegcside/900/600)'
    ]
  },
  {
    id: 'c63-amg', title: 'Mercedes-AMG C 63 S E', type: 'sport', price: 112000,
    power: '2.0T + E-Motor 680 к.с.', accel: '0–100 км/г: 3.4 с', drive: 'AWD',
    desc: 'Гібридна революція: 680 к.с. і миттєва віддача тяги.',
    images: [
      '[picsum.photos](https://picsum.photos/seed/c63amg/900/600)',
      '[picsum.photos](https://picsum.photos/seed/c63int/900/600)',
      '[picsum.photos](https://picsum.photos/seed/c63side/900/600)'
    ]
  }
];

const state = { filters: { q: '', maxPrice: '', type: '' } };

// ===== SPA-НАВІГАЦІЯ =====
function setActivePage(id) {
  document.querySelectorAll('.page').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const t = (a.getAttribute('href') || '').replace('#', '');
    if (t === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
}

function getTargetFromHash() {
  const id = (location.hash || '#home').slice(1);
  return document.getElementById(id) ? id : 'home';
}

function handleHashChange() {
  setActivePage(getTargetFromHash());
}

function initNav() {
  document.querySelectorAll('a[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      if (location.hash !== href) history.pushState(null, '', href);
      handleHashChange();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// ===== КАТАЛОГ/ФІЛЬТРИ =====
function createCarCard(car) {
  const el = document.createElement('article');
  el.className = 'card'; el.tabIndex = 0;
  el.innerHTML = `
    <div class="card-thumb">
      <img src="${car.images[0]}" alt="${car.title}" loading="lazy" />
      <div class="card-thumb-overlay"></div>
      <div class="card-badge">${TYPE_LABELS[car.type] || car.type}</div>
    </div>
    <div class="card-body">
      <h3 class="card-title">${car.title}</h3>
      <div class="card-meta">${car.drive} · ${car.power}</div>
      <div class="card-price-row">
        <div class="card-price">${fmtUSD(car.price)}</div>
        <div class="card-cta">Детальніше <span class="card-cta-arrow">→</span></div>
      </div>
    </div>`;
  const open = () => openModal(car.id);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  return el;
}

function applyFilters() {
  const q = (state.filters.q || '').toLowerCase();
  const max = Number(state.filters.maxPrice) || Infinity;
  const t = state.filters.type || '';
  return CARS.filter(c => {
    const matchesQ = [c.title, c.desc, c.power, c.drive].join(' ').toLowerCase().includes(q);
    const matchesP = c.price <= max;
    const matchesT = !t || c.type === t;
    return matchesQ && matchesP && matchesT;
  });
}

function renderCars() {
  const grid = $('#carsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = applyFilters();
  if (!list.length) {
    grid.innerHTML = '<p class="no-results">Нічого не знайдено. Змініть фільтри.</p>';
    return;
  }
  list.forEach(c => grid.appendChild(createCarCard(c)));
}

function initFilters() {
  const search = $('#search'), price = $('#price'), type = $('#type');
  $('#applyFilters')?.addEventListener('click', () => {
    state.filters.q = search?.value || '';
    state.filters.maxPrice = price?.value || '';
    state.filters.type = type?.value || '';
    renderCars();
  });
  $('#resetFilters')?.addEventListener('click', () => {
    if (search) search.value = '';
    if (price) price.value = '';
    if (type) type.value = '';
    state.filters = { q: '', maxPrice: '', type: '' };
    renderCars();
  });
  // Опції у формі контактів
  const model = $('#model');
  if (model) {
    model.innerHTML = '<option value="">Не обрано</option>' + CARS.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
  }
  renderCars();
}

// ===== МОДАЛКА =====
const modal = $('#modal');
function openModal(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;
  $('#modalTitle').textContent = car.title;
  $('#modalPrice').textContent = fmtUSD(car.price);
  $('#modalDesc').textContent = car.desc;
  $('#modalSpecs').innerHTML = `<li>${car.power}</li><li>${car.drive}</li><li>${car.accel}</li>`;

  const mainImg = $('#modalImage');
  mainImg.src = car.images[0];
  const thumbs = $('#modalThumbs');
  thumbs.innerHTML = '';
  car.images.forEach((src, i) => {
    const im = new Image();
    im.src = src; im.alt = `${car.title} ${i + 1}`;
    if (i === 0) im.classList.add('active');
    im.onclick = () => {
      mainImg.src = src;
      thumbs.querySelectorAll('img').forEach(t => t.classList.remove('active'));
      im.classList.add('active');
    };
    thumbs.appendChild(im);
  });

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  $('#buyBtn').onclick = () => {
    const sel = $('#model');
    if (sel) sel.value = car.id;
    closeModal();
    history.pushState(null, '', '#contacts');
    handleHashChange();
  };
  $('#testDriveBtn').onclick = () => {
    closeModal();
    history.pushState(null, '', '#contacts');
    handleHashChange();
  };
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initModal() {
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}

// ===== ФОРМА =====
function validateForm(d) {
  const e = {};
  if (!d.name || d.name.trim().length < 2) e.name = "Вкажіть ім’я (мін. 2 символи).";
  const phone = (d.phone || '').replace(/\D/g, '');
  if (phone.length < 10) e.phone = "Вкажіть коректний телефон.";
  return e;
}

function initContactForm() {
  const f = $('#contactForm');
  if (!f) return;
  f.addEventListener('submit', ev => {
    ev.preventDefault();
    const fd = new FormData(f);
    const d = Object.fromEntries(fd.entries());
    $$('.error', f).forEach(s => s.textContent = '');
    const errs = validateForm(d);
    Object.entries(errs).forEach(([k, msg]) => {
      const s = $(`.error[data-for="${k}"]`, f);
      if (s) s.textContent = msg;
    });
    if (Object.keys(errs).length) return;
    const status = $('#formStatus');
    status.textContent = "✓ Дякуємо! Зв’яжемося з вами найближчим часом.";
    f.reset();
    setTimeout(() => { status.textContent = ''; }, 5000);
  });
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
function initApp() {
  initNav();
  initFilters();
  initModal();
  initContactForm();
}

// Гарантований старт після завантаження DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
