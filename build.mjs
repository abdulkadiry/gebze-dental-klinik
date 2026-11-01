// Static site generator: node build.mjs  ->  writes ./site/{tr,en}/...
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, CFG, TEAM, GROUPS, TREATMENTS, FAQ, POSTS } from './src/data.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'site');
const LANGS = ['tr', 'en'];
const GTM_ID = 'GTM-NN5QSFM7';
// Consent Mode default (denied) runs BEFORE GTM; a stored "granted" choice is applied right away.
const GTM_HEAD = `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('gdk_consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
</script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;
const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const S = {
  treatments: T('tedaviler', 'treatments'), tech: T('teknoloji', 'technology'), team: T('doktorlarimiz', 'our-doctors'),
  patients: T('yeni-hastalar', 'new-patients'), blog: T('blog', 'blog'), contact: T('iletisim', 'contact'), privacy: T('gizlilik-kvkk', 'privacy'),
};
const url = (l, key, sub) => `/${l}/${key ? S[key][l] + '/' : ''}${sub ? sub[l] + '/' : ''}`;
const both = (key, sub) => ({ tr: url('tr', key, sub), en: url('en', key, sub) });
const BOOK = () => CFG.bookingUrl + '#highlight-calendar';

const U = {
  nav: { treatments: T('Tedaviler', 'Treatments'), tech: T('Teknoloji', 'Technology'), team: T('Doktorlarımız', 'Our Doctors'), patients: T('Yeni Hastalar', 'New Patients'), blog: T('Blog', 'Blog'), contact: T('İletişim', 'Contact') },
  book: T('Randevu Al', 'Book Appointment'), dir: T('Yol Tarifi', 'Directions'),
  menu: T('Menü', 'Menu'), close: T('Kapat', 'Close'), more: T('Detaylı bilgi', 'Learn more'), skip: T('İçeriğe geç', 'Skip to content'),
  cookies: T('Çerez tercihleri', 'Cookie preferences'),
};
const ICON = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  wa: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z"/><path d="M9 9.500c0 3 2.500 5.500 5.500 5.500l1-1.500-2-1-1 .8a4 4 0 0 1-1.800-1.800l.8-1-1-2L9 9.500z"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.500l4.500 4.500L19 7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const tr = (t, l) => t[l];
const tel = `tel:${CFG.phoneRaw}`;
const wa = `https://wa.me/${CFG.whatsapp}`;
const linkArrow = (href, label, extra = '') => `<a class="link-arrow" href="${href}"${extra}>${label}${ic('arrow')}</a>`;
const EXT = ' target="_blank" rel="noopener"';

const alignerImg = (l) => `<img class="art photo" src="/assets/img/seffaf-plak-800.webp" srcset="/assets/img/seffaf-plak-800.webp 800w, /assets/img/seffaf-plak-1200.webp 1200w" sizes="(min-width:980px) 560px, 100vw" width="800" height="600" loading="lazy" decoding="async" alt="${l === 'tr' ? 'Şeffaf plaklar ve saklama kutusu' : 'Clear aligners in their case'}">`;
const guideImg = (l) => `<img class="art photo" src="/assets/img/cerrahi-guide-800.webp" width="800" height="600" loading="lazy" decoding="async" alt="${l === 'tr' ? 'Cerrahi guide ve implant planlama yazılımı görüntüsü' : 'Surgical guide and implant planning software view'}">`;

const KL = {
  waiting: { f: 'bekleme-800', t: T('Bekleme alanı', 'Waiting area'), d: T('Gün ışığı alan bekleme alanı.', 'A waiting area with plenty of daylight.'), alt: T('Gebze Dental Klinik bekleme alanı: sarı koltuk, bitkiler ve mermer zemin', 'Waiting area of Gebze Dental Klinik with a yellow sofa, plants and marble floor') },
  waiting2: { f: 'bekleme-2-800', t: T('Bekleme alanı', 'Waiting area'), d: T('Kapıdan girince sizi bu alan karşılıyor.', 'This is the first thing you see when you walk in.'), alt: T('Gebze Dental Klinik bekleme alanı: krem rengi koltuklar ve orkideler', 'Waiting area of Gebze Dental Klinik with cream armchairs and orchids') },
  room: { f: 'muayene-800', t: T('Muayene odası', 'Treatment room'), d: T('Muayene ve tedaviler burada yapılır. Ölçüler dijital tarayıcıyla alınır.', 'Examinations and treatments take place here. Impressions are taken with a digital scanner.'), alt: T('Muayene odası: diş ünitesi ve monitör', 'Treatment room with a dental unit and monitor') },
  xray: { f: 'rontgen-800', t: T('Röntgen odası', 'X-ray room'), d: T('Panoramik röntgen klinik içinde çekilir.', 'Panoramic X-rays are taken on site.'), alt: T('Panoramik röntgen cihazı ve bilgisayar', 'Panoramic X-ray unit and computer') },
  prep: { f: 'hazirlik-800', t: T('Hazırlık alanı', 'Preparation area'), d: T('Tedavi malzemeleri bu alanda hazırlanır.', 'Treatment materials are prepared in this area.'), alt: T('Hazırlık ve çalışma tezgâhı', 'Preparation and work counter') },
};
const klCard = (k, l, withText = true) => `<figure class="clinic-card reveal"><div class="zoom"><img src="/assets/img/klinik/${k.f}.webp" alt="${esc(tr(k.alt, l))}" width="800" height="600" loading="lazy" decoding="async"></div><figcaption><strong>${tr(k.t, l)}</strong>${withText ? `<span>${tr(k.d, l)}</span>` : ''}</figcaption></figure>`;

const tByGroup = (g) => TREATMENTS.filter((t) => t.group === g);
const tUrl = (l, t) => url(l, 'treatments', t.slug);
const pUrl = (l, p) => url(l, 'blog', p.slug);
const fmtDate = (d, l) => new Date(d).toLocaleDateString(l === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- structured data ----------
const dentistLd = (l) => ({
  '@context': 'https://schema.org', '@type': 'Dentist', name: CFG.name, legalName: CFG.legalName, url: CFG.siteUrl + `/${l}/`, telephone: CFG.phone,
  image: CFG.siteUrl + '/assets/img/klinik/og-klinik.jpg', logo: CFG.siteUrl + '/assets/logo-stacked.png', hasMap: CFG.mapsUrl,
  geo: { '@type': 'GeoCoordinates', latitude: CFG.geo.lat, longitude: CFG.geo.lng },
  address: { '@type': 'PostalAddress', streetAddress: 'Hacıhalil, 1227. Sk. No: 3B', postalCode: '41400', addressLocality: 'Gebze', addressRegion: 'Kocaeli', addressCountry: 'TR' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:30', closes: '18:00' },
  ],
  sameAs: [CFG.instagram],
  medicalSpecialty: ['Dentistry', 'Orthodontic', 'Pediatric', 'Periodontic'],
  employee: TEAM.doctors.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: 'Dentist' })),
});

