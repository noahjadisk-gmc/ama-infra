(function () {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta a');

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
})();
