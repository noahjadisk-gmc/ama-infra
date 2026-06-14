(function () {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.site-header__menu');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll(
    '.mobile-nav__link, .mobile-nav__cta a'
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

  /* Scroll met korte delay */
  var SCROLL_DELAY_MS = 180;
  var SCROLL_DURATION_MS = 700;

  function getScrollOffset() {
    var headerEl = document.querySelector('.site-header');
    return (headerEl ? headerEl.offsetHeight : 88) + 16;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScrollTo(top) {
    var start = window.scrollY;
    var distance = top - start;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / SCROLL_DURATION_MS, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      window.scrollTo(0, top);
      return;
    }

    setTimeout(function () {
      animateScrollTo(top);
    }, SCROLL_DELAY_MS);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);

    if (history.replaceState) {
      history.replaceState(null, '', hash);
    } else {
      location.hash = hash;
    }
  });

  /* Actieve sectie in navigatie */
  var sectionEls = Array.prototype.slice.call(
    document.querySelectorAll('main section[id], main .hero')
  );
  var navLinks = document.querySelectorAll('.nav-link, .mobile-nav__link');

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
