(function () {
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta a');

  function openMenu() {
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Menu sluiten');
    mobileNav.classList.add('is-open');
    mobileNav.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Menu openen');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', function () {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeMenu();
  });

  // Intersection observer for scroll reveals
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(function (el) {
      el.style.opacity = '0';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
