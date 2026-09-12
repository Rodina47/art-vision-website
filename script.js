gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Header scroll state (GSAP + ScrollTrigger) ----------
const header = document.getElementById('siteHeader');
ScrollTrigger.create({
  start: 40,
  end: 99999,
  onUpdate: (self)=> header.classList.toggle('scrolled', self.scroll() > 40)
});

// ---------- Hero intro timeline ----------
if(!reduceMotion){
  const heroTl = gsap.timeline({ defaults:{ ease:'power3.out' } });
  heroTl
    .to('.hero-line span', { y:'0%', opacity:1, duration:.9, stagger:.17 }, .15)
    .to('.hero-copy p', { opacity:1, y:0, duration:.7 }, .75)
    .to('.hero-ctas', { opacity:1, y:0, duration:.7 }, .9)
    .to('.scroll-cue', { opacity:1, y:0, duration:.7 }, 1.05)
    .to('.hero-visual', { opacity:1, scale:1, duration:1.2, ease:'power4.out' }, .3);
} else {
  gsap.set(['.hero-line span','.hero-copy p','.hero-ctas','.scroll-cue','.hero-visual'], { opacity:1, y:0, scale:1 });
}

// subtle parallax drift on the hero image as the page scrolls
gsap.to('.hero-visual img', {
  yPercent: 12,
  ease:'none',
  scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
});

// ---------- Generic scroll reveal (ScrollTrigger, staggered for .stagger groups) ----------
document.querySelectorAll('.reveal').forEach(el=>{
  if(el.classList.contains('stagger')){
    const kids = gsap.utils.toArray(el.children);
    gsap.set(el, { opacity:1, y:0 }); // parent just needs to be visible; children animate individually
    gsap.fromTo(kids, { opacity:0, y:36 }, {
      opacity:1, y:0, duration:.8, ease:'power3.out', stagger:.12,
      scrollTrigger:{ trigger:el, start:'top 85%' }
    });
  } else {
    gsap.to(el, {
      opacity:1, y:0, duration:.8, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 87%' }
    });
  }
});

// ---------- Stat counters (GSAP tween drives the number + a subtle pop) ----------
gsap.utils.toArray('.stat-num').forEach(el=>{
  const target = parseInt(el.dataset.target,10);
  const counter = { val:0 };
  ScrollTrigger.create({
    trigger:'#statsBar', start:'top 80%', once:true,
    onEnter: ()=>{
      gsap.to(counter, {
        val: target, duration:1.6, ease:'power3.out',
        onUpdate: ()=> el.textContent = Math.floor(counter.val) + '+',
        onComplete: ()=> el.textContent = target + '+'
      });
      gsap.fromTo(el, { scale:.8 }, { scale:1, duration:.6, ease:'back.out(2)' });
    }
  });
});

// ---------- Process line fill ----------
gsap.to('#processFill', {
  width:'100%', ease:'power2.inOut',
  scrollTrigger:{ trigger:'#processSteps', start:'top 75%', once:true, scrub:false }
});
gsap.utils.toArray('.step').forEach((step,i)=>{
  gsap.from(step, {
    opacity:0, y:26, duration:.7, ease:'power3.out', delay:i*.12,
    scrollTrigger:{ trigger:'#processSteps', start:'top 75%', once:true }
  });
});

// ---------- Featured projects: endless auto-scrolling slider ----------
const track = document.getElementById('projTrack');
const prevBtn = document.getElementById('prevProj');
const nextBtn = document.getElementById('nextProj');
const trackWrap = document.querySelector('.proj-track-wrap');

function getProjCardStep(){
  const card = track.querySelector('.proj-card');
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 22;
  return card.getBoundingClientRect().width + gap;
}

let projAutoTween = null;
if(!reduceMotion){
  // xPercent:-50 drifts through exactly one full duplicated set, then repeats seamlessly
  projAutoTween = gsap.to(track, { xPercent:-50, ease:'none', duration:48, repeat:-1 });
  trackWrap.addEventListener('mouseenter', ()=> projAutoTween.pause());
  trackWrap.addEventListener('mouseleave', ()=> projAutoTween.play());
}

function nudgeProjects(dir){
  const step = getProjCardStep();
  gsap.to(track, { x: `${dir<0 ? '-=' : '+='}${step}`, duration:.55, ease:'power2.out' });
}
nextBtn.addEventListener('click', ()=> nudgeProjects(-1));
prevBtn.addEventListener('click', ()=> nudgeProjects(1));

// ---------- Before / After slider ----------
const baWrap = document.getElementById('baSlider');
const baClip = document.getElementById('baAfterClip');
const baHandle = document.getElementById('baHandle');
let dragging = false;

