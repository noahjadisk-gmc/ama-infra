/**
 * AMA Infra gallery data.
 * Photo paths: images/ama/{category}/{filename}.jpg
 */
window.AMA_GALLERY = {
  tabs: [
    {
      id: 'aanleg',
      label: 'Aanleg',
      title: 'Aanleg van glasvezeltrajecten',
      text: 'Bij aanlegwerk draait het om een nette voorbereiding, duidelijke kabelrouting en zorgvuldig uitgevoerd grondwerk. AMA Infra ondersteunt bij het aanleggen van glasvezeltrajecten voor woningen, bedrijfspanden en lokale infrastructuur.',
      bullets: [
        'Sleufwerk en kabelrouting op locatie',
        'Aansluiting op bestaande infrastructuur',
      ],
      meta: 'Amsterdam · Aanleg',
      images: [
        {
          src: 'images/ama/aanleg/aanleg-01-lange-sleuf-straatwerk.jpg',
          alt: 'Lange sleuf voor glasvezelaanleg langs straatwerk in Amsterdam',
          caption: 'AANLEG / STRAATWERK',
        },
      ],
    },
    {
      id: 'installatie',
      label: 'Installatie',
      title: 'Installatie en huisaansluitingen',
      text: 'Van straat tot pand wordt de aansluiting zorgvuldig voorbereid en uitgevoerd. AMA Infra helpt met huisaansluitingen, aansluitpunten en technische installatie op locatie.',
      bullets: [
        'Huisaansluiting van straat tot pand',
        'Controle en oplevering aansluitpunt',
      ],
      meta: 'Amsterdam · Installatie',
      images: [
        {
          src: 'images/ama/installatie/installatie-01-huisaansluiting-kabelhaspel.jpg',
          alt: 'Kabelhaspel en sleuf voor huisaansluiting glasvezel',
          caption: 'KABELHASPEL / WONING',
        },
        {
          src: 'images/ama/installatie/installatie-02-woning-aansluiting.jpg',
          alt: 'Werkzaamheden voor glasvezel huisaansluiting bij woning',
          caption: 'HUIS AANSLUITING',
        },
      ],
    },
    {
      id: 'kabelschade',
      label: 'Kabelschade oplossen',
      title: 'Kabelschade en storing oplossen',
      text: 'Bij kabelschade of storing is snel en precies handelen belangrijk. AMA Infra onderzoekt de situatie, lokaliseert het probleem en werkt gericht aan herstel van de verbinding.',
      bullets: [
        'Lokaliseren en herstellen van kabelschade',
        'Snelle oplossing bij storing of geen signaal',
      ],
      meta: 'Amsterdam · Herstel',
      images: [
        {
          src: 'images/ama/kabelschade/kabelschade-01-overzicht-straatwerk.jpg',
          alt: 'Open straatwerk met zichtbare glasvezelkabels voor kabelschade herstel',
          caption: 'KABELSCHADE / OVERZICHT',
        },
        {
          src: 'images/ama/kabelschade/kabelschade-02-open-sleuf-aansluitboxen.jpg',
          alt: 'Open sleuf met glasvezel aansluitboxen en oranje kabels',
          caption: 'AANSLUITBOX / SLEUF',
        },
        {
          src: 'images/ama/kabelschade/kabelschade-03-detail-oranje-kabels.jpg',
          alt: 'Detail van oranje glasvezelkabels en herstelpunten in open grond',
          caption: 'KABELSCHADE / HERSTEL',
        },
      ],
    },
  ],
};

window.AMA_HERO = {
  main: {
    src: 'images/ama/aanleg/aanleg-01-lange-sleuf-straatwerk.jpg',
    alt: 'Glasvezel aanleg en sleufwerk in Amsterdam',
    caption: 'GLASVEZEL / AMSTERDAM',
  },
  strip: [
    {
      src: 'images/ama/aanleg/aanleg-01-lange-sleuf-straatwerk.jpg',
      alt: 'Aanleg glasvezel sleuf',
      label: 'Aanleg',
      tab: 'aanleg',
    },
    {
      src: 'images/ama/installatie/installatie-01-huisaansluiting-kabelhaspel.jpg',
      alt: 'Huisaansluiting installatie',
      label: 'Installatie',
      tab: 'installatie',
    },
    {
      src: 'images/ama/kabelschade/kabelschade-03-detail-oranje-kabels.jpg',
      alt: 'Kabelschade herstel',
      label: 'Herstel',
      tab: 'kabelschade',
    },
  ],
};
