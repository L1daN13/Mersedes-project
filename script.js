const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmtUSD = n => new Intl.NumberFormat('uk-UA',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const CARS = [
  { id:'amg-gt', title:'Mercedes-AMG GT', type:'sport', price:185000, power:'V8 Biturbo, 585 к.с.', accel:'0–100: 3.2 c', drive:'RWD', desc:'Спорткар AMG.', images:['[picsum.photos](https://picsum.photos/seed/amg/900/600)'] },
  { id:'s-class', title:'Mercedes-Benz S-Class', type:'sedan', price:142000, power:'I6/V8', accel:'0–100: 4.5 c', drive:'4MATIC', desc:'Еталон комфорту.', images:['[picsum.photos](https://picsum.photos/seed/sclass/900/600)'] },
  { id:'g-class', title:'Mercedes-Benz G-Class', type:'suv', price:220000, power:'V8 Biturbo', accel:'0–100: 4.5 c', drive:'4MATIC', desc:'Легенда офроуду.', images:['[picsum.photos](https://picsum.photos/seed/gclass/900/600)'] }
];

const state = { filters:{ q:'', maxPrice:'', type:'' }, theme: localStorage.getItem('theme') || 'auto' };

function setActivePage(id) {
  $$('.page').forEach(s => s.classList.toggle('active', s.id===id));
  $$('a[data-nav]').forEach(a=>{
    const t = (a.getAttribute('href')||'').replace('#','');
    a.setAttribute('aria-current', t===id ? 'page' : '');
  });
  $('.main-nav')?.classList.remove('open');
  $('.nav-toggle')?.setAttribute('aria-expanded','false');
}
function handleHashChange(){
  const id = location.hash.replace('#','') || 'home';
  setActivePage($('#'+id) ? id : 'home');
}
function initNav(){
  $$('a[data-nav]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href=a.getAttribute('href'); if(!href?.startsWith('#')) return;
      e.preventDefault(); history.pushState(null,'',href); handleHashChange();
      const id=href.slice(1); $('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  $('.nav-toggle')?.addEventListener('click',()=>{
    const nav=$('.main-nav'); const open=!nav.classList.contains('open');
    nav.classList.toggle('open',open); $('.nav-toggle').setAttribute('aria-expanded',String(open));
  });
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

function createCarCard(car){
  const el=document.createElement('article');
  el.className='card'; el.tabIndex=0;
  el.innerHTML=`
    <div class="thumb" style="background-image:url('${car.images[0]}');background-size:cover;background-position:center"></div>
    <div class="body">
      <h3 class="title">${car.title}</h3>
      <div class="meta">${car.type.toUpperCase()} • ${car.drive} • ${car.power}</div>
      <div class="price">${fmtUSD(car.price)}</div>
    </div>`;
  const open=()=>openModal(car.id);
  el.addEventListener('click',open);
  el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();open();} });
  return el;
}
function applyFilters(){
  const q=(state.filters.q||'').toLowerCase();
  const max=Number(state.filters.maxPrice)||Infinity;
  const t=state.filters.type||'';
  return CARS.filter(c=>{
    const matchesQ = [c.title,c.desc,c.power,c.drive].join(' ').toLowerCase().includes(q);
    const matchesP = c.price <= max;
    const matchesT = !t || c.type===t;
    return matchesQ && matchesP && matchesT;
  });
}
function renderCars(){
  const grid=$('#carsGrid'); if(!grid) return;
  grid.innerHTML='';
  const list=applyFilters();
  if(!list.length){ grid.innerHTML='<p style="color:#b7c0cc">Нічого не знайдено.</p>'; return; }
  list.forEach(c=>grid.appendChild(createCarCard(c)));
}
function initFilters(){
  const search=$('#search'), price=$('#price'), type=$('#type');
  $('#applyFilters')?.addEventListener('click',()=>{
    state.filters.q=search?.value||''; state.filters.maxPrice=price?.value||''; state.filters.type=type?.value||'';
    renderCars();
  });
  $('#resetFilters')?.addEventListener('click',()=>{
    if(search) search.value=''; if(price) price.value=''; if(type) type.value='';
    state.filters={ q:'', maxPrice:'', type:'' }; renderCars();
  });
  // Заповнити select моделей у формі
  const model=$('#model'); if(model){ model.innerHTML='<option value="">Не обрано</option>'+CARS.map(c=>`<option value="${c.id}">${c.title}</option>`).join(''); }
  renderCars();
}

const modal = $('#modal');
function openModal(id){
  const car=CARS.find(c=>c.id===id); if(!car) return;
  $('#modalTitle').textContent=car.title;
  $('#modalPrice').textContent=fmtUSD(car.price);
  $('#modalDesc').textContent=car.desc;
  $('#modalSpecs').innerHTML=`<li>${car.power}</li><li>${car.drive}</li><li>${car.accel}</li>`;
  $('#modalImage').src=car.images[0];
  const thumbs=$('#modalThumbs'); thumbs.innerHTML='';
  car.images.forEach((src,i)=>{ const im=new Image(); im.src=src; im.alt=`${car.title} ${i+1}`; im.onclick=()=>$('#modalImage').src=src; thumbs.appendChild(im); });
  modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
  // Дії
  $('#buyBtn').onclick=()=>{ const sel=$('#model'); if(sel) sel.value=car.id; location.hash='#contacts'; handleHashChange(); };
  $('#testDriveBtn').onclick=()=>{ const msg=$('#message'); if(msg) msg.value=`Хочу тест-драйв: ${car.title}`; location.hash='#contacts'; handleHashChange(); };
}
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
function initModal(){
  modal.addEventListener('click',e=>{
    if(e.target.closest('[data-close]') || e.target===modal) closeModal();
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.classList.contains('show')) closeModal(); });
}

function applyTheme(m){ document.body.classList.toggle('theme-light', m==='light'); }
function cycleTheme(){
  const cur=state.theme; const next=cur==='auto'?'light':cur==='light'?'dark':'auto';
  state.theme=next; localStorage.setItem('theme',next); applyTheme(next);
  const b=$('#themeToggle'); if(b){ b.textContent=next==='light'?'🌞':next==='dark'?'🌙':'🌓'; }
}
function initTheme(){ applyTheme(state.theme); $('#themeToggle')?.addEventListener('click',cycleTheme); }

function validateForm(d){
  const e={}; if(!d.name || d.name.trim().length<2) e.name='Вкажіть ім’я (мін. 2 символи).';
  const phone=(d.phone||'').replace(/\D/g,''); if(phone.length<10) e.phone='Вкажіть коректний телефон.'; return e;
}
function initContactForm(){
  const f=$('#contactForm'); if(!f) return;
  f.addEventListener('submit',ev=>{
    ev.preventDefault(); const fd=new FormData(f); const d=Object.fromEntries(fd.entries());
    $$('.error',f).forEach(s=>s.textContent=''); const errs=validateForm(d);
    Object.entries(errs).forEach(([k,msg])=>{ const s=$(`.error[data-for="${k}"]`,f); if(s) s.textContent=msg; });
    if(Object.keys(errs).length) return;
    $('#formStatus').textContent='Дякуємо! Зв’яжемося з вами.';
    f.reset();
  });
}

function initApp(){
  try{ initTheme(); }catch(e){ console.error(e); }
  try{ initNav(); }catch(e){ console.error(e); }
  try{ initFilters(); }catch(e){ console.error(e); }
  try{ initModal(); }catch(e){ console.error(e); }
  try{ initContactForm(); }catch(e){ console.error(e); }
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initApp); } else { initApp(); }
