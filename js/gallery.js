(function () {
  'use strict';

  var items = [];
  var currentIndex = 0;
  var lightbox = null;
  var lastFocus = null;

  function renderPhoto(item, index) {
    var badge = item.featured
      ? '<span class="bento__badge">Werk op locatie · Amsterdam</span>'
      : '';

    var featuredClass = item.featured ? ' bento__cell--featured' : '';

    return (
      '<figure class="bento__cell bento__cell--photo' +
      featuredClass +
      '">' +
      badge +
      '<button type="button" class="bento__trigger" data-index="' +
      index +
      '" aria-label="Vergroot: ' +
      item.caption +
      '">' +
      '<img class="bento__img" src="' +
      item.src +
      '" alt="' +
      item.alt +
      '" loading="lazy" width="1600" height="900">' +
      '</button>' +
      '<figcaption class="bento__meta">' +
      '<span class="bento__caption-accent" aria-hidden="true"></span>' +
      '<span class="bento__label">' +
      item.caption +
      '</span>' +
      '</figcaption>' +
      '</figure>'
    );
  }

  function renderBlock(group, startIndex) {
    var photos = group.items
      .map(function (item, i) {
        return renderPhoto(item, startIndex + i);
      })
      .join('');

    return (
      '<section class="bento-block" aria-label="' +
      group.label +
      '">' +
      '<h3 class="bento-block__label">' +
      group.label +
      '</h3>' +
      '<div class="bento-block__grid bento-block__grid--' +
      group.layout +
      '">' +
      photos +
      '</div>' +
      '</section>'
    );
  }

  function createLightbox() {
    var el = document.createElement('div');
    el.className = 'lightbox';
    el.id = 'bento-lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Vergrote foto');
    el.hidden = true;
    el.innerHTML =
      '<div class="lightbox__backdrop" data-close></div>' +
      '<div class="lightbox__panel">' +
      '<button type="button" class="lightbox__close" aria-label="Sluiten">' +
      '<span aria-hidden="true">&times;</span>' +
      '</button>' +
      '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Vorige foto">' +
      '<span aria-hidden="true">&larr;</span>' +
      '</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" src="" alt="">' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      '</figure>' +
      '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Volgende foto">' +
      '<span aria-hidden="true">&rarr;</span>' +
      '</button>' +
      '</div>';
    document.body.appendChild(el);
    return el;
  }

  function showSlide(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    var img = lightbox.querySelector('.lightbox__img');
    var caption = lightbox.querySelector('.lightbox__caption');
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption;

    var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    var nextBtn = lightbox.querySelector('.lightbox__nav--next');
    var hideNav = items.length <= 1;
    prevBtn.hidden = hideNav;
    nextBtn.hidden = hideNav;
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    showSlide(index);
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function bindLightbox() {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function () {
      showSlide(currentIndex - 1);
    });
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function () {
      showSlide(currentIndex + 1);
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
  }

  function initBento() {
    var root = document.getElementById('werk-bento');
    var data = window.AMA_BENTO;
    if (!root || !data || !data.groups) return;

    items = [];
    data.groups.forEach(function (group) {
      group.items.forEach(function (item) {
        items.push(item);
      });
    });

    var index = 0;
    var html = '';

    html += renderBlock(data.groups[0], index);
    index += data.groups[0].items.length;

    html += '<div class="bento__row">';
    html += renderBlock(data.groups[1], index);
    index += data.groups[1].items.length;
    html += renderBlock(data.groups[2], index);
    html += '</div>';

    root.innerHTML = html;

    root.addEventListener('click', function (e) {
      var trigger = e.target.closest('.bento__trigger');
      if (!trigger) return;
      openLightbox(parseInt(trigger.dataset.index, 10));
    });

    if (!document.getElementById('bento-lightbox')) {
      lightbox = createLightbox();
      bindLightbox();
    } else {
      lightbox = document.getElementById('bento-lightbox');
    }
  }

  document.addEventListener('DOMContentLoaded', initBento);
})();
