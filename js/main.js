{
/* sub-chapter scroll-spy: highlights the current item, clears it when you leave the chapter,
   keeps the active pill visible in the horizontally scrolling mobile bar */
const calm=matchMedia('(prefers-reduced-motion: reduce)');
const links=[...document.querySelectorAll('.side a')];
const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const mark=a=>{const nav=a.parentElement;nav.querySelectorAll('a').forEach(x=>x.classList.toggle('on',x===a));
if(nav.scrollWidth>nav.clientWidth){const l=a.offsetLeft-nav.clientWidth/2+a.offsetWidth/2;nav.scrollTo({left:l,behavior:calm.matches?'auto':'smooth'})}};
const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const a=map.get(e.target.id);if(a)mark(a)}},{rootMargin:'-35% 0px -55% 0px'});
map.forEach((a,id)=>{const el=document.getElementById(id);if(el)io.observe(el)});
/* chapter-level: aria-current on the header nav, reset sub-nav when its chapter leaves the viewport */
const top=[...document.querySelectorAll('.top nav a')];
const chapIO=new IntersectionObserver(es=>{for(const e of es){
const id=e.target.id,t=top.find(a=>a.getAttribute('href')==='#'+id);
if(e.isIntersecting){top.forEach(a=>a.removeAttribute('aria-current'));if(t)t.setAttribute('aria-current','location')}
else{if(t)t.removeAttribute('aria-current');e.target.querySelectorAll('.side a.on').forEach(x=>x.classList.remove('on'))}
}},{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('#terarium,#vyber,#krmeni,#kontakt').forEach(el=>chapIO.observe(el));
}

{
const figs=document.querySelectorAll('.tiles figure');
if(figs.length&&'HTMLDialogElement' in window){
const dlg=document.createElement('dialog');
dlg.className='lb';
dlg.setAttribute('aria-label','Zvětšený obrázek');
dlg.innerHTML='<figure><img alt=""><figcaption></figcaption></figure><button class="x" type="button" aria-label="Zavřít"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#no"/></svg></button>';
document.body.append(dlg);
const big=dlg.querySelector('img'),cap=dlg.querySelector('figcaption');
dlg.querySelector('.x').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
figs.forEach(f=>{
const img=f.querySelector('img'),txt=f.querySelector('figcaption')?.textContent||img.alt;
const b=document.createElement('button');
b.type='button';b.className='zoom';b.setAttribute('aria-label','Zvětšit: '+img.alt);
img.replaceWith(b);b.append(img);
b.addEventListener('click',()=>{
big.src=img.currentSrc||img.src;big.alt=img.alt;cap.textContent=txt;
big.style.setProperty('--w',Math.round((img.naturalWidth||img.width)*1.6)+'px');
dlg.showModal();
});
});
}
}

{
/* scroll reveal: content below the first screen slides up as it enters;
   grids (tiles, localities) stagger; skipped entirely with reduced motion */
const calm=matchMedia('(prefers-reduced-motion: reduce)');
if(!calm.matches&&'IntersectionObserver' in window){
const sel='.chap-h,.card,.pick,.loc,.compare,.sex,.choose,.tiles figure,.sched>div,.day>div';
const io=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}},{rootMargin:'0px 0px -8% 0px',threshold:.08});
const fold=innerHeight;
document.querySelectorAll(sel).forEach(el=>{
if(el.getBoundingClientRect().top<fold)return;
const sib=el.parentElement?[...el.parentElement.children].filter(x=>x.matches(sel)):[];
const i=sib.indexOf(el);
if(sib.length>1&&i>0)el.style.setProperty('--d',Math.min(i*70,350)+'ms');
el.classList.add('rv');io.observe(el);
});
}
}

{
/* chameleons: locality stage recolours to the chosen locality; a second one peeks from the fern in Krmení */
const stage=document.querySelector('.stage-c');
const locs=[...document.querySelectorAll('.loc[data-pal]')];
const keys=['--c-body','--c-stripe','--c-belly','--c-head'];
const paint=(el,pal)=>pal.split(',').forEach((c,i)=>el.style.setProperty(keys[i],c));
if(stage&&locs.length){
document.querySelector('.loc-wrap')?.classList.add('js-locs');
const name=stage.querySelector('.stage-n b');
const pick=card=>{if(card.classList.contains('on'))return;locs.forEach(l=>l.classList.toggle('on',l===card));paint(stage,card.dataset.pal);name.textContent=card.dataset.name};
pick(locs[0]);
locs.forEach(l=>{l.addEventListener('click',()=>pick(l));l.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')pick(l)})});
const narrow=matchMedia('(max-width:900px)');
const mid=new IntersectionObserver(es=>{if(!narrow.matches)return;for(const e of es)if(e.isIntersecting)pick(e.target)},{rootMargin:'-48% 0px -40% 0px'});
locs.forEach(l=>mid.observe(l));
}
/* peeking chameleon: cloned from the stage drawing, new colours each time it comes out */
const band=document.getElementById('krmeni'),src=document.querySelector('.cham-svg');
if(band&&src){
band.querySelector(':scope > .fern')?.remove();
const svg=src.cloneNode(true);
svg.querySelector('clipPath').id='cham-cb2';svg.querySelector('[clip-path]').setAttribute('clip-path','url(#cham-cb2)');
svg.querySelector('.br').remove();
const box=document.createElement('div');box.className='peek';
box.innerHTML='<button class="peek-b" type="button"></button><img class="peek-f" src="img/foto-01.webp" alt="" width="251" height="360">';
const btn=box.querySelector('button');btn.append(svg);
band.append(box);
let shy=false,n=3;
const next=()=>locs.length?locs[n++%locs.length].dataset.pal:'#23b7c4,#1c4fb0,#d9f1e4,#1c4fb0';
paint(box,next());
/* recolour only while hidden, so it comes out in its new colours */
const show=on=>{box.classList.toggle('out',on);btn.setAttribute('aria-label',on?'Schovat chameleona':'Přivolat chameleona');
if(!on)setTimeout(()=>{if(!box.classList.contains('out'))paint(box,next())},950)};
btn.setAttribute('aria-label','Přivolat chameleona');
btn.addEventListener('click',()=>{shy=box.classList.contains('out');show(!shy)});
new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){if(!shy)setTimeout(()=>show(true),350)}else{shy=false;show(false)}}},{threshold:.95}).observe(box);
}
/* eyes follow the pointer, like a chameleon's independent turret eyes */
let raf=0,px=0,py=0;
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
document.querySelectorAll('.cham-svg').forEach(svg=>{const r=svg.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;
const m=svg.getScreenCTM();if(!m)return;const ex=m.a*227+m.c*81+m.e,ey=m.b*227+m.d*81+m.f;
const dx=px-ex,dy=py-ey,d=Math.hypot(dx,dy)||1,k=Math.min(3.2,d/40);
svg.querySelector('.pupil').style.transform=`translate(${(dx/d*k-1).toFixed(2)}px,${(dy/d*k+.5).toFixed(2)}px)`;});
})},{passive:true});
}
