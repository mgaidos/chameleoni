{
const links=[...document.querySelectorAll('.side a')];
const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const a=map.get(e.target.id);if(!a)continue;a.parentElement.querySelectorAll('a').forEach(x=>x.classList.toggle('on',x===a))}},{rootMargin:'-35% 0px -55% 0px'});
map.forEach((a,id)=>{const el=document.getElementById(id);if(el)io.observe(el)});
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
