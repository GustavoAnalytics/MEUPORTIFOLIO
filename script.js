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

  // Recomendações reais do LinkedIn
  const recommendations = [{"name":"Mariano Latorre Bragion","initials":"MB","role":"Coordenador Administrativo e Financeiro | Especialista em Processos, ERP e Fluxo de Caixa | Indicadores, Power BI e Gestão de Equipes | Melhoria Contínua e Produtividade","date":"28 de julho de 2026","relation":"Trabalhou na mesma equipe que Gustavo Henrique","quote":"Quero deixar aqui um reconhecimento a um profissional que faz toda a diferença no dia a dia: Gustavo.\n\nEspecialista em sistemas ERP e consultoria em estruturação de sistemas, ele une algo que não é fácil de encontrar: domínio técnico de alto nível com uma capacidade impressionante de resolver problemas complexos. Não importa o desafio, ele sempre encontra um caminho — e faz isso com clareza, paciência e profissionalismo.\n\nTrabalhar ao lado dele é uma aula constante de competência aplicada: análise cuidadosa, soluções bem pensadas e comprometimento total com o resultado. Sua capacidade de traduzir problemas técnicos complexos em soluções práticas é rara, e seu jeito de sempre “achar uma saída” já salvou mais de um projeto.\n\nFica aqui meu reconhecimento e admiração pelo profissional e pela pessoa que é. Sucesso sempre, Gustavo! 🚀\n\n#ERP #Consultoria #TI #Reconhecimento"},{"name":"Lisandra Ferreira","initials":"LF","role":"Financeiro","date":"6 de julho de 2026","relation":"Trabalhou na mesma equipe que Gustavo Henrique","quote":"Tive a oportunidade de acompanhar o trabalho do Gustavo Farias no Grupo MNGT, principalmente no suporte aos usuários, treinamentos e definição de processos operacionais dentro dos Sistemas. No dia a dia da operação, atividades como lançamento de notas de entrada e saída, compras, pedidos, solicitações e acompanhamento do fluxo exigem clareza, padronização e orientação constante. O suporte prestado pelo Gustavo faz muita diferença nesse processo, pois ele não apenas resolve dúvidas, mas também busca entender a necessidade da operação, orientar os usuários e melhorar a forma como os processos são executados. Seu trabalho contribui diretamente para reduzir erros, retrabalho e dúvidas entre áreas, além de torna o uso de sistemas mais seguro, organizado e eficiente. A criação de treinamentos, fluxos, materiais de apoio e padronização ajuda muito os usuários a compreenderem o que deve ser feito, quando deve ser feito e qual o caminho correto dentro do sistema. Sem dúvida, sua atuação em suporte, treinamentos e melhoria de processos agrega muito valor ao Grupo MNGT e faz diferença real na rotina operacional da empresa."},{"name":"Taiane Binte","initials":"TB","role":"Analista Financeiro Sênior","date":"6 de julho de 2026","relation":"Trabalhou na mesma equipe que Gustavo Henrique","quote":"Tenho o prazer de trabalhar com o Gustavo e posso afirmar que é um profissional comprometido, responsável e muito dedicado ao que faz. Sempre demonstra disposição para colaborar com a equipe, enfrentando os desafios com profissionalismo e buscando as melhores soluções. Além de sua competência e organização, o Gustavo se destaca pela ética, pelo respeito com os colegas e pela vontade constante de aprender e evoluir. Sua postura contribui para um ambiente de trabalho mais produtivo e colaborativo. É um privilégio fazer parte da mesma equipe e recomendo o Gustavo com total confiança, certo de que continuará conquistando excelentes resultados em sua carreira."},{"name":"Lorenna Scarelli","initials":"LS","role":"Gestão Comercial | Vendas | Estratégias Criativas | CS | Expansão de Negócios | Franchising","date":"17 de abril de 2024","relation":"Trabalhou com Gustavo Henrique em equipes diferentes","quote":"Gustavo é um ótimo profissional. Competente, atencioso e ajudou meu setor a alavancar e melhorar os resultados em automação comercial com a implantação de sistemas e suporte técnico de qualidade. Além de estar sempre disponível a ensinar, compartilhar conhecimento e agregar em processos independentes. Desejo muito sucesso em sua trajetória! 😊"},{"name":"Daniele Rodrigues","initials":"DR","role":"Analista Jurídico | Analista Administrativo | Advogada","date":"10 de abril de 2024","relation":"Trabalhou na mesma equipe que Gustavo Henrique","quote":"Excelente profissional. Muito dedicado e atencioso. Colaborou muito para o desenvolvimento tecnológico do nosso departamento jurídico."},{"name":"Rodrigues Ademir","initials":"RA","role":"Professor na Unicep Universidade Central Paulista e Analista de RH na Cerebra","date":"14 de agosto de 2023","relation":"Trabalhou na mesma equipe que Gustavo Henrique","quote":"Gustavo, excelente profissional, muito dedicado, busca conhecimento incansavelmente quando algum desafio é atribuído. Em seus relacionamentos interpessoais, possui comportamentos assertivos, paciente e muito colaborativo. Profissional muito fácil de lidar."}];
  const testimonialModal = $('#testimonialModal');
  const testimonialModalCard = testimonialModal?.querySelector('.testimonial-modal-card');
  const testimonialModalAvatar = $('#testimonialModalAvatar');
  const testimonialModalName = $('#testimonialModalName');
  const testimonialModalRole = $('#testimonialModalRole');
  const testimonialModalMeta = $('#testimonialModalMeta');
  const testimonialModalQuote = $('#testimonialModalQuote');
  let testimonialLastFocus = null;

  const closeTestimonial = () => {
    if (!testimonialModal?.classList.contains('open')) return;
    testimonialModal.classList.remove('open');
    testimonialModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('testimonial-modal-open');
    testimonialLastFocus?.focus?.();
  };

  const openTestimonial = index => {
    const item = recommendations[index];
    if (!item || !testimonialModal) return;
    testimonialLastFocus = document.activeElement;
    if (testimonialModalAvatar) testimonialModalAvatar.textContent = item.initials;
    if (testimonialModalName) testimonialModalName.textContent = item.name;
    if (testimonialModalRole) testimonialModalRole.textContent = item.role;
    if (testimonialModalMeta) testimonialModalMeta.textContent = `${item.date} · ${item.relation}`;
    if (testimonialModalQuote) testimonialModalQuote.textContent = `“${item.quote}”`;
    testimonialModal.classList.add('open');
    testimonialModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('testimonial-modal-open');
    requestAnimationFrame(() => testimonialModal.querySelector('.testimonial-modal-close')?.focus());
  };

  $$('.testimonial-read').forEach(button => {
    button.addEventListener('click', () => openTestimonial(Number(button.dataset.recommendation)));
  });
  $$('[data-testimonial-close]').forEach(button => button.addEventListener('click', closeTestimonial));

  testimonialModal?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeTestimonial();
      return;
    }
    if (event.key !== 'Tab' || !testimonialModalCard) return;
    const focusable = [...testimonialModalCard.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

})();