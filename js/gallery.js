(function () {
  'use strict';

  function initGallery() {
    var root = document.getElementById('werk-gallery');
    if (!root || !window.AMA_GALLERY) return;

    var data = window.AMA_GALLERY;
    var activeTab = 0;
    var activeImage = 0;

    var tabsEl = root.querySelector('.gallery__tabs');
    var mainImg = root.querySelector('.gallery__main-img');
    var mainCaption = root.querySelector('.gallery__main-caption');
    var titleEl = root.querySelector('.gallery__content-title');
    var textEl = root.querySelector('.gallery__content-text');
    var bulletsEl = root.querySelector('.gallery__content-bullets');
    var thumbsEl = root.querySelector('.gallery__thumbs');

    function renderTabs() {
      tabsEl.innerHTML = data.tabs
        .map(function (tab, i) {
          return (
            '<button type="button" class="gallery__tab' +
            (i === activeTab ? ' is-active' : '') +
            '" role="tab" aria-selected="' +
            (i === activeTab) +
            '" aria-controls="gallery-panel" id="gallery-tab-' +
            tab.id +
            '" data-index="' +
            i +
            '">' +
            tab.label +
            '</button>'
          );
        })
        .join('');
    }

    function renderThumbs() {
      var images = data.tabs[activeTab].images;
      if (images.length <= 1) {
        thumbsEl.innerHTML = '';
        thumbsEl.hidden = true;
        return;
      }
      thumbsEl.hidden = false;
      thumbsEl.innerHTML = images
        .map(function (img, i) {
          return (
            '<button type="button" class="gallery__thumb' +
            (i === activeImage ? ' is-active' : '') +
            '" aria-label="' +
            img.alt +
            '" data-index="' +
            i +
            '">' +
            '<img src="' +
            img.src +
            '" alt="" loading="lazy" width="120" height="90">' +
            '</button>'
          );
        })
        .join('');
    }

    function renderContent() {
      var tab = data.tabs[activeTab];
      var img = tab.images[activeImage];

      mainImg.classList.add('is-fading');
      window.setTimeout(function () {
        mainImg.src = img.src;
        mainImg.alt = img.alt;
        mainCaption.textContent = img.caption;
        mainImg.classList.remove('is-fading');
      }, 120);

      titleEl.textContent = tab.title;
      textEl.textContent = tab.text;

      bulletsEl.innerHTML = tab.bullets
        .map(function (item) {
          return (
            '<li class="gallery__bullet">' +
            '<span class="gallery__bullet-marker" aria-hidden="true"></span>' +
            item +
            '</li>'
          );
        })
        .join('');

      renderThumbs();
      renderTabs();
    }

    tabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery__tab');
      if (!btn) return;
      var index = parseInt(btn.dataset.index, 10);
      if (index === activeTab) return;
      activeTab = index;
      activeImage = 0;
      renderContent();
    });

    thumbsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery__thumb');
      if (!btn) return;
      activeImage = parseInt(btn.dataset.index, 10);
      renderContent();
    });

    renderContent();
  }

  document.addEventListener('DOMContentLoaded', initGallery);
})();
