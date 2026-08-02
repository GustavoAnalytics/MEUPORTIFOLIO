(() => {
  'use strict';
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = $('#menuButton');
  const mobileMenu = $('#mobileMenu');
  const progress = $('#progress');
  const year = $('#year');
  const whatsappFloat = $('.whatsapp-float');
  if (year) year.textContent = new Date().getFullYear();

  const setMenu = open => {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (!menuButton || !mobileMenu || menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) setMenu(false);
  });
  addEventListener('resize', () => { if (innerWidth > 1080) setMenu(false); }, {passive:true});

  let raf = 0;
  const updateScroll = () => {
    raf = 0;
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    if(progress) progress.style.width = `${Math.min(100, scrollY / max * 100)}%`;
    if(whatsappFloat) whatsappFloat.classList.toggle('is-visible', scrollY > Math.min(520, innerHeight * .55));
  };
  addEventListener('scroll', () => { if(!raf) raf = requestAnimationFrame(updateScroll); }, {passive:true});
  updateScroll();

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:.08, rootMargin:'0px 0px -7% 0px'});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Counters above the fold
  const counters = $$('[data-counter]');
  const runCounter = el => {
    const target = Number(el.dataset.counter || 0);
    if(reduceMotion){ el.textContent = target; return; }
    const start = performance.now();
    const duration = 900;
    const tick = now => {
      const p = Math.min(1, (now-start)/duration);
      el.textContent = Math.round(target * (1 - Math.pow(1-p, 3)));
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  counters.forEach(runCounter);

  // Experience tabs
  const expTabs = $$('.experience-tab');
  const expPanels = $$('.experience-panel');
  const activateExperience = tab => {
    const id = tab.dataset.panel;
    expTabs.forEach(t => { const active=t===tab; t.classList.toggle('active',active); t.setAttribute('aria-selected',String(active)); t.tabIndex=active?0:-1; });
    expPanels.forEach(p => { const active=p.id===id; p.hidden=!active; p.classList.toggle('active',active); });
  };
  expTabs.forEach((tab,index) => {
    tab.addEventListener('click', () => activateExperience(tab));
    tab.addEventListener('keydown', e => {
      if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      e.preventDefault();
      let next=index;
      if(['ArrowDown','ArrowRight'].includes(e.key)) next=(index+1)%expTabs.length;
      if(['ArrowUp','ArrowLeft'].includes(e.key)) next=(index-1+expTabs.length)%expTabs.length;
      if(e.key==='Home') next=0; if(e.key==='End') next=expTabs.length-1;
      expTabs[next].focus(); activateExperience(expTabs[next]);
    });
  });

  // Project filters
  const filters = $$('.filter-tab');
  const projects = $$('.project-card');
  const filterProjects = button => {
    const filter=button.dataset.filter;
    filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
    projects.forEach(card=>{card.hidden=!(filter==='all'||card.dataset.category===filter);});
  };
  filters.forEach(b=>b.addEventListener('click',()=>filterProjects(b)));

  // Active nav
  const navLinks = $$('.desktop-nav a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window){
    const navObserver = new IntersectionObserver(entries => {
      const item=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!item) return;
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${item.target.id}`));
    },{rootMargin:'-25% 0px -65% 0px',threshold:[.05,.25]});
    sections.forEach(s=>navObserver.observe(s));
  }
})();