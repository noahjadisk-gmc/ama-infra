(function () {
  'use strict';

  if (typeof CONTACT === 'undefined') return;

  var STICKY_BAR_HEIGHT = '3.75rem';

  function isNonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function hasPhone() {
    return isNonEmpty(CONTACT.phoneHref);
  }

  function hasWhatsApp() {
    return isNonEmpty(CONTACT.whatsappNumber);
  }

  function hasGoogleReview() {
    return isNonEmpty(CONTACT.googleReviewUrl);
  }

  function getWhatsAppUrl() {
    if (!hasWhatsApp()) return '';
    var digits = CONTACT.whatsappNumber.replace(/\D/g, '');
    var text = encodeURIComponent(CONTACT.whatsappMessage || '');
    return 'https://wa.me/' + digits + (text ? '?text=' + text : '');
  }

  function getMailtoUrl(subject) {
    var base = 'mailto:' + encodeURIComponent(CONTACT.email);
    if (subject) {
      return base + '?subject=' + encodeURIComponent(subject);
    }
    return base;
  }

  /* ── Contactgegevens invullen ── */

  function bindContactDetails() {
    document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
      el.textContent = CONTACT.email;
      if (el.tagName === 'A') {
        el.href = getMailtoUrl();
      }
    });

    document.querySelectorAll('[data-contact="email-link"]').forEach(function (el) {
      el.href = getMailtoUrl();
    });

    document.querySelectorAll('[data-contact="whatsapp-link"]').forEach(function (el) {
      if (hasWhatsApp()) {
        el.href = getWhatsAppUrl();
        el.hidden = false;
        el.removeAttribute('aria-disabled');
      } else {
        el.hidden = true;
        el.removeAttribute('href');
      }
    });

    document.querySelectorAll('[data-contact="address"]').forEach(function (el) {
      el.textContent = CONTACT.address;
    });

    document.querySelectorAll('[data-contact="maps-link"]').forEach(function (el) {
      el.href = CONTACT.mapsUrl;
    });

    document.querySelectorAll('[data-contact="phone-value"]').forEach(function (el) {
      if (hasPhone()) {
        el.textContent = CONTACT.phoneLabel || CONTACT.phoneHref.replace(/^tel:/, '');
        el.classList.remove('contact-aside__detail-value--pending');
        el.href = CONTACT.phoneHref;
        el.removeAttribute('aria-disabled');
      } else {
        el.textContent = CONTACT.phoneLabel || 'Nog toevoegen';
        el.classList.add('contact-aside__detail-value--pending');
        el.removeAttribute('href');
        el.setAttribute('aria-disabled', 'true');
      }
    });

    document.querySelectorAll('[data-contact="call-btn"]').forEach(function (el) {
      if (hasPhone()) {
        el.href = CONTACT.phoneHref;
        el.hidden = false;
        el.removeAttribute('aria-disabled');
      } else {
        el.hidden = true;
        el.removeAttribute('href');
        el.setAttribute('aria-disabled', 'true');
      }
    });

    document.querySelectorAll('[data-contact="call-btn-pending"]').forEach(function (el) {
      el.hidden = hasPhone();
    });

  }

  /* ── Review CTA ── */

  function bindReviewCta() {
    var slot = document.querySelector('[data-contact="review-cta"]');
    if (!slot) return;

    slot.innerHTML = '';

    if (hasGoogleReview()) {
      var link = document.createElement('a');
      link.href = CONTACT.googleReviewUrl;
      link.className = 'btn btn--secondary';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Review achterlaten';
      slot.appendChild(link);
      return;
    }

    var pending = document.createElement('span');
    pending.className = 'experience-panel__pending-cta';
    pending.textContent = 'Reviewlink volgt';
    slot.appendChild(pending);
  }

  /* ── WhatsApp floating CTA ── */

  function createWhatsAppFloat() {
    if (!hasWhatsApp()) return;

    var url = getWhatsAppUrl();
    if (!url) return;

    var btn = document.createElement('a');
    btn.className = 'whatsapp-float';
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'WhatsApp AMA Infra');
    btn.innerHTML =
      '<span class="whatsapp-float__icon" aria-hidden="true">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>' +
      '</svg></span>' +
      '<span class="whatsapp-float__label">WhatsApp</span>';

    document.body.appendChild(btn);
    initWhatsAppFloatVisibility(btn);
  }

  function initWhatsAppFloatVisibility(floatBtn) {
    if (!floatBtn) return;

    var contactSection = document.getElementById('contact');
    var footer = document.querySelector('.footer');
    if (!contactSection && !footer) return;

    function syncVisibility() {
      if (window.matchMedia('(max-width: 767px)').matches) {
        floatBtn.classList.remove('whatsapp-float--hidden');
        floatBtn.setAttribute('aria-hidden', 'false');
        floatBtn.removeAttribute('tabindex');
        return;
      }

      var viewportBottom =
        (window.scrollY || document.documentElement.scrollTop) +
        (window.innerHeight || document.documentElement.clientHeight);
      var hidden = false;

      if (contactSection) {
        hidden = viewportBottom >= contactSection.offsetTop + 64;
      }

      if (!hidden && footer) {
        hidden = viewportBottom >= footer.offsetTop;
      }

      floatBtn.classList.toggle('whatsapp-float--hidden', hidden);
      if (hidden) {
        floatBtn.setAttribute('aria-hidden', 'true');
        floatBtn.setAttribute('tabindex', '-1');
      } else {
        floatBtn.setAttribute('aria-hidden', 'false');
        floatBtn.removeAttribute('tabindex');
      }
    }

    window.addEventListener('scroll', syncVisibility, { passive: true });
    window.addEventListener('resize', syncVisibility, { passive: true });
    window.addEventListener('load', syncVisibility);
    window.addEventListener('hashchange', syncVisibility);
    syncVisibility();
    setTimeout(syncVisibility, 350);
  }

  /* ── Mobiele sticky action bar ── */

  function createStickyBar() {
    var actions = [];

    if (hasWhatsApp()) {
      actions.push({
        href: getWhatsAppUrl(),
        label: 'WhatsApp',
        icon: 'whatsapp',
        primary: true,
        external: true,
      });
    }

    if (hasPhone()) {
      actions.push({
        href: CONTACT.phoneHref,
        label: 'Bel direct',
        icon: 'phone',
        primary: !hasWhatsApp(),
      });
    }

    actions.push({
      href: getMailtoUrl('Contact via website'),
      label: 'E-mail',
      icon: 'mail',
    });

    var showBar = actions.length > 1 || (actions.length === 1 && actions[0].icon === 'mail');
    if (!showBar) return;

    var bar = document.createElement('nav');
    bar.className = 'sticky-actions';
    bar.setAttribute('aria-label', 'Snelle contactacties');
    bar.style.setProperty('--sticky-actions-h', STICKY_BAR_HEIGHT);

    var inner = document.createElement('div');
    inner.className = 'sticky-actions__inner container';

    actions.forEach(function (action) {
      var link = document.createElement('a');
      link.className =
        'sticky-actions__btn' + (action.primary ? ' sticky-actions__btn--primary' : '');
      link.href = action.href;
      link.innerHTML =
        '<span class="sticky-actions__icon" aria-hidden="true">' +
        getStickyIcon(action.icon) +
        '</span>' +
        '<span class="sticky-actions__text">' +
        action.label +
        '</span>';

      if (action.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }

      inner.appendChild(link);
    });

    bar.appendChild(inner);
    document.body.appendChild(bar);
    document.body.classList.add('has-sticky-actions');
  }

  function getStickyIcon(type) {
    if (type === 'phone') {
      return (
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M6.5 4h3l1.5 5-2 1.2c1.2 2.4 3.1 4.3 5.5 5.5L16 14l5 1.5v3c0 .6-.4 1-1 1C9.6 19.5 4.5 14.4 4.5 5c0-.6.4-1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        '</svg>'
      );
    }
    if (type === 'whatsapp') {
      return (
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>' +
        '</svg>'
      );
    }
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M4 6h16v12H4V6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  /* ── Contactformulier ── */

  function initCustomSelects(form) {
    var wraps = form.querySelectorAll('[data-form-select]');
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
      var select = wrap.querySelector('select');
      if (!select || wrap.dataset.enhanced === 'true') return;

      wrap.dataset.enhanced = 'true';

      var label = form.querySelector('[for="' + select.id + '"]');
      var labelId = label ? label.id : '';

      select.classList.add('form-select__native');
      select.tabIndex = -1;

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'form-select__trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (labelId) {
        trigger.setAttribute('aria-labelledby', labelId + ' ' + select.id + '-value');
      }

      var valueEl = document.createElement('span');
      valueEl.className = 'form-select__value form-select__value--placeholder';
      valueEl.id = select.id + '-value';

      var chevron = document.createElement('span');
      chevron.className = 'form-select__chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
        '<path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

      trigger.appendChild(valueEl);
      trigger.appendChild(chevron);

      var list = document.createElement('ul');
      list.className = 'form-select__list';
      list.setAttribute('role', 'listbox');
      list.id = select.id + '-listbox';
      trigger.setAttribute('aria-controls', list.id);
      list.hidden = true;

      var options = [];
      Array.prototype.forEach.call(select.options, function (option) {
        if (!option.value) return;

        var item = document.createElement('li');
        item.className = 'form-select__option';
        item.setAttribute('role', 'option');
        item.setAttribute('data-value', option.value);
        item.setAttribute('aria-selected', option.selected ? 'true' : 'false');
        item.tabIndex = -1;
        item.innerHTML =
          '<span class="form-select__option-text">' +
          option.textContent +
          '</span>' +
          '<span class="form-select__option-mark" aria-hidden="true">✓</span>';
        list.appendChild(item);
        options.push(item);
      });

      wrap.appendChild(trigger);
      wrap.appendChild(list);

      var focusedIndex = -1;

      function getPlaceholder() {
        var first = select.options[0];
        return first && !first.value ? first.textContent : 'Kies een optie';
      }

      function syncFromSelect() {
        var selected = select.options[select.selectedIndex];
        var hasValue = selected && selected.value;

        valueEl.textContent = hasValue ? selected.textContent : getPlaceholder();
        valueEl.classList.toggle('form-select__value--placeholder', !hasValue);

        options.forEach(function (item) {
          var isSelected = item.getAttribute('data-value') === select.value;
          item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
      }

      function setValue(value) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncFromSelect();
      }

      function closeList() {
        wrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        list.hidden = true;
        focusedIndex = -1;
        options.forEach(function (item) {
          item.classList.remove('is-focused');
        });
      }

      function openList() {
        wrap.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        list.hidden = false;

        var selectedIndex = options.findIndex(function (item) {
          return item.getAttribute('aria-selected') === 'true';
        });
        focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        focusOption(focusedIndex, false);
      }

      function focusOption(index, scrollIntoView) {
        if (!options.length) return;

        focusedIndex = (index + options.length) % options.length;
        options.forEach(function (item, i) {
          item.classList.toggle('is-focused', i === focusedIndex);
        });

        if (scrollIntoView !== false) {
          options[focusedIndex].scrollIntoView({ block: 'nearest' });
        }
      }

      function chooseFocused() {
        if (focusedIndex < 0 || !options[focusedIndex]) return;
        setValue(options[focusedIndex].getAttribute('data-value'));
        closeList();
        trigger.focus();
      }

      trigger.addEventListener('click', function () {
        if (wrap.classList.contains('is-open')) {
          closeList();
        } else {
          openList();
        }
      });

      options.forEach(function (item, index) {
        item.addEventListener('click', function () {
          setValue(item.getAttribute('data-value'));
          closeList();
          trigger.focus();
        });

        item.addEventListener('mousemove', function () {
          focusedIndex = index;
          options.forEach(function (opt, i) {
            opt.classList.toggle('is-focused', i === index);
          });
        });
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (!wrap.classList.contains('is-open')) {
            openList();
            return;
          }
          focusOption(focusedIndex + 1);
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          if (!wrap.classList.contains('is-open')) {
            openList();
            return;
          }
          focusOption(focusedIndex - 1);
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!wrap.classList.contains('is-open')) {
            openList();
            return;
          }
          chooseFocused();
        }

        if (event.key === 'Escape') {
          closeList();
        }
      });

      list.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          closeList();
          trigger.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (!wrap.contains(event.target)) {
          closeList();
        }
      });

      select.addEventListener('change', function () {
        syncFromSelect();

        if (!select.value) return;

        wrap.classList.remove('form-select--error');
        select.classList.remove('form-field__input--error');
        select.removeAttribute('aria-invalid');

        var group = select.closest('.form-field');
        if (!group) return;

        var msg = group.querySelector('.form-field__error');
        if (msg) {
          msg.textContent = '';
          msg.hidden = true;
        }
      });
      syncFromSelect();
    });
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    initCustomSelects(form);

    var successEl = document.getElementById('contact-form-success');
    var errorEl = document.getElementById('contact-form-error');
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearFormMessages(form, errorEl, successEl);

      var payload = collectFormPayload(form);
      var errors = validatePayload(payload);

      if (errors.length) {
        applyFieldErrors(form, errors);
        showFormError(errorEl, 'Controleer de gemarkeerde velden en probeer het opnieuw.');
        return;
      }

      clearFieldErrors(form);
      setSubmitting(submitBtn, true);

      handleSubmit(payload)
        .then(function () {
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.focus();
          }
        })
        .catch(function () {
          showFormError(
            errorEl,
            'Er ging iets mis bij het versturen. Probeer het later opnieuw of stuur een e-mail naar ' +
              CONTACT.email +
              '.'
          );
        })
        .finally(function () {
          setSubmitting(submitBtn, false);
        });
    });
  }

  function collectFormPayload(form) {
    return {
      name: getFieldValue(form, 'name'),
      phone: getFieldValue(form, 'phone'),
      email: getFieldValue(form, 'email'),
      requestType: getFieldValue(form, 'requestType'),
      message: getFieldValue(form, 'message'),
    };
  }

  function getFieldValue(form, name) {
    var field = form.elements.namedItem(name);
    if (!field) return '';
    return String(field.value || '').trim();
  }

  function validatePayload(payload) {
    var errors = [];

    if (!payload.name) {
      errors.push({ field: 'name', message: 'Vul uw naam in.' });
    }

    if (!payload.email) {
      errors.push({ field: 'email', message: 'Vul een e-mailadres in.' });
    } else if (!isValidEmail(payload.email)) {
      errors.push({ field: 'email', message: 'Vul een geldig e-mailadres in.' });
    }

    if (payload.phone && !isValidPhone(payload.phone)) {
      errors.push({ field: 'phone', message: 'Vul een geldig telefoonnummer in.' });
    }

    if (!payload.requestType) {
      errors.push({ field: 'requestType', message: 'Kies een type aanvraag.' });
    }

    if (!payload.message) {
      errors.push({ field: 'message', message: 'Vul een bericht in.' });
    } else if (payload.message.length < 10) {
      errors.push({
        field: 'message',
        message: 'Beschrijf uw aanvraag in minimaal 10 tekens.',
      });
    }

    return errors;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 8;
  }

  function applyFieldErrors(form, errors) {
    errors.forEach(function (error) {
      var field = form.elements.namedItem(error.field);
      if (!field) return;

      field.setAttribute('aria-invalid', 'true');
      field.classList.add('form-field__input--error');

      var selectWrap = field.closest('.form-select');
      if (selectWrap) {
        selectWrap.classList.add('form-select--error');
      }

      var group = field.closest('.form-field');
      if (!group) return;

      var msg = group.querySelector('.form-field__error');
      if (msg) {
        msg.textContent = error.message;
        msg.hidden = false;
      }
    });
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.form-field__input--error').forEach(function (el) {
      el.classList.remove('form-field__input--error');
      el.removeAttribute('aria-invalid');
    });

    form.querySelectorAll('.form-select--error').forEach(function (el) {
      el.classList.remove('form-select--error');
    });

    form.querySelectorAll('.form-field__error').forEach(function (el) {
      el.textContent = '';
      el.hidden = true;
    });
  }

  function clearFormMessages(form, errorEl, successEl) {
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    if (successEl) {
      successEl.hidden = true;
    }
  }

  function showFormError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
    errorEl.focus();
  }

  function setSubmitting(button, isSubmitting) {
    if (!button) return;
    button.disabled = isSubmitting;
    button.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
    button.textContent = isSubmitting ? 'Versturen…' : 'Aanvraag versturen';
  }

  /**
   * Verstuur contactformulier naar backend.
   * TODO: Vervang door POST naar API (Resend, Formspree, /api/contact, etc.).
   * Payload: { name, phone, email, requestType, message }
   */
  function handleSubmit(payload) {
    return new Promise(function (resolve, reject) {
      if (!payload || !payload.name) {
        reject(new Error('Invalid payload'));
        return;
      }

      /* TODO: Implementeer server-side verzending, bijv.:
       * fetch('/api/contact', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   body: JSON.stringify(payload),
       * }).then(res => res.ok ? resolve() : reject());
       */

      void payload;
      resolve();
    });
  }

  /* ── Init ── */

  bindContactDetails();
  bindReviewCta();
  createWhatsAppFloat();
  createStickyBar();
  initContactForm();
})();
