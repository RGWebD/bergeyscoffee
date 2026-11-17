(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// header + progress + to-top
const header=$('.header'),prog=$('.progress'),top=$('.to-top');
const onScroll=()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  header&&header.classList.toggle('scrolled',y>20);
  if(prog)prog.style.width=(h>0?y/h*100:0)+'%';
  top&&top.classList.toggle('show',y>700);
  if(!reduce)$$('.parallax').forEach(el=>{const r=el.getBoundingClientRect();const s=parseFloat(el.dataset.speed||.08);el.style.transform=`translate3d(0,${(r.top+r.height/2-innerHeight/2)*-s}px,0)`});
};
addEventListener('scroll',onScroll,{passive:true});onScroll();
top&&top.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
// mobile nav
const burger=$('.burger');
burger&&burger.addEventListener('click',()=>{const o=document.body.classList.toggle('nav-open');burger.setAttribute('aria-expanded',o)});
$$('.menu-links a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('nav-open');burger&&burger.setAttribute('aria-expanded','false')}));
// reveal
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});$$('.reveal').forEach(el=>io.observe(el))}else $$('.reveal').forEach(el=>el.classList.add('in'));
// button glow follow
$$('.btn').forEach(b=>b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--mx',e.clientX-r.left+'px');b.style.setProperty('--my',e.clientY-r.top+'px')}));
// tilt cards
if(!reduce&&matchMedia('(hover:hover)').matches)$$('[data-tilt]').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
// open/closed status (America/New_York) Mon-Sat 7-16
const st=$('[data-status]');
try{const now=new Date(new Date().toLocaleString('en-US',{timeZone:'America/New_York'}));const d=now.getDay(),m=now.getHours()*60+now.getMinutes();
  const open=d!==0&&m>=420&&m<960;
  if(st){st.innerHTML=open?`<span class="dot"></span>Open now · until 4 PM today`:`<span class="dot closed"></span>${d===0||(d===6&&m>=960)?'Closed · opens Monday 7 AM':(m<420?'Opens today at 7 AM':'Closed · opens tomorrow 7 AM')}`;}
  $$('.hours tr').forEach(tr=>{if(+tr.dataset.day===d)tr.classList.add('today')});
}catch(e){}
// menu tabs
const tabs=$$('[role=tab]');
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>{x.setAttribute('aria-selected',x===t);x.tabIndex=x===t?0:-1});$$('.menu-panel').forEach(p=>p.classList.toggle('active',p.id===t.getAttribute('aria-controls')))}));
tabs.forEach((t,i)=>t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];n.focus();n.click()}}));
// lightbox
const lb=$('.lightbox');
if(lb){const items=$$('.gallery button'),img=$('img',lb),cap=$('.lb-cap',lb);let i=0;
  const show=n=>{i=(n+items.length)%items.length;const b=items[i];img.src=b.dataset.full;img.alt=b.querySelector('img').alt;cap.textContent=b.querySelector('img').alt};
  items.forEach((b,n)=>b.addEventListener('click',()=>{show(n);lb.classList.add('open');document.body.style.overflow='hidden';$('.lb-close',lb).focus()}));
  const close=()=>{lb.classList.remove('open');document.body.style.overflow='';items[i]&&items[i].focus()};
  $('.lb-close',lb).addEventListener('click',close);$('.lb-prev',lb).addEventListener('click',()=>show(i-1));$('.lb-next',lb).addEventListener('click',()=>show(i+1));
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(i+1);if(e.key==='ArrowLeft')show(i-1)});
  let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(i+(dx<0?1:-1))});
}
// review slider
const sl=$('.slides');
if(sl){const step=()=>($('.review',sl)?.offsetWidth||380)+22;
  $('.rv-prev')?.addEventListener('click',()=>sl.scrollBy({left:-step(),behavior:'smooth'}));
  $('.rv-next')?.addEventListener('click',()=>sl.scrollBy({left:step(),behavior:'smooth'}));
  if(!reduce){let t=setInterval(()=>{if(sl.scrollLeft+sl.clientWidth>=sl.scrollWidth-10)sl.scrollTo({left:0,behavior:'smooth'});else sl.scrollBy({left:step(),behavior:'smooth'})},6000);
    ['pointerenter','focusin','touchstart'].forEach(ev=>sl.addEventListener(ev,()=>clearInterval(t),{passive:true}));}
}
// shop filters
const fb=$$('[data-filter]');
fb.forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;fb.forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.product').forEach(p=>{p.hidden=!(f==='all'||p.dataset.cat.split(' ').includes(f))})}));
// year
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
