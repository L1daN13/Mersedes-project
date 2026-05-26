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
    desc: 'Еталон комфорту, технологій і тиші. Новий стандарт бізнес‑класу.',
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
    id: 'gle-coupe
