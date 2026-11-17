{
const links=[...document.querySelectorAll('.side a')];
const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const a=map.get(e.target.id);if(!a)continue;a.parentElement.querySelectorAll('a').forEach(x=>x.classList.toggle('on',x===a))}},{rootMargin:'-35% 0px -55% 0px'});
map.forEach((a,id)=>{const el=document.getElementById(id);if(el)io.observe(el)});
}
