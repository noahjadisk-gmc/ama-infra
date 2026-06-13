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
    var metaEl = root.querySelector('.gallery__content-meta');
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
            '<span class="gallery__tab-node" aria-hidden="true"></span>' +
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
      metaEl.textContent = tab.meta;

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

  function initHeroStrip() {
    var strip = document.querySelector('.hero__strip');
    if (!strip || !window.AMA_HERO) return;

    strip.innerHTML = window.AMA_HERO.strip
      .map(function (item) {
        return (
          '<a href="#werk" class="hero__strip-item" data-tab="' +
          item.tab +
          '">' +
          '<span class="hero__strip-frame">' +
          '<img src="' +
          item.src +
          '" alt="' +
          item.alt +
          '" loading="lazy" width="80" height="60">' +
          '</span>' +
          '<span class="hero__strip-label">' +
          item.label +
          '</span>' +
          '</a>'
        );
      })
      .join('');

    strip.addEventListener('click', function (e) {
      var link = e.target.closest('[data-tab]');
      if (!link) return;
      e.preventDefault();
      window.AMA_PENDING_TAB = link.dataset.tab;
      var target = document.getElementById('werk');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.setTimeout(activatePendingTab, 450);
    });
  }

  function activatePendingTab() {
    if (!window.AMA_PENDING_TAB) return;
    var tabBtn = document.getElementById('gallery-tab-' + window.AMA_PENDING_TAB);
    if (tabBtn) {
      tabBtn.click();
      window.AMA_PENDING_TAB = null;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGallery();
    initHeroStrip();

    if (window.location.hash === '#werk') {
      window.setTimeout(activatePendingTab, 100);
    }

    window.addEventListener('hashchange', activatePendingTab);
  });

  window.AMA_activateGalleryTab = function (tabId) {
    window.AMA_PENDING_TAB = tabId;
    activatePendingTab();
  };
})();
