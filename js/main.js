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
/* real header height drives the sticky offsets (sub-nav, stage, anchor padding) */
const top=document.querySelector('.top');
if(top&&'ResizeObserver' in window){const setH=()=>document.documentElement.style.setProperty('--hdr',top.offsetHeight+'px');new ResizeObserver(setH).observe(top)}
}

{
/* chameleons: one drawing (the stage), cloned for the mobile cards and the fern peek.
   Colours come from data-pal (body, stripe, belly, head), patterns from data-pat. */
const stage=document.querySelector('.stage-c'),src=stage?.querySelector('.cham-svg');
const locs=[...document.querySelectorAll('.loc[data-pal]')];
const keys=['--c-body','--c-stripe','--c-belly','--c-head'];
const paint=(el,card)=>{card.dataset.pal.split(',').forEach((c,i)=>el.style.setProperty(keys[i],c));el.dataset.pat=card.dataset.pat||''};
const fresh=id=>{const s=src.cloneNode(true);s.querySelector('clipPath').id='cham-cb-'+id;s.querySelector('[clip-path]').setAttribute('clip-path',`url(#cham-cb-${id})`);return s};
if(src&&locs.length){
document.querySelector('.loc-wrap')?.classList.add('js-locs');
/* phones: every card gets its own small chameleon, nothing to keep in sync */
locs.forEach((l,i)=>{const m=document.createElement('div');m.className='mini';m.setAttribute('aria-hidden','true');m.append(fresh('m'+i));paint(m,l);l.append(m)});
/* desktop: the stage follows the card under the pointer, but not cards that merely scroll past it */
const name=stage.querySelector('.stage-n b');
let lastScroll=0;addEventListener('scroll',()=>{lastScroll=performance.now()},{passive:true});
const pick=card=>{if(card.classList.contains('on'))return;locs.forEach(l=>l.classList.toggle('on',l===card));paint(stage,card);name.textContent=card.dataset.name};
pick(locs[0]);
locs.forEach(l=>{
l.addEventListener('click',()=>pick(l));
l.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&performance.now()-lastScroll>250)pick(l)});
l.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')pick(l)});
});
}
/* peeking chameleon in Krmení: decorative (hidden from assistive tech), new colours each time it comes out */
const band=document.getElementById('krmeni');
if(band&&src&&locs.length){
band.querySelector(':scope > .fern')?.remove();
const svg=fresh('peek');svg.querySelectorAll('.br').forEach(x=>x.remove());
const box=document.createElement('div');box.className='peek';box.setAttribute('aria-hidden','true');
box.innerHTML='<button class="peek-b" type="button" tabindex="-1"></button><img class="peek-f" src="img/foto-01.webp" alt="" width="251" height="360">';
const btn=box.querySelector('button');btn.append(svg);band.append(box);
let shy=false,n=3;const next=()=>locs[n++%locs.length];
paint(box,next());
const show=on=>{box.classList.toggle('out',on);if(!on)setTimeout(()=>{if(!box.classList.contains('out'))paint(box,next())},950)};
btn.addEventListener('click',()=>{shy=box.classList.contains('out');show(!shy)});
new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){if(!shy)setTimeout(()=>show(true),350)}else{shy=false;show(false)}}},{threshold:.95}).observe(box);
}
/* eyes follow the pointer, like a chameleon's turret eyes */
let raf=0,px=0,py=0;
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
document.querySelectorAll('.cham-svg').forEach(svg=>{const r=svg.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;
const m=svg.getScreenCTM();if(!m)return;const ex=m.a*230+m.c*83+m.e,ey=m.b*230+m.d*83+m.f;
const dx=px-ex,dy=py-ey,d=Math.hypot(dx,dy)||1,k=Math.min(3,d/40);
svg.querySelector('.pupil').style.transform=`translate(${(dx/d*k-1).toFixed(2)}px,${(dy/d*k+.5).toFixed(2)}px)`;});
})},{passive:true});
}

{
/* scroll reveal (screen only): small pieces below the first screen slide up as they enter;
   whole cards never animate, so nothing is revealed twice. Skipped with reduced motion. */
const calm=matchMedia('(prefers-reduced-motion: reduce)');
if(!calm.matches&&'IntersectionObserver' in window){
const sel='.chap-h,.card>h3,.sec-h,.loc,.compare,.choose,.sex>h3,.tiles figure,.sched>div,.day>div';
const io=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}},{rootMargin:'0px 0px -8% 0px',threshold:.08});
const fold=innerHeight;
document.querySelectorAll(sel).forEach(el=>{
if(el.getBoundingClientRect().top<fold)return;
const sib=el.parentElement?[...el.parentElement.children].filter(x=>x.matches(sel)):[];
const i=sib.indexOf(el);
if(sib.length>1&&i>0)el.style.setProperty('--d',Math.min(i*70,350)+'ms');
el.classList.add('rv');io.observe(el);
});
const showAll=root=>{if(root.matches?.('.rv'))root.classList.add('in');root.querySelectorAll('.rv').forEach(x=>x.classList.add('in'))};
/* a jump from the menu lands on finished content, not on a fade */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.getElementById(a.getAttribute('href').slice(1));if(t)showAll(t)});
addEventListener('beforeprint',()=>showAll(document.body));
}
}

/* printing: lazy images below the fold would otherwise print as empty tiles */
addEventListener('beforeprint',()=>document.querySelectorAll('img[loading="lazy"]').forEach(i=>{i.loading='eager'}));
