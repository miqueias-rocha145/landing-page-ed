(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('nav-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const menuLinks = [...document.querySelectorAll('.nav-menu a')];
  const navLinks = menuLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('ed-theme', theme); } catch (_) { }
    themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    themeToggle?.setAttribute('title', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  };

  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const willOpen = !menu?.classList.contains('is-open');
    menu?.classList.toggle('is-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', willOpen);
  });

  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (!menu?.classList.contains('is-open')) return;
    if (!header?.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 34);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealElements = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const observedSections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.05, 0.25, 0.5] });

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const mobileFocusItems = [...document.querySelectorAll('[data-mobile-focus]')];
  let mobileFocusObserver;

  const setupMobileFocus = () => {
    mobileFocusObserver?.disconnect();
    mobileFocusItems.forEach((item) => item.classList.remove('is-active'));

    if (window.innerWidth > 820 || !('IntersectionObserver' in window)) return;

    mobileFocusObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
    }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });

    mobileFocusItems.forEach((item) => mobileFocusObserver.observe(item));
  };

  setupMobileFocus();
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      setupMobileFocus();
      if (window.innerWidth > 820) closeMenu();
    });
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item[open]').forEach((openItem) => {
        if (openItem !== item) openItem.removeAttribute('open');
      });
    });
  });

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  if (window.lucide) window.lucide.createIcons({ 'stroke-width': 1.8 });
})();