// ---------- layout ----------
function layout({ l, alt, title, desc, body, ld = [], cls = '', head = '' }) {
  const other = l === 'tr' ? 'en' : 'tr';
  const full = `${title} | ${CFG.name}`;
  const nav = ['treatments', 'tech', 'team', 'patients', 'blog', 'contact'].map((k) => `<a href="${url(l, k)}" data-nav="${k}">${tr(U.nav[k], l)}</a>`).join('');
  return `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${GTM_HEAD}
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${CFG.siteUrl}${alt[l]}">
<link rel="alternate" hreflang="tr" href="${CFG.siteUrl}${alt.tr}">
<link rel="alternate" hreflang="en" href="${CFG.siteUrl}${alt.en}">
<link rel="alternate" hreflang="x-default" href="${CFG.siteUrl}${alt.tr}">
<meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="${CFG.siteUrl}/assets/img/klinik/og-klinik.jpg">
<meta name="theme-color" content="#FAF8F5">
<link rel="icon" type="image/png" href="/assets/icon.png">
${head}${FONTS}
<link rel="stylesheet" href="/assets/style.css">
${[dentistLd(l), ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body class="${cls}">
${GTM_BODY}
<a class="skip" href="#main">${tr(U.skip, l)}</a>
<header class="hdr" id="hdr"><div class="wrap hdr-in">
  <a class="brand" href="/${l}/" aria-label="${CFG.name}"><img class="logo-c" src="/assets/logo-header.webp" alt="${CFG.name}" width="110" height="56"><img class="logo-w" src="/assets/logo-header-white.webp" alt="" width="110" height="56" aria-hidden="true"></a>
  <nav class="nav" aria-label="Main">${nav}</nav>
  <div class="hdr-act">
    <a class="hdr-tel" href="${tel}">${ic('phone')}<span>${CFG.phone}</span></a>
    <a class="lang" href="${alt[other]}" hreflang="${other}" lang="${other}" aria-label="${other === 'tr' ? 'Türkçe' : 'English'}">${ic('globe')}${other.toUpperCase()}</a>
    <a class="btn btn-primary hdr-book" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a>
    <button class="burger" id="burger" aria-label="${tr(U.menu, l)}" aria-expanded="false" aria-controls="drawer">${ic('menu')}</button>
  </div>
</div></header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-top"><a class="brand" href="/${l}/"><img src="/assets/logo-header.webp" alt="${CFG.name}" width="94" height="48"></a><button class="burger" id="drawer-close" aria-label="${tr(U.close, l)}">${ic('x')}</button></div>
  <nav class="drawer-nav">${nav}</nav>
  <div class="drawer-act"><a class="btn btn-primary" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a>${linkArrow(CFG.mapsUrl, tr(U.dir, l), EXT)}<a class="link-arrow" href="${alt[other]}">${other === 'tr' ? 'Türkçe' : 'English'}${ic('globe')}</a></div>
</div>
<main id="main">
${body}
</main>
${footer(l)}
<a class="wa-fab" href="${wa}"${EXT} aria-label="WhatsApp">${ic('wa')}<span>WhatsApp</span></a>
<div class="mbar" aria-label="Quick actions">
  <a href="${CFG.mapsUrl}"${EXT}>${ic('pin')}${tr(U.dir, l)}</a>
  <a class="mbar-book" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a>
</div>
<script src="/assets/app.js" defer></script>
<script src="/assets/consent.js" defer></script>
</body>
</html>`;
}

function footer(l) {
  const hours = CFG.hours[l].map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('');
  const tl = TREATMENTS.filter((t) => ['clear-aligners', 'dental-implants', 'guided-implant-surgery', 'root-canal-treatment', 'emergency-dental-care'].includes(t.slug.en)).map((t) => `<li><a href="${tUrl(l, t)}">${tr(t.name, l)}</a></li>`).join('');
  const labels = {
    hrs: T('Çalışma Saatleri', 'Opening Hours'), tr: T('Tedaviler', 'Treatments'), pg: T('Sayfalar', 'Pages'),
    priv: T('Gizlilik ve KVKK', 'Privacy & Data Protection'), rights: T('Tüm hakları saklıdır.', 'All rights reserved.'),
  };
  return `<footer class="ftr"><div class="wrap">
  <div class="ftr-grid">
    <div class="ftr-brand">
      <img class="ftr-logo" src="/assets/logo-stacked.png" alt="${CFG.name}" width="150" height="141" loading="lazy">
      <div>
        <ul class="plain"><li>${ic('pin')}<a href="${CFG.mapsUrl}"${EXT}>${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li><li>${ic('wa')}<a href="${wa}"${EXT}>WhatsApp</a></li></ul>
      </div>
    </div>
    <div><h3>${tr(labels.hrs, l)}</h3><ul class="hours">${hours}</ul></div>
    <div><h3>${tr(labels.tr, l)}</h3><ul class="plain lnk">${tl}<li><a href="${url(l, 'treatments')}">${tr(U.more, l)} →</a></li></ul></div>
    <div><h3>${tr(labels.pg, l)}</h3><ul class="plain lnk"><li><a href="${url(l, 'team')}">${tr(U.nav.team, l)}</a></li><li><a href="${url(l, 'tech')}">${tr(U.nav.tech, l)}</a></li><li><a href="${url(l, 'blog')}">${tr(U.nav.blog, l)}</a></li><li><a href="${url(l, 'patients')}">${tr(U.nav.patients, l)}</a></li><li><a href="${url(l, 'contact')}">${tr(U.nav.contact, l)}</a></li><li><a href="${url(l, 'privacy')}">${tr(labels.priv, l)}</a></li><li><button type="button" class="linklike" data-cookie-settings>${tr(U.cookies, l)}</button></li></ul></div>
  </div>
  <p class="copy">© <span data-year>2026</span> ${CFG.name} · ${tr(labels.rights, l)}</p>
</div></footer>`;
}

