(function () {
  'use strict';

  var ABOUT_STATS = [
    { value: '3+', label: 'jaar actief in glasvezel' },
    { value: '2.610+', label: 'aansluitingen gerealiseerd' },
    { value: '300+', label: 'storingen opgelost' },
    { value: 'Noord-Holland', label: 'Actief in', variant: 'region' },
  ];

  var ABOUT_EXPERTISE = [
    'Huisaansluitingen en aanlegsets',
    'Storing, schade & herstel',
    'DP-, POP- en OAP-werkzaamheden',
    'Direct contact en korte lijnen',
    'Particulier en zakelijk inzetbaar',
  ];

  function renderProofPanel() {
    var root = document.getElementById('about-proof');
    if (!root) return;

    var statsHtml = ABOUT_STATS.map(function (stat) {
      var variantClass = stat.variant ? ' about-proof__stat--' + stat.variant : '';
      return (
        '<div class="about-proof__stat' +
        variantClass +
        '">' +
        '<span class="about-proof__stat-value">' +
        stat.value +
        '</span>' +
        '<span class="about-proof__stat-label">' +
        stat.label +
        '</span>' +
        '</div>'
      );
    }).join('');

    var expertiseHtml = ABOUT_EXPERTISE.map(function (item) {
      return '<li class="about-proof__expertise-item">' + item + '</li>';
    }).join('');

    root.innerHTML =
      '<p class="about-proof__kicker">Bewezen in de praktijk</p>' +
      '<div class="about-proof__stats">' +
      statsHtml +
      '</div>' +
      '<div class="about-proof__divider" aria-hidden="true"></div>' +
      '<ul class="about-proof__expertise" aria-label="Expertise">' +
      expertiseHtml +
      '</ul>';
  }

  renderProofPanel();
})();
