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

    document.querySelectorAll('[data-contact="address"]').forEach(function (el) {
      el.textContent = CONTACT.address;
    });

    document.querySelectorAll('[data-contact="maps-link"]').forEach(function (el) {
      el.href = CONTACT.mapsUrl;
    });

    document.querySelectorAll('[data-contact="phone-value"]').forEach(function (el) {
      if (hasPhone()) {
        el.textContent = CONTACT.phoneLabel || CONTACT.phoneHref.replace(/^tel:/, '');
        el.classList.remove('contact-detail__value--pending');
        el.href = CONTACT.phoneHref;
        el.removeAttribute('aria-disabled');
      } else {
        el.textContent = CONTACT.phoneLabel || 'Nog toevoegen';
        el.classList.add('contact-detail__value--pending');
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
      }
    });

    document.querySelectorAll('[data-contact="call-btn-pending"]').forEach(function (el) {
      el.hidden = hasPhone();
    });

    document.querySelectorAll('[data-contact="header-call-btn"]').forEach(function (el) {
      if (hasPhone()) {
        el.href = CONTACT.phoneHref;
        el.hidden = false;
      } else {
        el.hidden = true;
        el.removeAttribute('href');
      }
    });

    document.querySelectorAll('[data-contact="mobile-nav-call"]').forEach(function (el) {
      if (hasPhone()) {
        el.href = CONTACT.phoneHref;
        el.hidden = false;
      } else {
        el.hidden = true;
        el.removeAttribute('href');
      }
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
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 2C6.48 2 2 6.25 2 11.54c0 1.87.52 3.69 1.5 5.28L2 22l5.45-1.43A9.72 9.72 0 0 0 12 20.08c5.52 0 10-4.25 10-9.54S17.52 2 12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M8.5 9.5c.28-.62 1.02-.28 1.62-.1.45.14.98.42 1.08.95.1.53-.08 1.18.22 1.58.3.4 1.05.55 1.45.85.4.3.62.95 1.02 1.05.4.1 1.05-.25 1.35-.55.3-.3.45-.75.35-1.05-.1-.3-.75-.75-1.05-1.05-.3-.3-.65-.15-.95.05-.3.2-.75.55-1.05.45-.3-.1-.75-.75-1.05-1.15-.3-.4-.05-.75.15-1.05.2-.3.45-.75.55-1.05.1-.3-.05-.55-.25-.75-.2-.2-.55-.45-.75-.65-.2-.2-.4-.15-.55-.05-.15.1-.55.35-.75.55-.2.2-.35.45-.25.75.1.3.45.75.55 1.05Z" fill="currentColor"/>' +
      '</svg></span>' +
      '<span class="whatsapp-float__label">WhatsApp</span>';

    document.body.appendChild(btn);
  }

  /* ── Mobiele sticky action bar ── */

  function createStickyBar() {
    var actions = [];

    if (hasPhone()) {
      actions.push({
        href: CONTACT.phoneHref,
        label: 'Bel direct',
        icon: 'phone',
        primary: true,
      });
    }

    if (hasWhatsApp()) {
      actions.push({
        href: getWhatsAppUrl(),
        label: 'WhatsApp',
        icon: 'whatsapp',
        external: true,
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
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M12 2C6.48 2 2 6.25 2 11.54c0 1.87.52 3.69 1.5 5.28L2 22l5.45-1.43A9.72 9.72 0 0 0 12 20.08c5.52 0 10-4.25 10-9.54S17.52 2 12 2Z" stroke="currentColor" stroke-width="1.5"/>' +
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

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

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

    if (!payload.email && !payload.phone) {
      errors.push({
        field: 'email',
        message: 'Vul een e-mailadres of telefoonnummer in.',
      });
      errors.push({
        field: 'phone',
        message: 'Vul een telefoonnummer of e-mailadres in.',
      });
    } else {
      if (payload.email && !isValidEmail(payload.email)) {
        errors.push({ field: 'email', message: 'Vul een geldig e-mailadres in.' });
      }
      if (payload.phone && !isValidPhone(payload.phone)) {
        errors.push({ field: 'phone', message: 'Vul een geldig telefoonnummer in.' });
      }
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
