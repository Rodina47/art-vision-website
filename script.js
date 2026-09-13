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

function nudgeProjects(dir){
  const step = getProjCardStep();
  projectsPaused = true;
  if(dir < 0 && trackWrap.scrollLeft <= 0){
    trackWrap.scrollLeft = track.scrollWidth / 2;
  }
  trackWrap.scrollBy({ left: dir * step, behavior:'smooth' });
  window.setTimeout(()=>{ projectsPaused = reduceMotion; }, 900);
}
nextBtn.addEventListener('click', (event)=>{ event.preventDefault(); nudgeProjects(1); });
prevBtn.addEventListener('click', (event)=>{ event.preventDefault(); nudgeProjects(-1); });

// Keep the project strip moving while preserving manual touch and mouse scrolling.
let projectsPaused = reduceMotion;
let projectsFrame = null;
let projectsLastTime = 0;
const projectsSpeed = 0.035;

function normalizeProjectScroll(){
  const halfway = track.scrollWidth / 2;
  if(trackWrap.scrollLeft >= halfway){
    trackWrap.scrollLeft -= halfway;
  } else if(trackWrap.scrollLeft < 0){
    trackWrap.scrollLeft += halfway;
  }
}

function moveProjects(timestamp){
  if(!projectsLastTime) projectsLastTime = timestamp;
  const elapsed = timestamp - projectsLastTime;
  projectsLastTime = timestamp;
  if(!projectsPaused && elapsed < 100){
    trackWrap.scrollLeft += elapsed * projectsSpeed;
    normalizeProjectScroll();
  }
  projectsFrame = requestAnimationFrame(moveProjects);
}

trackWrap.addEventListener('mouseenter', ()=>{ projectsPaused = true; });
trackWrap.addEventListener('mouseleave', ()=>{ projectsPaused = reduceMotion; });
trackWrap.addEventListener('pointerdown', ()=>{ projectsPaused = true; });
trackWrap.addEventListener('pointerup', ()=>{ projectsPaused = reduceMotion; });
trackWrap.addEventListener('pointercancel', ()=>{ projectsPaused = reduceMotion; });
trackWrap.addEventListener('wheel', ()=>{ projectsPaused = true; });
trackWrap.addEventListener('touchstart', ()=>{ projectsPaused = true; }, {passive:true});
trackWrap.addEventListener('touchmove', ()=>{ projectsPaused = true; }, {passive:true});
trackWrap.addEventListener('touchend', ()=>{
  window.setTimeout(()=>{ projectsPaused = reduceMotion; }, 1200);
}, {passive:true});
if(!reduceMotion) projectsFrame = requestAnimationFrame(moveProjects);

// ---------- Materials selector ----------
const materialCards = document.querySelectorAll('.material-card');
const materialTitle = document.getElementById('materialTitle');
const materialDescription = document.getElementById('materialDescription');
const materialUse = document.getElementById('materialUse');
const materials = [
  ['Acrylic', 'Clean, polished and versatile. Acrylic gives signage a premium finish with the clarity and color impact your brand deserves.', 'Signage · Retail displays · Facades'],
  ['PVC', 'Lightweight, practical and durable. PVC is a smart choice for crisp graphics, dimensional letters and fast-turnaround displays.', 'Indoor signs · Displays · Promotions'],
  ['Aluminum', 'Strong, weather-resistant and refined. Aluminum creates a confident finish for signage that needs to perform outdoors.', 'Outdoor signs · Cladding · Directional systems'],
  ['Vinyl', 'Flexible, colorful and made for impact. Vinyl brings campaigns, windows and vehicles to life with sharp visual communication.', 'Windows · Vehicles · Campaigns'],
  ['Wood', 'Warm, tactile and distinctive. Wood adds character to retail environments, hospitality spaces and crafted brand moments.', 'Retail interiors · Events · Hospitality'],
  ['LED / Lighting', 'Light turns visibility into an experience. We use LED solutions to make your brand impossible to miss, day or night.', 'Signage · Facades · Night branding']
];
materialCards.forEach((card, index)=>{
  card.addEventListener('click', ()=>{
    materialCards.forEach(item=>item.classList.remove('is-active'));
    card.classList.add('is-active');
    const [title, description, use] = materials[index];
    materialTitle.textContent = title;
    materialDescription.textContent = description;
    materialUse.textContent = use;
  });
});

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
    inner.style.transform = `rotateX(${-y*24}deg) rotateY(${x*32}deg) scale(1.06)`;
  });
  stage.addEventListener('pointerleave', () => {
    inner.style.transform = '';
    inner.classList.remove('is-active'); // resume the idle drift
  });