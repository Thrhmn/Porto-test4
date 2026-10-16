(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  const carousel = document.querySelector('#project-carousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.project-slide')];
    const dots = [...carousel.querySelectorAll('.carousel-dot')];
    const current = document.querySelector('#slide-current');
    const previous = document.querySelector('#carousel-prev');
    const next = document.querySelector('#carousel-next');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = 0, timer = null, paused = false;
    const show = index => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === active);
        slide.setAttribute('aria-hidden', String(i !== active));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === active);
        dot.setAttribute('aria-pressed', String(i === active));
      });
      if (current) current.textContent = String(active + 1).padStart(2, '0');
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => {
      stop(); if (reducedMotion || paused || document.hidden) return;
      timer = setInterval(() => show(active + 1), 6000);
    };
    previous?.addEventListener('click', () => { show(active - 1); start(); });
    next?.addEventListener('click', () => { show(active + 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.go)); start(); }));
    carousel.addEventListener('mouseenter', () => { paused = true; stop(); });
    carousel.addEventListener('mouseleave', () => { paused = false; start(); });
    carousel.addEventListener('focusin', () => { paused = true; stop(); });
    carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) { paused = false; start(); } });
    document.addEventListener('visibilitychange', start);
    let touchStart = null;
    carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; stop(); }, {passive:true});
    carousel.addEventListener('touchend', e => {
      if (touchStart !== null) { const dx = e.changedTouches[0].clientX - touchStart; if (Math.abs(dx) > 45) show(active + (dx < 0 ? 1 : -1)); }
      touchStart = null; start();
    }, {passive:true});
    show(0); start();
  }
  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
})();
