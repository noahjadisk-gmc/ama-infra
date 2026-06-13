(function () {
  'use strict';

  var groups = [];
  var activeGroup = 0;
  var activeIndex = 0;
  var lightbox = null;
  var lastFocus = null;
  var root = null;

  function flatItems() {
    var items = [];
    groups.forEach(function (group) {
      group.items.forEach(function (item) {
        items.push(item);
      });
    });
    return items;
  }

  function globalIndex(groupIdx, itemIdx) {
    var index = 0;
    for (var g = 0; g < groupIdx; g++) {
      index += groups[g].items.length;
    }
    return index + itemIdx;
  }

  function renderTabs() {
    return groups
      .map(function (group, i) {
        return (
          '<button type="button" class="gallery__tab' +
          (i === activeGroup ? ' is-active' : '') +
          '" role="tab" aria-selected="' +
          (i === activeGroup) +
          '" aria-controls="gallery-panel-' +
          i +
          '" id="gallery-tab-' +
          i +
          '" data-group="' +
          i +
          '">' +
          group.label +
          '</button>'
        );
      })
      .join('');
  }

  function renderFilmstrip(groupIdx) {
    var group = groups[groupIdx];
    return group.items
      .map(function (item, i) {
        return (
          '<button type="button" class="gallery__thumb' +
          (i === activeIndex ? ' is-active' : '') +
          '" data-group="' +
          groupIdx +
          '" data-index="' +
          i +
          '" aria-label="' +
          item.caption +
          '">' +
          '<img src="' +
          item.src +
          '" alt="" loading="lazy" width="320" height="180">' +
          '</button>'
        );
      })
      .join('');
  }

  function renderStage() {
    var group = groups[activeGroup];
    var item = group.items[activeIndex];

    return (
      '<div class="gallery__stage" id="gallery-panel-' +
      activeGroup +
      '" role="tabpanel" aria-labelledby="gallery-tab-' +
      activeGroup +
      '">' +
      '<div class="gallery__split">' +
      '<figure class="gallery__main">' +
      '<button type="button" class="gallery__zoom" data-lightbox="' +
      globalIndex(activeGroup, activeIndex) +
      '" aria-label="Vergroot: ' +
      item.caption +
      '">' +
      '<img class="gallery__main-img" src="' +
      item.src +
      '" alt="' +
      item.alt +
      '" width="1600" height="900">' +
      '</button>' +
      '<figcaption class="gallery__caption">' +
      '<span class="gallery__caption-accent" aria-hidden="true"></span>' +
      item.caption +
      '</figcaption>' +
      '</figure>' +
      '<div class="gallery__info">' +
      '<span class="gallery__info-accent" aria-hidden="true"></span>' +
      '<h3 class="gallery__info-title">' +
      group.title +
      '</h3>' +
      '<p class="gallery__info-text">' +
      group.copy +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="gallery__filmstrip" role="list" aria-label="Miniaturen">' +
      renderFilmstrip(activeGroup) +
      '</div>' +
      '</div>'
    );
  }

  function render() {
    root.innerHTML =
      '<div class="gallery__tabs" role="tablist" aria-label="Categorieën">' +
      renderTabs() +
      '</div>' +
      renderStage();
  }

  function setActive(groupIdx, itemIdx) {
    activeGroup = groupIdx;
    activeIndex = itemIdx;
    render();
  }

  function createLightbox() {
    var el = document.createElement('div');
    el.className = 'lightbox';
    el.id = 'gallery-lightbox';
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

  var lbIndex = 0;

  function showSlide(index) {
    var items = flatItems();
    if (!items.length) return;
    lbIndex = (index + items.length) % items.length;
    var item = items[lbIndex];
    lightbox.querySelector('.lightbox__img').src = item.src;
    lightbox.querySelector('.lightbox__img').alt = item.alt;
    lightbox.querySelector('.lightbox__caption').textContent = item.caption;
    var hideNav = items.length <= 1;
    lightbox.querySelector('.lightbox__nav--prev').hidden = hideNav;
    lightbox.querySelector('.lightbox__nav--next').hidden = hideNav;
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    showSlide(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function bindLightbox() {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function () {
      showSlide(lbIndex - 1);
    });
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function () {
      showSlide(lbIndex + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showSlide(lbIndex - 1);
      if (e.key === 'ArrowRight') showSlide(lbIndex + 1);
    });
  }

  function bindGallery() {
    root.addEventListener('click', function (e) {
      var tab = e.target.closest('.gallery__tab');
      if (tab) {
        setActive(parseInt(tab.dataset.group, 10), 0);
        return;
      }

      var thumb = e.target.closest('.gallery__thumb');
      if (thumb) {
        setActive(parseInt(thumb.dataset.group, 10), parseInt(thumb.dataset.index, 10));
        return;
      }

      var zoom = e.target.closest('.gallery__zoom');
      if (zoom) {
        openLightbox(parseInt(zoom.dataset.lightbox, 10));
      }
    });
  }

  function initGallery() {
    root = document.getElementById('werk-gallery');
    var data = window.AMA_BENTO;
    if (!root || !data || !data.groups) return;

    groups = data.groups;
    activeGroup = 0;
    activeIndex = 0;

    render();
    bindGallery();

    if (!document.getElementById('gallery-lightbox')) {
      lightbox = createLightbox();
      bindLightbox();
    } else {
      lightbox = document.getElementById('gallery-lightbox');
    }
  }

  document.addEventListener('DOMContentLoaded', initGallery);
})();