// ---------- shared blocks ----------
const pageHero = (l, eyebrow, h1, lead) => `<section class="phero"><div class="wrap">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div></section>`;
const sectionHead = (eyebrow, h2, lead) => `<div class="shead"><p class="eyebrow">${eyebrow}</p><h2>${h2}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const ctaBand = (l) => `<section class="sec"><div class="wrap"><div class="cta-band reveal">
  <div><h2>${tr(T('Randevunuzu alalım', 'Let’s book your appointment'), l)}</h2><p>${tr(T('Size uygun gün ve saati takvimden seçebilirsiniz.', 'You can pick a day and time that suits you in the calendar.'), l)}</p></div>
  <div class="cta-act"><a class="btn btn-light" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a></div></div></div></section>`;
const faqList = (items, l) => `<div class="faq">${items.map((f) => `<details><summary>${tr(f.q, l)}${ic('arrow', 'chev')}</summary><p>${tr(f.a, l)}</p></details>`).join('')}</div>`;
const faqLd = (items, l) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: tr(f.q, l), acceptedAnswer: { '@type': 'Answer', text: tr(f.a, l) } })) });
const treatCard = (t, l) => `<a class="card tcard" href="${tUrl(l, t)}"><h3>${tr(t.name, l)}</h3><p>${tr(t.promise, l)}</p><span class="more">${tr(U.more, l)}${ic('arrow')}</span></a>`;
const VAKA_DIMS = { 'vaka-02-tarama': [1200, 675], 'vaka-03-tasarim-yan': [933, 816], 'vaka-04-tasarim-ust': [898, 824], 'vaka-05-guide': [1200, 900], 'vaka-06-set': [800, 1067] };
const figHtml = (f, l) => { const [w, h] = VAKA_DIMS[f.img] || [1200, 900]; return `<figure class="case-fig${f.narrow ? ' narrow-fig' : ''}"><img src="/assets/img/vaka/${f.img}.webp" alt="${esc(f.alt[l])}" width="${w}" height="${h}" loading="lazy" decoding="async"><figcaption>${f.cap[l]}</figcaption></figure>`; };
const renderBody = (items, l) => items.map((x) => {
  if (typeof x === 'string') return `<p>${x}</p>`;
  if (x.h) return `<h2>${x.h}</h2>`;
  if (x.ul) return `<ul class="list">${x.ul.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  if (x.pair) return `<div class="fig-pair">${x.pair.map((f) => figHtml(f, l)).join('')}</div>`;
  if (x.img) return figHtml(x, l);
  return '';
}).join('');
const blogCard = (p, l) => `<a class="card bcard" href="${pUrl(l, p)}">${p.cover ? `<div class="zoom"><img class="bcover" src="/assets/img/vaka/${p.cover}" alt="${esc(p.coverAlt ? p.coverAlt[l] : tr(p.title, l))}" width="800" height="600" loading="lazy" decoding="async"></div>` : ''}<span class="chip">${tr(p.cat, l)}</span><h3>${tr(p.title, l)}</h3><p>${tr(p.excerpt, l)}</p><span class="meta">${fmtDate(p.date, l)}</span></a>`;
const mapEmbed = (l) => `<iframe class="map" title="${l === 'tr' ? 'Gebze Dental Klinik konumu' : 'Gebze Dental Klinik location'}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${CFG.mapEmbed}"></iframe>`;
const hoursBlock = (l) => `<ul class="hours">${CFG.hours[l].map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>`;
const initials = (n) => n.replace(/^Dt\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
const person = (p, l) => {
  const facts = [[T('Mezuniyet', 'Graduation'), p.graduation], [T('İlgi alanları', 'Interests'), p.interests]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${tr(k, l)}</dt><dd>${tr(v, l)}</dd></div>`).join('');
  return `<article class="person reveal"><div class="doc-photo ${p.photo ? '' : 'ph'}">${p.photo ? `<img class="portrait" src="${p.photo}" width="667" height="832" loading="lazy" decoding="async" alt="${p.name}">` : `<span class="avatar" aria-hidden="true">${initials(p.name)}</span>`}</div><h3>${p.name}</h3><p class="role">${tr(p.role, l)}</p>${p.bio ? `<p class="bio">${tr(p.bio, l)}</p>` : ''}${facts ? `<dl class="facts">${facts}</dl>` : ''}</article>`;
};

// ---------- pages ----------
const pages = [];
const add = (p) => pages.push(p);

// Home
add(function home(l) {
  const trust = [
    [T('Tüm tedaviler', 'All treatments'), T('Dolgudan implanta, tek klinikte', 'Fillings to implants, in one clinic')],
    [T('Dijital teknoloji', 'Digital technology'), T('Dijital tarayıcı ve planlama yazılımı', 'Digital scanner and planning software')],
    [T('Şeffaf bilgilendirme', 'Clear information'), T('Plan ve ödeme hekiminiz tarafından anlatılır', 'Your dentist explains the plan and payment')],
    [T('Kolay randevu', 'Easy booking'), T('Online, telefon veya WhatsApp ile randevu', 'Online, by phone or via WhatsApp')],
  ];
  const pillars = [
    [T('Tüm tedaviler tek klinikte', 'All treatments in one clinic'), T('Dolgu, kanal tedavisi, implant, şeffaf plak, çocuk tedavisi ve estetik uygulamalar aynı klinikte yapılır.', 'Fillings, root canals, implants, clear aligners, children’s care and cosmetic work are all done in the same clinic.')],
    [T('Dijital teknoloji', 'Digital technology'), T('Ağız içi dijital tarayıcı ve planlama yazılımı kullanılır. Şeffaf plak ve cerrahi guide gibi tedavilerde plan bilgisayarda hazırlanır.', 'An intraoral digital scanner and planning software are used. For treatments such as clear aligners and surgical guides, the plan is prepared on the computer.')],
    [T('Şeffaf bilgilendirme', 'Clear information'), T('Planlama, süre ve ödemeyle ilgili tüm bilgiler hekiminiz tarafından ayrıntılı olarak anlatılır. Düşünmek için istediğiniz kadar zaman alabilirsiniz.', 'Your dentist explains everything about the plan, the timeline and payment in detail. You can take as long as you like to decide.')],
    [T('Karar sizde', 'The decision is yours'), T('Tedavi seçenekleri anlatılır. Hangisini isteyeceğinize ve ne zaman başlayacağınıza siz karar verirsiniz.', 'The options are explained. You decide which one you want and when to start.')],
  ];
  const head = `<link rel="preload" as="image" href="/assets/img/klinik/hero-1600.webp" media="(min-width:701px)" fetchpriority="high">
<link rel="preload" as="image" href="/assets/img/klinik/hero-bekleme-900.webp" media="(max-width:700px)" fetchpriority="high">
`;
  const body = `
<section class="hero">
  <picture><source media="(max-width:700px)" srcset="/assets/img/klinik/hero-bekleme-900.webp" width="900" height="1125"><img class="hero-bg" src="/assets/img/klinik/hero-1600.webp" alt="${esc(tr(KL.waiting.alt, l))}" width="1600" height="1000" fetchpriority="high" decoding="async"></picture>
  <div class="hero-shade"></div>
  <div class="wrap hero-in"><div class="hero-txt">
    <p class="eyebrow-thin">Gebze, Kocaeli</p>
    <h1>${tr(T('Gülüşünüz için modern, dijital diş hekimliği', 'Modern, digital dentistry for your smile'), l)}</h1>
    <p class="lead">${tr(T('Gebze’de tek klinikte tüm diş tedavileri: dolgu, kanal, implant, şeffaf plak, çocuk tedavisi ve daha fazlası.', 'All dental treatments in one clinic in Gebze: fillings, root canals, implants, clear aligners, children’s care and more.'), l)}</p>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a>${linkArrow(CFG.mapsUrl, tr(U.dir, l), EXT)}</div>
  </div></div>
</section>
<section class="strip"><div class="wrap strip-in">${trust.map(([a, b]) => `<div><strong>${tr(a, l)}</strong><span>${tr(b, l)}</span></div>`).join('')}</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Kısaca', 'At a glance'), l), tr(T('Gebze Dental Klinik hakkında', 'About Gebze Dental Klinik'), l))}
  <ol class="editorial">${pillars.map(([a, b], i) => `<li class="reveal"><span class="num">0${i + 1}</span><div><h3>${tr(a, l)}</h3><p>${tr(b, l)}</p></div></li>`).join('')}</ol>
</div></section>

<section class="sec alt"><div class="wrap">
  ${sectionHead(tr(T('Tedaviler', 'Treatments'), l), tr(T('Hangi tedaviye ihtiyacınız var?', 'Which treatment do you need?'), l), tr(T('Emin değilseniz muayene randevusu alabilirsiniz; size uygun seçenekleri hekiminiz anlatır.', 'Not sure? You can book an appointment, and your dentist will explain the options that suit you.'), l))}
  <div class="rows">${GROUPS.map((g) => `<a class="row reveal" href="${url(l, 'treatments')}#${g.id}"><h3>${tr(g.name, l)}</h3><p>${tr(g.promise, l)}</p><span class="row-go">${ic('arrow')}</span></a>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Teknoloji', 'Technology'), l), tr(T('Dijital planlama kullanılan tedaviler', 'Treatments that use digital planning'), l), tr(T('Bazı tedavilerde dijital tarama ve bilgisayar planlaması kullanılır. Şeffaf plak ve cerrahi guide bunlardan yalnızca ikisi.', 'Some treatments use digital scanning and computer planning. Clear aligners and surgical guides are just two of them.'), l))}
  <div class="grid g2">
    <article class="feat reveal"><div class="zoom">${alignerImg(l)}</div><h3>${tr(T('Şeffaf plak', 'Clear aligners'), l)}</h3><p>${tr(T('Tel ve braket kullanılmayan, şeffaf ve çıkarılabilir plaklarla diş tedavisi. Plaklar kişiye özel hazırlanır; dişlerin nasıl hareket edeceği tedaviden önce ekranda izlenebilir.', 'Tooth straightening with clear, removable aligners, with no wires or brackets. The aligners are made for each patient, and how the teeth will move can be watched on screen before treatment.'), l)}</p>${linkArrow(tUrl(l, TREATMENTS.find((t) => t.slug.en === 'clear-aligners')), tr(U.more, l))}</article>
    <article class="feat reveal"><div class="zoom">${guideImg(l)}</div><h3>${tr(T('Cerrahi guide ile implant', 'Guided implant surgery'), l)}</h3><p>${tr(T('İmplantın yeri ve açısı önce bilgisayarda planlanır. Kişiye özel hazırlanan kılavuz (cerrahi guide) bu planı ağıza birebir aktarır.', 'The implant’s position and angle are planned on the computer first. A guide made for each patient (the surgical guide) carries that plan into the mouth exactly.'), l)}</p>${linkArrow(tUrl(l, TREATMENTS.find((t) => t.slug.en === 'guided-implant-surgery')), tr(U.more, l))}</article>
  </div>
  <p class="center mt">${linkArrow(url(l, 'tech'), tr(T('Tüm teknolojiler', 'All technology'), l))}</p>
</div></section>

<section class="sec alt"><div class="wrap">
  ${sectionHead(tr(T('Hekimlerimiz', 'Our dentists'), l), tr(T('Tedavinizi yapacak hekimler', 'The dentists who will treat you'), l))}
  <div class="team-grid">${TEAM.doctors.map((p) => person(p, l)).join('')}</div>
  <p class="center mt">${linkArrow(url(l, 'team'), tr(T('Tüm hekimlerimiz', 'All our dentists'), l))}</p>
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Kliniğimiz', 'Our clinic'), l), tr(T('Kliniğimize göz atın', 'Take a look inside'), l), tr(T('Gelmeden önce görmek isterseniz: bekleme alanı, muayene odaları ve röntgen odası.', 'If you would like to see it before you come: the waiting area, treatment rooms and X-ray room.'), l))}
  <div class="clinic-grid">${[KL.waiting, KL.room, KL.xray, KL.prep].map((k) => klCard(k, l)).join('')}</div>
</div></section>

<section class="sec alt"><div class="wrap">
  ${sectionHead(tr(T('Blog', 'Blog'), l), tr(T('Ağız ve diş sağlığı üzerine', 'On oral and dental health'), l))}
  <div class="grid g3">${POSTS.slice(0, 3).map((p) => blogCard(p, l)).join('')}</div>
  <p class="center mt">${linkArrow(url(l, 'blog'), tr(T('Tüm yazılar', 'All articles'), l))}</p>
</div></section>

<section class="sec"><div class="wrap split">
  <div>
    <p class="eyebrow">${tr(T('Fiyat ve ödeme', 'Pricing & payment'), l)}</p>
    <h2>${tr(T('Plan, süre ve ödeme', 'Plan, timeline and payment'), l)}</h2>
    <p class="lead">${tr(T('Tedavi planı, süre ve ödemeyle ilgili tüm bilgiler muayeneden sonra hekiminiz tarafından anlatılır. Ödeme seçenekleri için bize yazabilir ya da arayabilirsiniz.', 'Everything about the treatment plan, the timeline and payment is explained by your dentist after the check-up. You can write or call us about payment options.'), l)}</p>
    <ul class="ticks">${[T('Plan ve ödeme hekiminiz tarafından anlatılır', 'Your dentist explains the plan and payment'), T('Her aşamada bilgi alabilirsiniz', 'You can ask for information at every step')].map((x) => `<li>${ic('check')}${tr(x, l)}</li>`).join('')}</ul>
    <p>${linkArrow(url(l, 'patients'), tr(T('Yeni hastalar', 'New patients'), l))}</p>
  </div>
  <div class="faq-wrap"><h3>${tr(T('Sık sorulan sorular', 'Frequently asked questions'), l)}</h3>${faqList(FAQ, l)}</div>
</div></section>

<section class="sec alt"><div class="wrap">
  <div class="visit reveal">
    <div class="visit-txt">
      <p class="eyebrow light">${tr(T('Bizi ziyaret edin', 'Visit us'), l)}</p>
      <h2>${tr(T('Randevu alın', 'Book your appointment'), l)}</h2>
      <ul class="plain on-dark"><li>${ic('pin')}<a href="${CFG.mapsUrl}"${EXT}>${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li></ul>
      ${hoursBlock(l)}
      <div class="btn-row"><a class="btn btn-light btn-lg" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a>${linkArrow(CFG.mapsUrl, tr(U.dir, l), EXT)}</div>
    </div>
    ${mapEmbed(l)}
  </div>
</div></section>`;
  return { alt: both(), title: tr(T('Diş Kliniği Gebze', 'Dental Clinic in Gebze'), l), desc: tr(T('Gebze Hacıhalil’de diş kliniği: muayene, dolgu, kanal tedavisi, implant, şeffaf plak, ortodonti ve çocuk diş tedavisi. Online veya WhatsApp ile randevu.', 'Dental clinic in Gebze, Kocaeli: check-ups, fillings, root canals, implants, clear aligners, orthodontics and children’s dentistry. Book online or via WhatsApp.'), l), body, head, ld: [faqLd(FAQ, l)], path: `/${l}/`, cls: 'home' };
});

// Treatments hub
add((l) => {
  const body = `${pageHero(l, tr(U.nav.treatments, l), tr(T('Tüm diş tedavileri, tek klinikte', 'All dental treatments in one clinic'), l), tr(T('Günlük bakımdan estetiğe, implanttan acil tedaviye kadar ihtiyacınız olan her şey.', 'From everyday care to cosmetics, implants to emergencies, everything you need.'), l))}
${GROUPS.map((g, i) => `<section class="sec ${i % 2 ? '' : 'alt'}" id="${g.id}"><div class="wrap">
  <div class="shead"><h2>${tr(g.name, l)}</h2><p class="lead">${tr(g.promise, l)}</p></div>
  <div class="grid g3">${tByGroup(g.id).map((t) => treatCard(t, l)).join('')}</div></div></section>`).join('')}
${ctaBand(l)}`;
  return { alt: both('treatments'), title: tr(T('Diş Tedavileri', 'Dental Treatments'), l), desc: tr(T('Muayene, dolgu, kanal, şeffaf plak, implant, cerrahi guide, beyazlatma ve acil tedavi: tüm diş tedavileri Gebze Dental Klinik’te.', 'Check-ups, fillings, root canals, clear aligners, implants, guided surgery, whitening and emergency care at Gebze Dental Klinik.'), l), body, path: url(l, 'treatments') };
});

// Treatment pages
for (const t of TREATMENTS) {
  add((l) => {
    const g = GROUPS.find((x) => x.id === t.group);
    const related = tByGroup(t.group).filter((x) => x !== t).slice(0, 3);
    const body = `<section class="phero"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${url(l, 'treatments')}">${tr(U.nav.treatments, l)}</a> / <a href="${url(l, 'treatments')}#${g.id}">${tr(g.name, l)}</a></nav>
  <h1>${tr(t.name, l)}</h1><p class="lead">${tr(t.promise, l)}</p>
  <div class="btn-row"><a class="btn btn-primary btn-lg" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a></div></div></section>
<section class="sec"><div class="wrap narrow">
  ${t.slug.en === 'clear-aligners' ? `<div class="art-wrap">${alignerImg(l)}</div>` : ''}${t.slug.en === 'guided-implant-surgery' ? `<div class="art-wrap">${guideImg(l)}</div>` : ''}
  <div class="info-grid"><div class="card info"><h3>${tr(T('Kimler için', 'Who it is for'), l)}</h3><p>${tr(t.who, l)}</p></div><div class="card info"><h3>${tr(T('Süre', 'Duration'), l)}</h3><p>${tr(t.duration, l)}</p></div></div>
  <h2>${tr(T('Nasıl ilerler?', 'How it works'), l)}</h2>
  <ol class="steps">${t.steps[l].map((s) => `<li>${s}</li>`).join('')}</ol>
  <h2>${tr(T('Sık sorulanlar', 'FAQ'), l)}</h2>${faqList(t.faq, l)}
  <p class="note">${tr(T('Bu sayfa genel bilgilendirme amaçlıdır. Size uygun tedavi, muayene sonrasında birlikte belirlenir.', 'This page is general information. The right treatment for you is decided together after an exam.'), l)}</p>
</div></section>
<section class="sec alt"><div class="wrap"><h2 class="center">${tr(T('İlgili tedaviler', 'Related treatments'), l)}</h2><div class="grid g3">${related.map((r) => treatCard(r, l)).join('')}</div></div></section>
${ctaBand(l)}`;
    return { alt: both('treatments', t.slug), title: tr(t.name, l), desc: tr(t.seo, l), body, ld: [faqLd(t.faq, l)], path: tUrl(l, t) };
  });
}

// Technology
add((l) => {
  const tech = [
    [T('Şeffaf plak', 'Clear aligners'), T('Dişleri tel olmadan düzeltir.', 'Straightens teeth without wires.')],
    [T('Cerrahi guide', 'Surgical guide'), T('İmplantın yerini önceden planlayıp ağza aktaran, kişiye özel kılavuz.', 'A guide made for you that carries the planned implant position into your mouth.')],
    [T('Dijital tarama', 'Digital scanning'), T('Ölçü kaşığı ve patı kullanmadan, ağzınızın ölçüsünü dijital tarayıcıyla alırız.', 'We take your impressions with a digital scanner, with no trays or paste.')],
  ];
  const flow = (title, steps, art, link) => `<div class="tech-block reveal"><div>${art}</div><div><h2>${title}</h2><ol class="steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol><p>${linkArrow(link, tr(U.more, l))}</p></div></div>`;
  const al = TREATMENTS.find((t) => t.slug.en === 'clear-aligners'), gd = TREATMENTS.find((t) => t.slug.en === 'guided-implant-surgery');
  const body = `${pageHero(l, tr(U.nav.tech, l), tr(T('Tedaviye başlamadan önce planı birlikte görüyoruz', 'We look at the plan together before treatment starts'), l), tr(T('Teknolojiyi gösteriş için değil, ne yapacağımızı size önceden gösterebilmek için kullanıyoruz.', 'We use technology so we can show you what we are going to do, not for show.'), l))}
<section class="sec"><div class="wrap">
  <div class="grid g3">${tech.map(([a, b]) => `<div class="card pillar reveal"><h3>${tr(a, l)}</h3><p>${tr(b, l)}</p></div>`).join('')}</div>
  <p class="note center">${tr(T('Gerektiğinde 3D tomografiyi dışarıdaki bir görüntüleme merkezinden alıyoruz. Hekimlerimiz görüntüyü klinikte yazılımda inceler ve plana ekler.', 'When needed, we get a 3D tomography scan from an external imaging centre. Our dentists review it in software at the clinic and add it to the plan.'), l)}</p>
</div></section>
<section class="sec alt"><div class="wrap">${flow(tr(T('Şeffaf plak: tel olmadan düzgün dişler', 'Clear aligners: straighter teeth without wires'), l), al.steps[l], alignerImg(l), tUrl(l, al))}</div></section>
<section class="sec"><div class="wrap">${flow(tr(T('Cerrahi guide: planlanan yere implant', 'Surgical guide: implants where planned'), l), gd.steps[l], guideImg(l), tUrl(l, gd))}</div></section>
<section class="sec alt"><div class="wrap">
  ${sectionHead(tr(T('Klinikte', 'In the clinic'), l), tr(T('Kullandığımız cihazlar', 'The equipment we use'), l))}
  <div class="clinic-grid">${[{ ...KL.room, d: T('Dijital tarayıcıyı kullandığımız muayene odası.', 'The treatment room where we use the digital scanner.') }, { ...KL.xray, d: T('Panoramik röntgen cihazımızın bulunduğu oda.', 'The room with our panoramic X-ray unit.') }].map((k) => klCard(k, l)).join('')}</div>
</div></section>
${ctaBand(l)}`;
  return { alt: both('tech'), title: tr(T('Teknoloji ve Dijital Planlama', 'Technology & Digital Planning'), l), desc: tr(T('Dijital tarama, şeffaf plak ve cerrahi guide ile önceden planlanan diş tedavisi.', 'Dental treatment planned in advance with digital scanning, clear aligners and surgical guides.'), l), body, path: url(l, 'tech') };
});

// Doctors
add((l) => {
  const body = `${pageHero(l, tr(U.nav.team, l), tr(T('Doktorlarımız', 'Meet our doctors'), l), tr(T('Tedavinizi yapacak hekimlerimizle tanışın.', 'Meet the dentists who will treat you.'), l))}
<section class="sec"><div class="wrap">
  <div class="team-grid">${TEAM.doctors.map((p) => person(p, l)).join('')}</div>
</div></section>
<section class="sec alt"><div class="wrap narrow">
  ${sectionHead(tr(T('Uzmanlık alanları', 'Specialist fields'), l), tr(T('Klinikte hizmet veren uzman hekimler', 'Specialist dentists at the clinic'), l), tr(T('Klinikte aşağıdaki alanlarda uzman hekimler hizmet vermektedir.', 'Specialist dentists work at the clinic in the following fields.'), l))}
  <ul class="specialists">${TEAM.specialists.map((s) => `<li><span>${tr(s.field, l)}</span>${s.name ? `<strong>${s.name}</strong>` : ''}</li>`).join('')}</ul>
</div></section>
${ctaBand(l)}`;
  return { alt: both('team'), title: tr(T('Diş Hekimlerimiz', 'Our Dentists'), l), desc: tr(T('Gebze Dental Klinik’te tedavinizi yapacak diş hekimleri ve klinikte hizmet veren uzman hekimler.', 'The dentists who will treat you at Gebze Dental Klinik, and the specialist dentists working at the clinic.'), l), body, path: url(l, 'team') };
});

// New patients
add((l) => {
  const first = [T('Şikâyetinizi ve beklentinizi dinleriz.', 'We listen to your concerns and what you expect.'), T('Ağzınızı muayene ederiz. Gerekirse röntgen çekeriz, 3D görüntü gerekirse dışarıdan temin ederiz.', 'We examine your mouth. If needed we take an X-ray, and if a 3D scan is required we get it from an external centre.'), T('Tedavi seçenekleri, süre ve maliyet hekiminiz tarafından ayrıntılı olarak anlatılır.', 'Your dentist explains the options, the timeline and the cost in detail.'), T('Siz karar verirseniz ilk adımı birlikte planlarız.', 'If you decide to go ahead, we plan the first step together.')];
  const bring = [T('Kimlik belgeniz', 'Your ID'), T('Varsa eski röntgenleriniz ve tedavi kayıtlarınız', 'Any previous X-rays and treatment records'), T('Kullandığınız ilaçlar ve alerjileriniz', 'The medication you take and any allergies')];
  const body = `${pageHero(l, tr(U.nav.patients, l), tr(T('İlk ziyaretinizde ne olur?', 'What to expect at your first visit'), l), tr(T('İlk randevunuz muayene ile başlar.', 'Your first appointment starts with an examination.'), l))}
<section class="sec"><div class="wrap split">
  <div><h2>${tr(T('İlk 60 dakika', 'The first 60 minutes'), l)}</h2><ol class="steps">${first.map((s) => `<li>${tr(s, l)}</li>`).join('')}</ol></div>
  <div><h2>${tr(T('Yanınızda getirin', 'What to bring'), l)}</h2><ul class="ticks">${bring.map((s) => `<li>${ic('check')}${tr(s, l)}</li>`).join('')}</ul>
  <h2 class="mt">${tr(T('Fiyat ve ödeme', 'Pricing & payment'), l)}</h2><p>${tr(T('Tedavi planı, süre ve ödemeyle ilgili tüm bilgiler muayeneden sonra hekiminiz tarafından ayrıntılı olarak anlatılır. Ödeme seçenekleri için bize yazabilir ya da arayabilirsiniz.', 'Everything about the treatment plan, the timeline and payment is explained in detail by your dentist after the check-up. You can write or call us about payment options.'), l)}</p></div>
</div></section>
<section class="sec alt"><div class="wrap narrow"><h2>${tr(T('Sık sorulan sorular', 'Frequently asked questions'), l)}</h2>${faqList(FAQ, l)}</div></section>${ctaBand(l)}`;
  return { alt: both('patients'), title: tr(T('Yeni Hastalar ve SSS', 'New Patients & FAQ'), l), desc: tr(T('İlk diş hekimi randevunuzda neler olur, yanınızda neler getirmelisiniz ve sık sorulan sorular.', 'What happens at your first dental appointment, what to bring and frequently asked questions.'), l), body, ld: [faqLd(FAQ, l)], path: url(l, 'patients') };
});

// Blog index
add((l) => {
  const body = `${pageHero(l, tr(U.nav.blog, l), tr(T('Ağız ve diş sağlığı üzerine yazılar', 'Articles on oral and dental health'), l), tr(T('Şeffaf plak, implant, koruyucu bakım ve daha fazlası.', 'Clear aligners, implants, preventive care and more.'), l))}
<section class="sec"><div class="wrap"><div class="grid g3">${POSTS.map((p) => blogCard(p, l)).join('')}</div></div></section>${ctaBand(l)}`;
  return { alt: both('blog'), title: tr(T('Blog: Diş Sağlığı Yazıları', 'Blog: Dental Health Articles'), l), desc: tr(T('Şeffaf plak, cerrahi guide ile implant, diş taşı temizliği ve daha fazlası hakkında güncel yazılar.', 'Articles on clear aligners, guided implants, scaling and more.'), l), body, path: url(l, 'blog') };
});

// Blog posts
for (const p of POSTS) {
  add((l) => {
    const more = POSTS.filter((x) => x !== p).slice(0, 3);
    const body = `<section class="phero"><div class="wrap narrow"><nav class="crumbs"><a href="${url(l, 'blog')}">${tr(U.nav.blog, l)}</a> / ${tr(p.cat, l)}</nav><h1>${tr(p.title, l)}</h1><p class="meta">${fmtDate(p.date, l)} · ${p.author || CFG.name}</p></div></section>
<section class="sec"><div class="wrap narrow"><article class="prose">${renderBody(p.body[l], l)}</article>
<div class="cta-inline"><p>${tr(T('Sorularınız için bizimle iletişime geçin.', 'Have questions? Get in touch.'), l)}</p><a class="btn btn-primary" href="${BOOK(l)}"${EXT}>${ic('calendar')}${tr(U.book, l)}</a></div></div></section>
<section class="sec alt"><div class="wrap"><h2 class="center">${tr(T('Diğer yazılar', 'More articles'), l)}</h2><div class="grid g3">${more.map((x) => blogCard(x, l)).join('')}</div></div></section>`;
    const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: tr(p.title, l), datePublished: p.date, author: p.author ? { '@type': 'Person', name: p.author } : { '@type': 'Organization', name: CFG.name }, inLanguage: l };
    return { alt: both('blog', p.slug), title: tr(p.title, l), desc: tr(p.excerpt, l), body, ld: [ld], path: pUrl(l, p) };
  });
}

// Contact
add((l) => {
  const body = `${pageHero(l, tr(U.nav.contact, l), tr(T('Randevu ve iletişim', 'Appointments & contact'), l), tr(T('Takvimden size uygun saati seçin ya da WhatsApp ile bize yazın.', 'Pick a time in the calendar or message us on WhatsApp.'), l))}
<section class="sec"><div class="wrap split">
  <div class="card booking" id="randevu">
    <h2>${tr(T('Online randevu', 'Book online'), l)}</h2>
    <p class="lead">${tr(T('Takvimden size uygun gün ve saati seçin.', 'Pick a day and time that suits you.'), l)}</p>
    <iframe class="dt-widget" title="${tr(T('Online randevu takvimi', 'Online booking calendar'), l)}" loading="lazy" src="${CFG.bookingWidget}&referer=${encodeURIComponent(CFG.siteUrl + '/')}"></iframe>
    <p class="note">${tr(T('Takvim açılmıyorsa', 'If the calendar does not load,'), l)} <a href="${CFG.bookingUrl}"${EXT}>${tr(T('buradan randevu alabilirsiniz', 'book here'), l)}</a>. ${tr(T('Randevu takvimi DoktorTakvimi hizmeti ile sunulur.', 'The booking calendar is provided by DoktorTakvimi.'), l)}</p>
  </div>
  <aside class="contact-side">
    <div class="card info"><ul class="plain"><li>${ic('pin')}<a href="${CFG.mapsUrl}"${EXT}>${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li><li>${ic('wa')}<a href="${wa}"${EXT}>WhatsApp</a></li></ul><h3>${tr(T('Çalışma saatleri', 'Opening hours'), l)}</h3>${hoursBlock(l)}<p class="mt">${linkArrow(CFG.mapsUrl, tr(U.dir, l), EXT)}</p></div>
    <div class="card info emerg">${ic('alert')}<div><h3>${tr(T('Acil durum', 'Emergency'), l)}</h3><p>${tr(T('Şiddetli ağrı, şişlik veya kırık diş için hemen arayın.', 'For severe pain, swelling or a broken tooth, call right away.'), l)}</p><a class="tel-link" href="${tel}">${CFG.phone}</a></div></div>
    ${klCard(KL.waiting2, l)}
    ${mapEmbed(l)}
  </aside>
</div></section>`;
  return { alt: both('contact'), title: tr(T('İletişim ve Randevu', 'Contact & Appointments'), l), desc: tr(T('Gebze Dental Klinik online randevu, telefon, WhatsApp, adres ve çalışma saatleri.', 'Gebze Dental Klinik online booking, phone, WhatsApp, address and opening hours.'), l), body, path: url(l, 'contact') };
});

// Privacy
add((l) => {
  const content = l === 'tr'
    ? ['Bu metin, randevu ve iletişim kanalları üzerinden paylaştığınız kişisel verilerin işlenmesine ilişkin genel bir aydınlatmadır.',
      'Veri sorumlusu: Gebze Dental Klinik. Paylaştığınız ad, telefon ve randevu bilgileri yalnızca randevu oluşturmak ve sizinle iletişim kurmak amacıyla işlenir; üçüncü kişilerle paylaşılmaz.',
      'KVKK kapsamında verilerinize erişme, düzeltme ve silinmesini isteme haklarınız vardır. Talepleriniz için WhatsApp veya telefon ile bize ulaşabilirsiniz.',
      { h: 'Çerezler' },
      'Bu sitede ziyaret istatistikleri, yalnızca siz onay verirseniz Google Analytics 4 ile ölçülür. Onay vermezseniz analiz çerezleri kullanılmaz. Seçiminiz tarayıcınızda saklanır.',
      { ul: ['<strong>Google Analytics 4:</strong> ziyaret istatistikleri. Yalnızca onay verirseniz çalışır.', '<strong>DoktorTakvimi randevu takvimi:</strong> üçüncü taraf bir hizmettir ve iletişim sayfasında yüklenir. Takvimde girdiğiniz bilgiler ve olası çerezler o hizmetin gizlilik politikasına tabidir.', '<strong>Google Haritalar ve Google Fonts:</strong> harita ve yazı tipleri Google sunucularından yüklenir; bu sırada Google IP adresinizi görür.'] },
      { h: 'Tercihlerinizi değiştirmek' },
      'Sayfanın altındaki “Çerez tercihleri” bağlantısıyla seçiminizi istediğiniz zaman değiştirebilirsiniz. Tarayıcı ayarlarınızdan çerezleri silebilir ya da engelleyebilirsiniz.',
      `Son güncelleme: ${tr(CFG.lastUpdated, l)}`]
    : ['This notice explains how personal data you share through our appointment and contact channels is processed.',
      'Data controller: Gebze Dental Klinik. The name, phone and appointment details you share are used only to arrange your appointment and contact you, and are not shared with third parties.',
      'Under Turkey’s KVKK you may request access to, correction of or deletion of your data. Contact us via WhatsApp or phone.',
      { h: 'Cookies' },
      'On this site, visit statistics are measured with Google Analytics 4 only if you give your consent. If you do not consent, analytics cookies are not used. Your choice is stored in your browser.',
      { ul: ['<strong>Google Analytics 4:</strong> visit statistics. It only runs if you consent.', '<strong>DoktorTakvimi booking calendar:</strong> a third-party service loaded on the contact page. The details you enter there, and any cookies it sets, are subject to that service’s privacy policy.', '<strong>Google Maps and Google Fonts:</strong> the map and fonts are loaded from Google servers, which means Google sees your IP address.'] },
      { h: 'Changing your choice' },
      'You can change your choice at any time with the “Cookie preferences” link at the bottom of the page. You can also delete or block cookies in your browser settings.',
      `Last updated: ${tr(CFG.lastUpdated, l)}`];
  const body = `${pageHero(l, '', tr(T('Gizlilik ve KVKK Aydınlatma Metni', 'Privacy & KVKK Notice'), l))}<section class="sec"><div class="wrap narrow"><article class="prose">${renderBody(content, l)}</article></div></section>`;
  return { alt: both('privacy'), title: tr(T('Gizlilik ve KVKK', 'Privacy & KVKK'), l), desc: tr(T('Kişisel verilerin işlenmesine ilişkin aydınlatma metni ve çerez bilgileri.', 'Notice on the processing of personal data, and cookie information.'), l), body, path: url(l, 'privacy') };
});

// ---------- write ----------
fs.rmSync(path.join(OUT, 'tr'), { recursive: true, force: true });
fs.rmSync(path.join(OUT, 'en'), { recursive: true, force: true });
const urls = [];
for (const l of LANGS) {
  for (const fn of pages) {
    const p = fn(l);
    const dir = path.join(OUT, p.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), layout({ l, ...p }));
    urls.push({ loc: p.path, alt: p.alt });
  }
}
// old URLs kept alive as redirects
for (const [from, to] of [['/tr/ekibimiz/', '/tr/doktorlarimiz/'], ['/en/our-team/', '/en/our-doctors/'], ['/tr/tedaviler/dijital-gulus-tasarimi/', '/tr/tedaviler/'], ['/en/treatments/digital-smile-design/', '/en/treatments/']]) {
  fs.mkdirSync(path.join(OUT, from), { recursive: true });
  fs.writeFileSync(path.join(OUT, from, 'index.html'), `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="${CFG.siteUrl}${to}"><meta http-equiv="refresh" content="0;url=${to}"><meta name="robots" content="noindex"></head><body><a href="${to}">${to}</a></body></html>`);
}
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((u) => `<url><loc>${CFG.siteUrl}${u.loc}</loc><xhtml:link rel="alternate" hreflang="tr" href="${CFG.siteUrl}${u.alt.tr}"/><xhtml:link rel="alternate" hreflang="en" href="${CFG.siteUrl}${u.alt.en}"/></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${CFG.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GTM_HEAD}<title>${CFG.name}</title><link rel="canonical" href="${CFG.siteUrl}/tr/"><link rel="icon" href="/assets/icon.png"><link rel="alternate" hreflang="tr" href="/tr/"><link rel="alternate" hreflang="en" href="/en/"><meta http-equiv="refresh" content="0;url=/tr/"><script>var l=(navigator.language||'tr').toLowerCase().indexOf('tr')===0?'tr':'en';location.replace('/'+l+'/');</script></head><body style="font-family:sans-serif;text-align:center;padding:4rem">${GTM_BODY}<p><a href="/tr/">Türkçe</a> · <a href="/en/">English</a></p></body></html>`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GTM_HEAD}<title>404 | ${CFG.name}</title>${FONTS}<link rel="stylesheet" href="/assets/style.css"></head><body>${GTM_BODY}<main class="phero"><div class="wrap center"><h1>404</h1><p class="lead">Sayfa bulunamadı · Page not found</p><p><a class="btn btn-primary" href="/tr/">Ana sayfa</a> <a class="link-arrow" href="/en/">Home${ic('arrow')}</a></p></div></main><script src="/assets/consent.js" defer></script></body></html>`);
console.log(`Built ${urls.length} pages.`);
