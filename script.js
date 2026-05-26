// =========================
// УТИЛІТИ
// =========================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const fmtUSD = (n) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// =========================
// СТАН ДОДАТКА / ДАНІ
// =========================
const CARS = [
  {
    id: 'amg-gt',
    title: 'Mercedes-AMG GT',
    type: 'sport',
    price: 185000,
    power: 'V8 Biturbo, 585 к.с.',
    accel: '0–100 км/год: 3.2 c',
    drive: 'RWD',
    desc: 'Чистокровний спорткар AMG з вражаючою динамікою та керованістю.',
    images: ['img/amg-gt.jpg', 'img/amg-gt-2.jpg', 'img/amg-gt-3.jpg', 'img/amg-gt-4.jpg']
  },
  {
    id: 's-class',
    title: 'Mercedes-Benz S-Class',
    type: 'sedan',
    price: 142000,
    power: 'Інлайн-6/ V8, до 503 к.с.',
    accel: '0–100 км/год: від 4.5 c',
    drive: '4MATIC',
    desc: 'Еталон комфорту та інновацій: MBUX, масаж, рівень тиші бібліотеки.',
    images: ['img/s-class.jpg', 'img/s-class-2.jpg', 'img/s-class-3.jpg', 'img/s-class-4.jpg']
  },
  {
    id: 'g-class',
    title: 'Mercedes-Benz G-Class',
    type: 'suv',
    price: 220000,
    power: 'V8 Biturbo, 585 к.с. (AMG)',
    accel: '0–100 км/год: 4.5 c',
    drive: '4MATIC, блокування диференціалів',
    desc: 'Легендарний позашляховик із неповторним характером і прохідністю.',
    images: ['img/g-class.jpg', 'img/g-class-2.jpg', 'img/g-class-3.jpg', 'img/g-class-4.jpg']
  },
  // Приклад електромобіля
  {
    id: 'eqs',
    title: 'Mercedes-Benz EQS',
    type: 'electric',
    price: 135000,
    power: 'До 516 к.с., батарея 108 кВт·год',
    accel: '0–100 км/год: 4.3 c',
    drive: '4MATIC',
    desc: 'Флагманська електрична розкіш з запасом ходу до 700+ км (WLTP).',
    images: ['img/eqs.jpg', 'img/eqs-2.jpg', 'img/eqs-3.jpg', 'img/eqs-4.jpg']
  }
];

const state = {
  filters: { q: '', maxPrice: '', type: '' },
  theme: localStorage.getItem('theme') || 'auto' // 'light' | 'dark' | 'auto'
};

// =========================
/* НАВІГАЦІЯ: SPA-якорі, підсвітка меню, бургер */
// =========================
function setActivePage(id) {
  $$('.page').forEach(s => s.classList.toggle('active', s.id === id));
  // Підсвітка пункту меню
  $$('a[data-nav]').forEach(a => {
    const target = a.getAttribute('href')?.replace('#','') || '';
    a.setAttribute('aria-current', target === id ? 'page' : '');
  });
  // Закрити моб. меню
  $('.main-nav')?.classList.remove('open');
  $('.nav-toggle')?.setAttribute('aria-expanded', 'false');
}

function handleHashChange() {
  const id = location.hash.replace('#','') || 'home';
  const exists = $(`#${id}.page`);
  setActivePage(exists ? id : 'home');
}

function initNav() {
  // Клік по пунктам меню з плавною прокруткою до секції
  $$('a[data-nav]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        history.pushState(null, '', href);
        handleHashChange();
        // фокус на заголовок секції для доступності
        const id = href.slice(1);
        const heading = $(`#${id} h2, #${id} h1`);
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
        heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => heading?.removeAttribute('tabindex'), 600);
      }
    });
  });

  // Бургер-меню
  const navToggle = $('.nav-toggle');
  const nav = $('.main-nav');
  navToggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// =========================
// КАТАЛОГ: рендер карток, фільтри
// =========================
function createCarCard(car) {
  const el = document.createElement('article');
  el.className = 'card';
  el.setAttribute('tabindex', '0');
  el.innerHTML = `
    <div class="thumb" style="background-image:url('${car.images[0]}')"></div>
    <div class="body">
      <h3 class="title">${car.title}</h3>
      <div class="meta">
        <span>${car.type.toUpperCase()}</span>
        <span>${car.drive}</span>
        <span>${car.power}</span>
      </div>
      <div class="price">${fmtUSD(car.price)}</div>
    </div>
  `;
  const open = () => openModal(car.id);
  el.addEventListener('click', open);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  return el;
}

function applyFilters() {
  const q = state.filters.q.trim().toLowerCase();
  const maxP = Number(state.filters.maxPrice) || Infinity;
  const t = state.filters.type;

  return CARS.filter(c => {
    const matchesQ = !q || [c.title, c.desc, c.power, c.drive].join(' ').toLowerCase().includes(q);
    const matchesPrice = c.price <= maxP;
    const matchesType = !t || c.type === t;
    return matchesQ && matchesPrice && matchesType;
  });
}

function renderCars() {
  const grid = $('#carsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = applyFilters();
  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--text-dim)">Нічого не знайдено. Спробуйте змінити фільтри.</p>`;
    return;
  }
  list.forEach(car => grid.appendChild(createCarCard(car)));
}