function setSlider(clientX){
  const rect = baWrap.getBoundingClientRect();
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, pct));
  baClip.style.clipPath = `inset(0 0 0 ${pct}%)`;
  baHandle.style.left = pct + '%';
}
baWrap.addEventListener('mousedown', (e)=>{ dragging = true; setSlider(e.clientX); });
window.addEventListener('mousemove', (e)=>{ if(dragging) setSlider(e.clientX); });
window.addEventListener('mouseup', ()=> dragging=false);
baWrap.addEventListener('touchstart', (e)=>{ dragging=true; setSlider(e.touches[0].clientX); });
baWrap.addEventListener('touchmove', (e)=>{ if(dragging){ setSlider(e.touches[0].clientX); e.preventDefault(); } }, {passive:false});
baWrap.addEventListener('touchend', ()=> dragging=false);

// gentle auto demo sweep on first reveal
const baObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      let t=0;
      const anim = setInterval(()=>{
        t+=1;
        const pct = 50 + Math.sin(t/12)*22;
        baClip.style.clipPath = `inset(0 0 0 ${pct}%)`;
        baHandle.style.left = pct+'%';
        if(t>60){ clearInterval(anim); }
      },16);
      baObserver.unobserve(entry.target);
    }
  });
},{threshold:0.5});
baObserver.observe(baWrap);

// ---------- Testimonials rotator (GSAP crossfade) ----------
const testiCards = document.querySelectorAll('.testi-card');
const testiDots = document.querySelectorAll('.testi-dots span');
let testiIndex = 0;
let testiAnimating = false;
function showTesti(i){
  if(i === testiIndex || testiAnimating) return;
  testiAnimating = true;
  const current = testiCards[testiIndex];
  const next = testiCards[i];
  testiDots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
  const tl = gsap.timeline({ onComplete: ()=>{ testiIndex = i; testiAnimating = false; } });
  tl.to(current, { opacity:0, y:-16, duration:.35, ease:'power2.in',
      onComplete: ()=> current.classList.remove('active') })
    .set(next, { opacity:0, y:16, display:'block' })
    .add(()=> next.classList.add('active'))
    .to(next, { opacity:1, y:0, duration:.5, ease:'power3.out' });
}
testiDots.forEach(d=>d.addEventListener('click', ()=> showTesti(parseInt(d.dataset.i,10))));
setInterval(()=>{ showTesti((testiIndex+1)%testiCards.length); }, 5500);

// ---------- Trusted clients marquee (GSAP infinite loop) ----------
if(!reduceMotion){
  gsap.to('#clientsTrack', { xPercent:-50, ease:'none', duration:26, repeat:-1 });
} else {
  document.getElementById('clientsTrack').style.width = 'auto';
}

// ---------- CTA graphic float (GSAP loop, replaces CSS keyframe) ----------
gsap.to('.cta-graphic', {
  y:-16, rotate:8, duration:3.5, ease:'sine.inOut', yoyo:true, repeat:-1
});

// ---------- Services dots (decorative sync with hover) ----------
const serviceDots = document.querySelectorAll('.dots span');
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, idx)=>{
  card.addEventListener('mouseenter', ()=>{
    serviceDots.forEach((d,i)=>d.classList.toggle('active', i === idx % serviceDots.length));
  });
});

// ---------- Burger (mobile) ----------
document.querySelector('.burger').addEventListener('click', ()=>{
  const links = document.querySelector('nav ul');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.cssText += 'display:flex;position:fixed;top:78px;left:0;right:0;background:#0c0b0a;flex-direction:column;padding:24px;gap:20px;';
});

// ---------- Contact form (static-site mailto handoff) ----------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if(contactForm && formStatus){
  contactForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    if(!contactForm.checkValidity()){
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const subject = `Project enquiry from ${data.get('name')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Company: ${data.get('company') || 'Not provided'}`,
      `Project type: ${data.get('projectType')}`,
      `Budget: ${data.get('budget') || 'Not provided'}`,
      `Timeline: ${data.get('timeline') || 'Not provided'}`,
      '',
      'Project brief:',
      data.get('message')
    ].join('\n');

    formStatus.textContent = 'Your email app is opening with your project brief ready to send.';
    formStatus.classList.add('is-success');
    contactForm.classList.add('is-submitted');
    window.location.href = `mailto:info@artvision-egypt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}



  // Replace https://id-preview--46f5a01d-6b24-4bb2-b6ed-33ad45d18249.lovable.app/__l5e/assets-v1/378e6a66-2f39-4f84-9266-1415a01aa60f/art-vision-logo.png above with the path to your transparent PNG logo.
  const stage = document.getElementById('stage');
  const inner = document.getElementById('stageInner');
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 2;
    const y = ((e.clientY - r.top) / r.height - .5) * 2;
    inner.classList.add('is-active');
    inner.style.transform = `rotateX(${-y*16}deg) rotateY(${x*22}deg) scale(1.04)`;
  });
  stage.addEventListener('pointerleave', () => {
    inner.style.transform = '';
    inner.classList.remove('is-active'); // resume the idle drift
  });