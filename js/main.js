const $=s=>document.querySelector(s);
const money=n=>'EGP '+n.toLocaleString('en-US');

const D=[
 {n:'Meridian 38',t:'Hand-wound · 38 mm',p:198000,c:'classic',img:'assets/01-meridian.jpg'},
 {n:'Noir Automatic',t:'Self-winding · 41 mm',p:279000,c:'automatic',img:'assets/02-noir.jpg'},
 {n:'Solstice GMT',t:'Dual time · 40 mm',p:305000,c:'sport',img:'assets/03-solstice.jpg'},
 {n:'Alpine Chrono',t:'Chronograph · 42 mm',p:189000,c:'sport',img:'assets/04-alpine.jpg'},
 {n:'Heritage 1929',t:'Manual · 36 mm',p:345000,c:'classic',img:'assets/05-heritage.jpg'},
 {n:'Obsidian Skeleton',t:'Skeleton · 40 mm',p:425000,c:'automatic',img:'assets/06-obsidian.jpg'},
 {n:'Midnight Diver',t:'200 m · 41 mm',p:129000,c:'sport',img:'assets/07-midnight.jpg'},
 {n:'Rosewood Slim',t:'Ultra-thin · 39 mm',p:229000,c:'classic',img:'assets/08-rosewood.jpg'}
];
D.forEach((w,i)=>w.id=i);

let filter='all';
let cart=JSON.parse(localStorage.getItem('aurum')||'{}');

const card=w=>`<article class="card">
  <div class="img"><img src="${w.img}" alt="${w.n} — ${w.t}" loading="lazy" decoding="async"><span class="tag">${w.c}</span></div>
  <div class="cbody">
    <h3>${w.n}</h3>
    <p class="sub">${w.t}</p>
    <div class="crow"><b>${money(w.p)}</b><button class="add" data-add="${w.id}" aria-label="Add ${w.n} to bag">Add +</button></div>
  </div>
</article>`;

function render(){
  $('#grid').innerHTML=D.filter(w=>filter==='all'||w.c===filter).map(card).join('');
}

function renderBag(){
  const ids=Object.keys(cart);
  $('#badge').textContent=ids.reduce((s,i)=>s+cart[i],0);
  $('#items').innerHTML=ids.length?ids.map(i=>{
    const w=D[i];
    return `<div class="citem">
      <div class="thumb"><img src="${w.img}" alt="${w.n}" loading="lazy"></div>
      <div class="ci"><b>${w.n}</b><span>${money(w.p)}</span>
        <div class="q">
          <button data-q="dec" data-id="${i}" aria-label="Decrease quantity">−</button>
          <span>${cart[i]}</span>
          <button data-q="inc" data-id="${i}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="rm" data-q="rm" data-id="${i}" aria-label="Remove ${w.n}">×</button>
    </div>`}).join(''):'<p class="empty">Your bag is empty.<br>Beautiful things await.</p>';
  $('#total').textContent=money(ids.reduce((s,i)=>s+D[i].p*cart[i],0));
  localStorage.setItem('aurum',JSON.stringify(cart));
}

const drawerOpen=v=>{
  $('#drawer').classList.toggle('on',v);
  $('#overlay').classList.toggle('on',v);
  document.body.style.overflow=v?'hidden':'';
};

let toastTimer;
function toast(msg){
  const t=$('#toast');
  t.textContent=msg; t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('on'),2600);
}

document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add){
    const id=add.dataset.add;
    cart[id]=(cart[id]||0)+1;
    renderBag(); toast('Added to your bag');
    return;
  }
  const q=e.target.closest('[data-q]');
  if(q){
    const id=q.dataset.id, act=q.dataset.q;
    if(act==='inc') cart[id]++;
    else if(act==='dec'&&cart[id]>1) cart[id]--;
    else delete cart[id];
    renderBag();
  }
});

$('#filters').onclick=e=>{
  if(!e.target.dataset.f) return;
  filter=e.target.dataset.f;
  [...document.querySelectorAll('#filters button')].forEach(b=>b.classList.toggle('on',b===e.target));
  render();
};

$('#openBag').onclick=()=>drawerOpen(true);
$('#closeBag').onclick=()=>drawerOpen(false);
$('#overlay').onclick=()=>drawerOpen(false);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') drawerOpen(false) });

$('#checkout').onclick=()=>{
  if(!Object.keys(cart).length) return toast('Your bag is empty');
  cart={}; renderBag(); drawerOpen(false);
  toast('Order placed — a confirmation is on its way.');
};

$('#news').onsubmit=e=>{
  e.preventDefault(); e.target.reset();
  toast('You’re on the list. Welcome to Aurum.');
};

render(); renderBag();