function initFilters() {
  const search = $('#search');
  const price = $('#price');
  const type = $('#type');
  const applyBtn = $('#applyFilters');
  const resetBtn = $('#resetFilters');

  // Заповнити max price підказкою — максимальна ціна в даних
  const maxInData = Math.max(...CARS.map(c => c.price));
  if (price && !price.placeholder) price.placeholder = String(maxInData);

  applyBtn?.addEventListener('click', () => {
    state.filters.q = search?.value || '';
    state.filters.maxPrice = price?.value || '';
    state.filters.type = type?.value || '';
    renderCars();
  });

  resetBtn?.addEventListener('click', () => {
    if (search) search.value = '';
    if (price) price.value = '';
    if (type) type.value = '';
    state.filters = { q: '', maxPrice: '', type: '' };
    renderCars();
  });

  // Живий пошук Enter-ом
  search?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); applyBtn?.click(); }
  });

  // Заповнити селект у формі контактів
  const modelSelect = $('#model');
  if (modelSelect) {
    modelSelect.innerHTML = `<option value="">Не обрано</option>` + CARS
      .map(c => `<option value="${c.id}">${c.title}</option>`).join('');
  }

  renderCars();
}

// =========================
// МОДАЛЬНЕ ВІКНО З ГАЛЕРЕЄЮ
// =========================
const modal = $('#modal');
const modalImage = $('#modalImage');
const modalThumbs = $('#modalThumbs');
const modalTitle = $('#modalTitle');
const modalPrice = $('#modalPrice');
const modalDesc = $('#modalDesc');
const modalSpecs = $('#modalSpecs');

function openModal(carId) {
  const car = CARS.find(c => c.id === carId);
  if (!car) return;

  modalTitle.textContent = car.title;
  modalPrice.textContent = fmtUSD(car.price);
  modalDesc.textContent = car.desc;
  modalSpecs.innerHTML = `
    <li>Потужність: ${car.power}</li>
    <li>Привід: ${car.drive}</li>
    <li>Розгін: ${car.accel}</li>
    <li>Клас: ${car.type.toUpperCase()}</li>
  `;

  modalImage.src = car.images[0];
  modalImage.alt = `Фото: ${car.title}`;

  modalThumbs.innerHTML = '';
  car.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${car.title} — фото ${i+1}`;
    img.addEventListener('click', () => { modalImage.src = src; });
    modalThumbs.appendChild(img);
  });

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  // Кнопки дій
  $('#buyBtn')?.replaceWith($('#buyBtn')?.cloneNode(true));
  $('#testDriveBtn')?.replaceWith($('#testDriveBtn')?.cloneNode(true));
  const buyBtn = $('#buyBtn');
  const tdBtn = $('#testDriveBtn');

  buyBtn?.addEventListener('click', () => {
    // Перенесемо вибрану модель у форму контактів
    const modelSelect = $('#model');
    if (modelSelect) modelSelect.value = car.id;
    location.hash = '#contacts';
    handleHashChange();
  });
  tdBtn?.addEventListener('click', () => {
    const name = $('#name');
    const message = $('#message');
    if (message) message.value = `Хочу тест-драйв моделі: ${car.title}`;
    name?.focus();
    location.hash = '#contacts';
    handleHashChange();
  });
}

function closeModal() {
  modal?.classList.remove('show');
  modal?.setAttribute('aria-hidden', 'true');
}

function initModal() {
  // Закриття по backdrop / хрестик
  modal?.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]') || e.target === modal) closeModal();
  });
  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('show')) closeModal();
  });
}

// =========================
/* ТЕМА: перемикач світла/темна/авто */
// =========================
function applyTheme(mode) {
  const body = document.body;
  body.classList.remove('theme-light');
  // За замовчуванням темна
  if (mode === 'light') body.classList.add('theme-light');
  // 'dark' — залишаємо за дефолтом
}

function cycleTheme() {
  const current = state.theme;
  const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
  state.theme = next;
  localStorage.setItem('theme', next);
  applyTheme(next);
  const btn = $('#themeToggle');
  if (btn) {
    const label = next === 'auto' ? 'Тема: авто' : next === 'light' ? 'Тема: світла' : 'Тема: темна';
    btn.setAttribute('aria-label', `Перемикання теми (${label})`);
    btn.textContent = next === 'light' ? '🌞' : next === 'dark' ? '🌙' : '🌓';
  }
}

function initTheme() {
  applyTheme(state.theme);
  const btn = $('#themeToggle');
  btn?.addEventListener('click', cycleTheme);
  // Ініціальний значок
  btn && (btn.textContent = state.theme === 'light' ? '🌞' : state.theme === 'dark' ? '🌙' : '🌓');
}

// =========================
// ФОРМА КОНТАКТІВ: валідація
// =========================
function validateForm(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Вкажіть ім’я (мін. 2 символи).';
  }
  const phoneDigits = (data.phone || '').replace(/\D/g,'');
  if (phoneDigits.length < 10) {
    errors.phone = 'Вкажіть коректний телефон.';
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Некоректний email.';
  }
  return errors;
}

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // Очистити помилки
    $$('.error', form).forEach(span => span.textContent = '');

    const errs = validateForm(data);
    Object.entries(errs).forEach(([k, msg]) => {
      const span = $(`.error[data-for="${k}"]`, form);
      if (span) span.textContent = msg;
    });
    if (Object.keys(errs).length) return;

    const status = $('#formStatus');
    status.textContent = 'Надсилаємо...';
    await sleep(600); // імітація запиту

    // Тут можна виконати реальний запит fetch на ваш бекенд
    // await fetch('/api/lead', { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type':'application/json'} });

    status.textContent = 'Дякуємо! Ми зв’яжемося з вами найближчим часом.';
    form.reset();
  });
}

// =========================
// ПЛАВНІ ЯКОРІ ДЛЯ КНОПОК У HERO
// =========================
function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // Пропускаємо основні nav-посилання (їх вже обробляє initNav)
      if (!href || a.hasAttribute('data-nav')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        history.pushState(null, '', href);
        handleHashChange();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// =========================
// ІНІЦІАЛІЗАЦІЯ
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initFilters();
  initModal();
  initContactForm();
  initSmoothAnchors();
});
