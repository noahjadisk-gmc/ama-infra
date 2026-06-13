(function () {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll(
    '.mobile-nav__link, .mobile-nav__cta a, .mobile-nav__call'
  );

  function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 6);
  }

  updateHeaderScroll();
  window.addEventListener('scroll', updateHeaderScroll, { passive: true });

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

  /* Actieve sectie in navigatie */
  var sectionEls = Array.prototype.slice.call(
    document.querySelectorAll('main section[id], main .hero')
  );
  var navLinks = document.querySelectorAll('.header__nav-link, .mobile-nav__link');

  if (sectionEls.length && navLinks.length && 'IntersectionObserver' in window) {
    var linkMap = {};

    navLinks.forEach(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      if (!id) return;
      linkMap[id] = linkMap[id] || [];
      linkMap[id].push(link);
    });

    function setActiveSection(id) {
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
      });

      if (!id || !linkMap[id]) return;

      linkMap[id].forEach(function (link) {
        link.classList.add('is-active');
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (!visible.length) return;

        var id = visible[0].target.id || 'hero';
        setActiveSection(id);
      },
      {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.55],
      }
    );

    sectionEls.forEach(function (section) {
      if (!section.id) {
        section.id = 'hero';
      }
      observer.observe(section);
    });

    setActiveSection('hero');
  }
})();
