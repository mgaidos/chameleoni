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
