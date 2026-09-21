// Static site generator: node build.mjs  ->  writes ./site/{tr,en}/...
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, CFG, TEAM, GROUPS, TREATMENTS, FAQ, POSTS } from './src/data.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'site');
const LANGS = ['tr', 'en'];
const S = {
  treatments: T('tedaviler', 'treatments'), tech: T('teknoloji', 'technology'), team: T('ekibimiz', 'our-team'),
  patients: T('yeni-hastalar', 'new-patients'), blog: T('blog', 'blog'), contact: T('iletisim', 'contact'), privacy: T('gizlilik-kvkk', 'privacy'),
};
const url = (l, key, sub) => `/${l}/${key ? S[key][l] + '/' : ''}${sub ? sub[l] + '/' : ''}`;
const both = (key, sub) => ({ tr: url('tr', key, sub), en: url('en', key, sub) });
const BOOK = () => CFG.bookingUrl + '#highlight-calendar';

const U = {
  nav: { treatments: T('Tedaviler', 'Treatments'), tech: T('Teknoloji', 'Technology'), team: T('Ekibimiz', 'Our Team'), patients: T('Yeni Hastalar', 'New Patients'), blog: T('Blog', 'Blog'), contact: T('İletişim', 'Contact') },
  book: T('Randevu Al', 'Book Appointment'), dir: T('Yol Tarifi', 'Directions'), call: T('Ara', 'Call'), callNow: T('Hemen Ara', 'Call Now'), wa: T('WhatsApp', 'WhatsApp'),
  menu: T('Menü', 'Menu'), close: T('Kapat', 'Close'), more: T('Detaylı bilgi', 'Learn more'), skip: T('İçeriğe geç', 'Skip to content'),
};
const ICON = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  wa: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z"/><path d="M9 9.500c0 3 2.500 5.500 5.500 5.500l1-1.500-2-1-1 .8a4 4 0 0 1-1.800-1.800l.8-1-1-2L9 9.500z"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M4 8l8 6 8-6"/>',
  tooth: '<path d="M7 3c-2.500 0-4 2-4 4.500 0 2 1 3.500 1.700 5.200.8 1.800 1 4.300 1.600 6.300.3 1 1 1.500 1.700 1 .8-.5.9-2 1.300-3.500.3-1.200 1-1.800 1.700-1.800s1.400.6 1.700 1.800c.4 1.500.5 3 1.300 3.500.7.5 1.400 0 1.700-1 .6-2 .8-4.500 1.600-6.300C20 11 21 9.500 21 7.500 21 5 19.500 3 17 3c-1.800 0-3 1-5 1S8.800 3 7 3z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6l8-3z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',
  sparkle: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3z"/><path d="M19 16v4M17 18h4"/>',
  aligner: '<path d="M3 13c0-4 4-7 9-7s9 3 9 7v2H3v-2z"/><path d="M7.500 15v3M12 15v3M16.500 15v3"/>',
  crosshair: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  cube: '<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9L12 3z"/><path d="M12 12l8-4.500M12 12v9M12 12L4 7.500"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.500 14c1 1.500 2.200 2 3.500 2s2.500-.5 3.500-2M9 9.500h.01M15 9.500h.01"/>',
  alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  camera: '<rect x="3" y="7" width="18" height="13" rx="4"/><circle cx="12" cy="13.500" r="3.500"/><path d="M8 7l1.500-3h5L16 7"/>',
  implant: '<rect x="9" y="8" width="6" height="13" rx="2"/><path d="M9 12h6M9 16h6M8 8V5a4 4 0 0 1 8 0v3"/>',
  crown: '<path d="M4 8l4 3 4-6 4 6 4-3-2 11H6L4 8z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.500l4.500 4.500L19 7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

const alignerArt = `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="Clear aligner illustration"><rect width="320" height="200" rx="28" fill="var(--blue-soft)"/><path d="M40 140Q160 10 280 140" fill="none" stroke="var(--blue)" stroke-opacity=".28" stroke-width="58" stroke-linecap="round"/>${[[40, 140, -47], [80, 104, -36], [120, 82, -20], [160, 75, 0], [200, 82, 20], [240, 104, 36], [280, 140, 47]].map(([x, y, a]) => `<rect x="-14" y="-20" width="28" height="40" rx="10" fill="#fff" stroke="var(--blue)" stroke-width="2" transform="translate(${x} ${y}) rotate(${a})"/>`).join('')}<path d="M262 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="var(--green)"/></svg>`;
const alignerImg = (l) => `<img class="art photo" src="/assets/img/seffaf-plak-800.jpg" srcset="/assets/img/seffaf-plak-800.jpg 800w, /assets/img/seffaf-plak-1200.jpg 1200w" sizes="(min-width:980px) 560px, 100vw" width="800" height="600" loading="lazy" alt="${l === 'tr' ? 'Şeffaf plaklar ve saklama kutusu' : 'Clear aligners in their case'}">`;
const guideImg = (l) => `<img class="art photo" src="/assets/img/cerrahi-guide-800.jpg" width="800" height="600" loading="lazy" alt="${l === 'tr' ? 'Cerrahi guide ve implant planlama yazılımı görüntüsü' : 'Surgical guide and implant planning software view'}">`;
const guideArt = `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="Surgical guide illustration"><rect width="320" height="200" rx="28" fill="var(--green-soft)"/><rect x="30" y="132" width="260" height="46" rx="22" fill="var(--green)" fill-opacity=".55"/><rect x="60" y="76" width="50" height="70" rx="18" fill="#fff" stroke="var(--navy)" stroke-width="2"/><rect x="210" y="76" width="50" height="70" rx="18" fill="#fff" stroke="var(--navy)" stroke-width="2"/><rect x="150" y="100" width="20" height="56" rx="7" fill="var(--blue)"/><path d="M152 112h16M152 124h16M152 136h16M152 148h16" stroke="#fff" stroke-width="2"/><rect x="50" y="42" width="220" height="30" rx="15" fill="var(--blue)" fill-opacity=".25" stroke="var(--blue)" stroke-width="2"/><rect x="146" y="26" width="28" height="48" rx="9" fill="var(--navy)"/><path d="M160 74v22" stroke="var(--green-dark)" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/><path d="M150 12h20" stroke="var(--navy)" stroke-width="3" stroke-linecap="round"/></svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const tel = `tel:${CFG.phoneRaw}`;
const wa = `https://wa.me/${CFG.whatsapp}`;

const tr = (t, l) => t[l];
const tByGroup = (g) => TREATMENTS.filter((t) => t.group === g);
const tUrl = (l, t) => url(l, 'treatments', t.slug);
const pUrl = (l, p) => url(l, 'blog', p.slug);
const fmtDate = (d, l) => new Date(d).toLocaleDateString(l === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- layout ----------
function layout({ l, alt, title, desc, body, ld = [], cls = '' }) {
  const other = l === 'tr' ? 'en' : 'tr';
  const full = `${title} | ${CFG.name}`;
  const dentist = {
    '@context': 'https://schema.org', '@type': 'Dentist', name: CFG.name, url: CFG.siteUrl + `/${l}/`, telephone: CFG.phone,
    image: CFG.siteUrl + '/assets/logo-stacked.png', hasMap: CFG.mapsUrl, address: { '@type': 'PostalAddress', streetAddress: 'Hacıhalil, 1227. Sk. No: 3B', postalCode: '41400', addressLocality: 'Gebze', addressRegion: 'Kocaeli', addressCountry: 'TR' },
    employee: TEAM.doctors.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: 'Dentist' })),
  };
  const nav = ['treatments', 'tech', 'team', 'patients', 'blog', 'contact'].map((k) => `<a href="${url(l, k)}" data-nav="${k}">${tr(U.nav[k], l)}</a>`).join('');
  return `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${CFG.siteUrl}${alt[l]}">
<link rel="alternate" hreflang="tr" href="${CFG.siteUrl}${alt.tr}">
<link rel="alternate" hreflang="en" href="${CFG.siteUrl}${alt.en}">
<link rel="alternate" hreflang="x-default" href="${CFG.siteUrl}${alt.tr}">
<meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="${CFG.siteUrl}/assets/logo-stacked.png">
<meta name="theme-color" content="#3A72C4">
<link rel="icon" type="image/png" href="/assets/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
${[dentist, ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body class="${cls}">
<a class="skip" href="#main">${tr(U.skip, l)}</a>
<header class="hdr" id="hdr"><div class="wrap hdr-in">
  <a class="brand" href="/${l}/" aria-label="${CFG.name}"><img src="/assets/logo-horizontal.png" alt="${CFG.name}" width="180" height="88"></a>
  <nav class="nav" aria-label="Main">${nav}</nav>
  <div class="hdr-act">
    <a class="hdr-tel" href="${tel}">${ic('phone')}<span>${CFG.phone}</span></a>
    <a class="lang" href="${alt[other]}" hreflang="${other}" lang="${other}" aria-label="${other === 'tr' ? 'Türkçe' : 'English'}">${ic('globe')}${other.toUpperCase()}</a>
    <a class="btn btn-primary hdr-book" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a>
    <button class="burger" id="burger" aria-label="${tr(U.menu, l)}" aria-expanded="false" aria-controls="drawer">${ic('menu')}</button>
  </div>
</div></header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-top"><a class="brand" href="/${l}/"><img src="/assets/logo-horizontal.png" alt="${CFG.name}" width="150" height="73"></a><button class="burger" id="drawer-close" aria-label="${tr(U.close, l)}">${ic('x')}</button></div>
  <nav class="drawer-nav">${nav}</nav>
  <div class="drawer-act"><a class="btn btn-primary" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a><a class="btn btn-outline" href="${CFG.mapsUrl}" target="_blank" rel="noopener">${ic('pin')}${tr(U.dir, l)}</a><a class="btn btn-outline" href="${alt[other]}">${ic('globe')}${other === 'tr' ? 'Türkçe' : 'English'}</a></div>
</div>
<main id="main">
${body}
</main>
${footer(l)}
<a class="wa-fab" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('wa')}</a>
<div class="mbar" aria-label="Quick actions">
  <a href="${CFG.mapsUrl}" target="_blank" rel="noopener">${ic('pin')}${tr(U.dir, l)}</a>
  <a class="mbar-book" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a>
</div>
<script src="/assets/app.js" defer></script>
</body>
</html>`;
}

function footer(l) {
  const hours = CFG.hours[l].map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('');
  const tl = TREATMENTS.filter((t) => t.featured || ['dis-implanti', 'dis-beyazlatma', 'kanal-tedavisi', 'acil-dis-tedavisi'].includes(t.slug.tr)).map((t) => `<li><a href="${tUrl(l, t)}">${tr(t.name, l)}</a></li>`).join('');
  const labels = {
    visit: T('Ziyaret', 'Visit'), hrs: T('Çalışma Saatleri', 'Opening Hours'), tr: T('Tedaviler', 'Treatments'), pg: T('Sayfalar', 'Pages'),
    priv: T('Gizlilik ve KVKK', 'Privacy & Data Protection'), rights: T('Tüm hakları saklıdır.', 'All rights reserved.'),
  };
  return `<footer class="ftr"><div class="wrap">
  <div class="ftr-grid">
    <div class="ftr-brand">
      <img class="ftr-logo" src="/assets/logo-stacked.png" alt="${CFG.name}" width="150" height="141">
      <div>
        <ul class="plain"><li>${ic('pin')}<a href="${CFG.mapsUrl}" target="_blank" rel="noopener">${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li><li>${ic('wa')}<a href="${wa}" target="_blank" rel="noopener">WhatsApp</a></li></ul>
      </div>
    </div>
    <div><h3>${tr(labels.hrs, l)}</h3><ul class="hours">${hours}</ul></div>
    <div><h3>${tr(labels.tr, l)}</h3><ul class="plain lnk">${tl}<li><a href="${url(l, 'treatments')}">${tr(U.more, l)} →</a></li></ul></div>
    <div><h3>${tr(labels.pg, l)}</h3><ul class="plain lnk"><li><a href="${url(l, 'team')}">${tr(U.nav.team, l)}</a></li><li><a href="${url(l, 'tech')}">${tr(U.nav.tech, l)}</a></li><li><a href="${url(l, 'blog')}">${tr(U.nav.blog, l)}</a></li><li><a href="${url(l, 'patients')}">${tr(U.nav.patients, l)}</a></li><li><a href="${url(l, 'contact')}">${tr(U.nav.contact, l)}</a></li><li><a href="${url(l, 'privacy')}">${tr(labels.priv, l)}</a></li></ul></div>
  </div>
  <p class="copy">© <span data-year>2026</span> ${CFG.name} · ${tr(labels.rights, l)}</p>
</div></footer>`;
}

// ---------- shared blocks ----------
const pageHero = (l, eyebrow, h1, lead) => `<section class="phero"><div class="wrap"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div></section>`;
const sectionHead = (eyebrow, h2, lead) => `<div class="shead"><p class="eyebrow">${eyebrow}</p><h2>${h2}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const ctaBand = (l) => `<section class="sec"><div class="wrap"><div class="cta-band reveal">
  <div><h2>${tr(T('Muayeneniz ücretsiz: randevunuzu planlayalım', 'Your check-up is free: let’s plan your visit'), l)}</h2><p>${tr(T('Formu doldurun ya da bizi arayın; size en uygun saati birlikte belirleyelim.', 'Send us a request or call, and we will find the best time together.'), l)}</p></div>
  <div class="cta-act"><a class="btn btn-green" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a></div></div></div></section>`;
const faqList = (items, l) => `<div class="faq">${items.map((f) => `<details><summary>${tr(f.q, l)}${ic('arrow', 'chev')}</summary><p>${tr(f.a, l)}</p></details>`).join('')}</div>`;
const faqLd = (items, l) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: tr(f.q, l), acceptedAnswer: { '@type': 'Answer', text: tr(f.a, l) } })) });
const treatCard = (t, l) => `<a class="card tcard" href="${tUrl(l, t)}"><span class="ico">${ic(t.icon)}</span><h3>${tr(t.name, l)}</h3><p>${tr(t.promise, l)}</p><span class="more">${tr(U.more, l)}${ic('arrow')}</span></a>`;
const figHtml = (f, l) => `<figure class="case-fig${f.narrow ? ' narrow-fig' : ''}"><img src="/assets/img/vaka/${f.img}.jpg" alt="${esc(f.alt[l])}" loading="lazy"><figcaption>${f.cap[l]}</figcaption></figure>`;
const renderBody = (items, l) => items.map((x) => {
  if (typeof x === 'string') return `<p>${x}</p>`;
  if (x.h) return `<h2>${x.h}</h2>`;
  if (x.pair) return `<div class="fig-pair">${x.pair.map((f) => figHtml(f, l)).join('')}</div>`;
  if (x.img) return figHtml(x, l);
  return '';
}).join('');
const blogCard = (p, l) => `<a class="card bcard" href="${pUrl(l, p)}">${p.cover ? `<img class="bcover" src="/assets/img/vaka/${p.cover}" alt="" width="800" height="600" loading="lazy">` : ''}<span class="chip">${tr(p.cat, l)}</span><h3>${tr(p.title, l)}</h3><p>${tr(p.excerpt, l)}</p><span class="meta">${fmtDate(p.date, l)}</span></a>`;
const mapEmbed = () => `<iframe class="map" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(CFG.mapQuery)}&output=embed"></iframe>`;
const hoursBlock = (l) => `<ul class="hours">${CFG.hours[l].map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>`;

// ---------- pages ----------
const pages = [];
const add = (p) => pages.push(p);

// Home
add(function home(l) {
  const lab = {
    h1: T('Gülüşünüz için modern, dijital diş hekimliği', 'Modern, digital dentistry for your smile'),
    sub: T('Gebze’de modern ve dijital planlı tüm diş tedavileri tek klinikte: şeffaf plak, cerrahi guide ile implant ve dijital gülüş tasarımı.', 'Modern, digitally planned dental care under one roof in Gebze: clear aligners, guided implant surgery and digital smile design.'),
    chipA: T('Şeffaf Plak', 'Clear Aligners'), chipB: T('Cerrahi Guide', 'Surgical Guide'),
  };
  const trust = [
    ['tooth', T('Tüm tedaviler', 'All treatments'), T('Tek klinikte, tek plan', 'One clinic, one plan')],
    ['aligner', T('Şeffaf plak', 'Clear aligners'), T('Dijital planlı, telsiz', 'Digitally planned, wire-free')],
    ['crosshair', T('Cerrahi guide', 'Surgical guide'), T('Kılavuzlu implant', 'Guided implants')],
    ['check', T('Ücretsiz muayene', 'Free check-up'), T('Randevunuzu hemen alın', 'Book your visit today')],
  ];
  const pillars = [
    ['tooth', T('Tüm tedaviler tek çatı altında', 'All treatments under one roof'), T('Dolgudan implanta, çocuk tedavisinden estetiğe kadar ihtiyacınız olan her şey aynı yerde.', 'From fillings to implants, children’s care to cosmetics, everything you need in one place.')],
    ['cube', T('Dijital planlama', 'Digital planning'), T('Tedaviyi başlamadan önce ekranda planlar, size sonucu önceden gösteririz.', 'We plan on screen before treatment starts and show you the result in advance.')],
    ['shield', T('Şeffaf plan', 'A transparent plan'), T('Ne yapılacağını, ne kadar süreceğini ve maliyetini yazılı olarak paylaşırız.', 'We share what will be done, how long it takes and what it costs, in writing.')],
    ['heart', T('Modern ve konforlu tedavi', 'Modern, comfortable care'), T('Acele etmeden dinler, anlatır; dijital araçlarla daha konforlu bir süreç sunarız.', 'We listen and explain without rushing, and use digital tools to make the process more comfortable.')],
  ];
  const body = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt">
    <p class="pill">${ic('pin')}Gebze, Kocaeli</p>
    <h1>${tr(lab.h1, l)}</h1>
    <p class="lead">${tr(lab.sub, l)}</p>
    <p class="free">${ic('check')}${tr(T('Muayene ücretsiz', 'Free check-up'), l)}</p>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(T('Randevu Al', 'Book Appointment'), l)}</a><a class="btn btn-outline btn-lg" href="${CFG.mapsUrl}" target="_blank" rel="noopener">${ic('pin')}${tr(U.dir, l)}</a></div>
  </div>
  <div class="hero-art"><div class="hero-card"><img src="/assets/icon.png" alt="" width="346" height="469"></div>
    <span class="float f1">${ic('aligner')}${tr(lab.chipA, l)}</span><span class="float f2">${ic('crosshair')}${tr(lab.chipB, l)}</span></div>
</div></section>
<section class="trust"><div class="wrap trust-in">${trust.map(([i, a, b]) => `<div class="trust-item">${ic(i)}<div><strong>${tr(a, l)}</strong><span>${tr(b, l)}</span></div></div>`).join('')}</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Yaklaşımımız', 'Our approach'), l), tr(T('Neden Gebze Dental Klinik?', 'Why Gebze Dental Klinik?'), l))}
  <div class="grid g4">${pillars.map(([i, a, b]) => `<div class="card pillar reveal"><span class="ico">${ic(i)}</span><h3>${tr(a, l)}</h3><p>${tr(b, l)}</p></div>`).join('')}</div>
</div></section>

<section class="sec alt"><div class="wrap">
  ${sectionHead(tr(T('Tedaviler', 'Treatments'), l), tr(T('İhtiyacınız olan bakımı bulun', 'Find the care you need'), l), tr(T('Dört başlıkta tüm diş tedavilerini yapıyoruz.', 'We provide all dental treatments across four areas.'), l))}
  <div class="grid g4">${GROUPS.map((g) => `<a class="card tcard reveal" href="${url(l, 'treatments')}#${g.id}"><span class="ico">${ic(g.icon)}</span><h3>${tr(g.name, l)}</h3><p>${tr(g.promise, l)}</p><span class="more">${tr(U.more, l)}${ic('arrow')}</span></a>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Teknoloji', 'Technology'), l), tr(T('Planlı, öngörülebilir ve konforlu tedavi', 'Planned, predictable, comfortable treatment'), l), tr(T('Dijital planlama ile tedaviyi başlamadan önce görür, birlikte karar veririz.', 'Digital planning lets us see and decide together before treatment begins.'), l))}
  <div class="grid g2">
    <article class="card feat reveal">${alignerImg(l)}<h3>${tr(T('Şeffaf plak', 'Clear aligners'), l)}</h3><p>${tr(T('Tel yok, braket yok. Dişleriniz için özel hazırlanan görünmez plaklarla adım adım düzgün bir gülüş; hedefi tedaviden önce 3D simülasyonda görürsünüz.', 'No wires, no brackets. Invisible aligners made for your teeth straighten your smile step by step, and you preview the goal in a 3D simulation first.'), l)}</p><a class="more" href="${tUrl(l, TREATMENTS.find((t) => t.slug.en === 'clear-aligners'))}">${tr(U.more, l)}${ic('arrow')}</a></article>
    <article class="card feat reveal">${guideImg(l)}<h3>${tr(T('Cerrahi guide ile implant', 'Guided implant surgery'), l)}</h3><p>${tr(T('İmplantın yeri ve açısı bilgisayarda planlanır, kişiye özel cerrahi guide ile ağıza birebir aktarılır. Daha öngörülebilir ve kontrollü bir işlem.', 'The implant’s position and angle are planned on the computer and transferred exactly with a custom surgical guide. A more predictable, controlled procedure.'), l)}</p><a class="more" href="${tUrl(l, TREATMENTS.find((t) => t.slug.en === 'guided-implant-surgery'))}">${tr(U.more, l)}${ic('arrow')}</a></article>
  </div>
  <p class="center mt"><a class="btn btn-outline" href="${url(l, 'tech')}">${tr(T('Tüm teknolojiler', 'All technology'), l)}${ic('arrow')}</a></p>
</div></section>


<section class="sec"><div class="wrap">
  ${sectionHead(tr(T('Blog', 'Blog'), l), tr(T('Ağız ve diş sağlığı üzerine', 'On oral and dental health'), l))}
  <div class="grid g3">${POSTS.slice(0, 3).map((p) => blogCard(p, l)).join('')}</div>
  <p class="center mt"><a class="btn btn-outline" href="${url(l, 'blog')}">${tr(T('Tüm yazılar', 'All articles'), l)}${ic('arrow')}</a></p>
</div></section>

<section class="sec alt"><div class="wrap split">
  <div>
    <p class="eyebrow">${tr(T('Fiyat ve ödeme', 'Pricing & payment'), l)}</p>
    <h2>${tr(T('Muayene ücretsiz, maliyeti baştan bilirsiniz', 'Free check-up, and you know the cost upfront'), l)}</h2>
    <p class="lead">${tr(T('Muayene ücretsizdir. Sonrasında tedavi planınızı ve fiyat bilgisini yazılı olarak sunarız. Ödeme seçenekleri için bizimle iletişime geçin.', 'The check-up is free. Afterwards we give you a written treatment plan and price. Contact us for payment options.'), l)}</p>
    <ul class="ticks">${[T('Ücretsiz muayene', 'Free check-up'), T('Yazılı tedavi planı', 'Written treatment plan'), T('Aşama aşama bilgilendirme', 'Step-by-step updates'), T('Sürpriz masraf yok', 'No surprise costs')].map((x) => `<li>${ic('check')}${tr(x, l)}</li>`).join('')}</ul>
    <p><a class="btn btn-primary" href="${url(l, 'patients')}">${tr(T('Yeni hastalar', 'New patients'), l)}${ic('arrow')}</a></p>
  </div>
  <div class="faq-wrap"><h3>${tr(T('Sık sorulan sorular', 'Frequently asked questions'), l)}</h3>${faqList(FAQ, l)}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="visit reveal">
    <div class="visit-txt">
      <p class="eyebrow light">${tr(T('Bizi ziyaret edin', 'Visit us'), l)}</p>
      <h2>${tr(T('Ücretsiz muayene için randevu alın', 'Book your free check-up'), l)}</h2>
      <ul class="plain on-blue"><li>${ic('pin')}<a href="${CFG.mapsUrl}" target="_blank" rel="noopener">${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li></ul>
      ${hoursBlock(l)}
      <div class="btn-row"><a class="btn btn-green btn-lg" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(T('Randevu Al', 'Book Appointment'), l)}</a><a class="btn btn-ghost btn-lg" href="${CFG.mapsUrl}" target="_blank" rel="noopener">${ic('pin')}${tr(T('Yol Tarifi', 'Directions'), l)}</a></div>
    </div>
    ${mapEmbed()}
  </div>
</div></section>`;
  return { alt: both(), title: tr(T('Diş Kliniği Gebze | Şeffaf Plak ve Cerrahi Guide ile İmplant', 'Dental Clinic in Gebze | Clear Aligners & Guided Implants'), l).split(' | ')[0] + '', desc: tr(T('Gebze Dental Klinik: modern ve dijital planlı tüm diş tedavileri, şeffaf plak, cerrahi guide destekli implant ve dijital planlama. Muayene ücretsiz. Online randevu alın.', 'Gebze Dental Klinik: modern, digitally planned dental care, clear aligners, guided implant surgery and digital planning. Free check-up. Book online.'), l), body, ld: [faqLd(FAQ, l)], path: `/${l}/`, cls: 'home' };
});

// Treatments hub
add((l) => {
  const body = `${pageHero(l, tr(U.nav.treatments, l), tr(T('Tüm diş tedavileri, tek klinikte', 'All dental treatments in one clinic'), l), tr(T('Günlük bakımdan estetiğe, implanttan acil tedaviye kadar ihtiyacınız olan her şey.', 'From everyday care to cosmetics, implants to emergencies, everything you need.'), l))}
${GROUPS.map((g, i) => `<section class="sec ${i % 2 ? 'alt' : ''}" id="${g.id}"><div class="wrap">
  <div class="shead"><span class="ico big">${ic(g.icon)}</span><h2>${tr(g.name, l)}</h2><p class="lead">${tr(g.promise, l)}</p></div>
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
  <span class="ico big">${ic(t.icon)}</span><h1>${tr(t.name, l)}</h1><p class="lead">${tr(t.promise, l)}</p>
  <div class="btn-row"><a class="btn btn-primary btn-lg" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a></div></div></section>
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
    return { alt: both('treatments', t.slug), title: tr(t.name, l), desc: tr(t.promise, l) + ' ' + CFG.name + ', Gebze.', body, ld: [faqLd(t.faq, l)], path: tUrl(l, t) };
  });
}

// Technology
add((l) => {
  const tech = [
    ['aligner', T('Şeffaf plak', 'Clear aligners'), T('Dijital planlı, görünmez plaklar.', 'Digitally planned, invisible aligners.')],
    ['crosshair', T('Cerrahi guide', 'Surgical guide'), T('Kılavuzlu, planlı implant cerrahisi.', 'Guided, planned implant surgery.')],
    ['cube', T('3D görüntüleme', '3D imaging'), T('Kemik ve diş yapısını üç boyutlu değerlendirme.', 'Three-dimensional assessment of bone and teeth.')],
    ['camera', T('Dijital gülüş tasarımı', 'Digital smile design'), T('Sonucu tedaviden önce önizleme.', 'Preview the result before treatment.')],
  ];
  const flow = (title, steps, art, link) => `<div class="tech-block reveal"><div>${art}</div><div><h2>${title}</h2><ol class="steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol><p><a class="btn btn-outline" href="${link}">${tr(U.more, l)}${ic('arrow')}</a></p></div></div>`;
  const al = TREATMENTS.find((t) => t.slug.en === 'clear-aligners'), gd = TREATMENTS.find((t) => t.slug.en === 'guided-implant-surgery');
  const body = `${pageHero(l, tr(U.nav.tech, l), tr(T('Dijital planlama ile daha öngörülebilir tedavi', 'More predictable treatment through digital planning'), l), tr(T('Teknolojiyi gösteriş için değil, tedaviyi daha planlı ve konforlu yapmak için kullanıyoruz.', 'We use technology not for show, but to make treatment better planned and more comfortable.'), l))}
<section class="sec"><div class="wrap">
  <div class="grid g4">${tech.map(([i, a, b]) => `<div class="card pillar reveal"><span class="ico">${ic(i)}</span><h3>${tr(a, l)}</h3><p>${tr(b, l)}</p></div>`).join('')}</div>
</div></section>
<section class="sec alt"><div class="wrap">${flow(tr(T('Şeffaf plak: tel olmadan düzgün dişler', 'Clear aligners: straighter teeth without wires'), l), al.steps[l], alignerImg(l), tUrl(l, al))}</div></section>
<section class="sec"><div class="wrap">${flow(tr(T('Cerrahi guide: planlanan yere implant', 'Surgical guide: implants where planned'), l), gd.steps[l], guideImg(l), tUrl(l, gd))}</div></section>
${ctaBand(l)}`;
  return { alt: both('tech'), title: tr(T('Teknoloji: Şeffaf Plak ve Cerrahi Guide', 'Technology: Clear Aligners & Surgical Guides'), l), desc: tr(T('Şeffaf plak, cerrahi guide, 3D görüntüleme ve dijital gülüş tasarımı ile planlı diş tedavisi.', 'Planned dental treatment with clear aligners, surgical guides, 3D imaging and digital smile design.'), l), body, path: url(l, 'tech') };
});

// Team
const initials = (n) => n.replace(/^Dt\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
const person = (p, l) => `<article class="card person reveal"><div class="doc-photo ${p.photo ? '' : 'ph'}">${p.photo ? `<img class="portrait" src="${p.photo}" width="667" height="832" loading="lazy" alt="${p.name}">` : `<span class="avatar" aria-hidden="true">${initials(p.name)}</span>`}</div><h3>${p.name}</h3><p class="role">${tr(p.role, l)}</p>${p.bio ? `<p>${tr(p.bio, l)}</p>` : ''}</article>`;
add((l) => {
  const body = `${pageHero(l, tr(U.nav.team, l), tr(T('Ekibimiz', 'Meet our team'), l), tr(T('Hekimlerimiz ve asistanlarımız her aşamada yanınızda.', 'Our dentists and assistants are with you at every step.'), l))}
<section class="sec"><div class="wrap">
  <h2>${tr(T('Hekimler', 'Dentists'), l)}</h2>
  <div class="team-grid">${TEAM.doctors.map((p) => person(p, l)).join('')}</div>
</div></section>
<section class="sec alt"><div class="wrap">
  <h2>${tr(T('Asistanlar', 'Assistants'), l)}</h2>
  <div class="team-grid">${TEAM.assistants.map((p) => person(p, l)).join('')}</div>
</div></section>${ctaBand(l)}`;
  return { alt: both('team'), title: tr(T('Ekibimiz: Hekimler ve Asistanlar', 'Our Team: Dentists & Assistants'), l), desc: tr(T('Gebze Dental Klinik hekimleri ve asistanları.', 'The dentists and assistants at Gebze Dental Klinik.'), l), body, path: url(l, 'team') };
});

// New patients
add((l) => {
  const first = [T('Şikâyetlerinizi ve beklentilerinizi dinleriz.', 'We listen to your concerns and expectations.'), T('Ağız muayenesi yapılır; gerekirse röntgen veya 3D görüntüleme alınır.', 'We examine your mouth, taking X-rays or 3D images if needed.'), T('Tedavi seçenekleri, süre ve maliyet size yazılı olarak anlatılır.', 'Your options, timeline and cost are explained in writing.'), T('Uygun görürseniz ilk tedavi adımını planlarız.', 'If you are happy, we plan the first step of treatment.')];
  const bring = [T('Kimlik belgesi', 'ID document'), T('Varsa eski röntgen ve tedavi kayıtları', 'Previous X-rays and treatment records, if any'), T('Kullandığınız ilaçların ve alerjilerinizin listesi', 'A list of your medications and allergies')];
  const body = `${pageHero(l, tr(U.nav.patients, l), tr(T('İlk ziyaretinizde ne olur?', 'What to expect at your first visit'), l), tr(T('Ücretsiz muayene ile başlayan, net ve rahat bir ilk randevu.', 'A clear, comfortable first appointment that starts with a free check-up.'), l))}
<section class="sec"><div class="wrap split">
  <div><h2>${tr(T('İlk 60 dakika', 'The first 60 minutes'), l)}</h2><ol class="steps">${first.map((s) => `<li>${tr(s, l)}</li>`).join('')}</ol></div>
  <div><h2>${tr(T('Yanınızda getirin', 'What to bring'), l)}</h2><ul class="ticks">${bring.map((s) => `<li>${ic('check')}${tr(s, l)}</li>`).join('')}</ul>
  <h2 class="mt">${tr(T('Fiyat ve ödeme', 'Pricing & payment'), l)}</h2><p>${tr(T('Muayene ücretsizdir. Sonrasında tedavi planınız ve fiyat bilgisi yazılı olarak verilir. Ödeme seçenekleri için bizimle iletişime geçin.', 'The check-up is free. Afterwards you receive a written plan and price. Contact us about payment options.'), l)}</p></div>
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
<div class="cta-inline"><p>${tr(T('Sorularınız için bizimle iletişime geçin.', 'Have questions? Get in touch.'), l)}</p><a class="btn btn-primary" href="${BOOK(l)}" target="_blank" rel="noopener">${ic('calendar')}${tr(U.book, l)}</a></div></div></section>
<section class="sec alt"><div class="wrap"><h2 class="center">${tr(T('Diğer yazılar', 'More articles'), l)}</h2><div class="grid g3">${more.map((x) => blogCard(x, l)).join('')}</div></div></section>`;
    const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: tr(p.title, l), datePublished: p.date, author: p.author ? { '@type': 'Person', name: p.author } : { '@type': 'Organization', name: CFG.name }, inLanguage: l };
    return { alt: both('blog', p.slug), title: tr(p.title, l), desc: tr(p.excerpt, l), body, ld: [ld], path: pUrl(l, p) };
  });
}

// Contact
add((l) => {
  const opts = TREATMENTS.map((t) => `<option value="${esc(tr(t.name, l))}">${tr(t.name, l)}</option>`).join('');
  const times = [T('Sabah', 'Morning'), T('Öğleden sonra', 'Afternoon'), T('Akşam', 'Evening'), T('Fark etmez', 'Any time')];
  const f = {
    name: T('Ad Soyad', 'Full name'), phone: T('Telefon', 'Phone'), treat: T('Tedavi', 'Treatment'), pick: T('Seçiniz / emin değilim', 'Select / not sure'), time: T('Tercih edilen zaman', 'Preferred time'), msg: T('Mesajınız (isteğe bağlı)', 'Message (optional)'),
    consent: T('Kişisel verilerimin randevu amacıyla işlenmesini kabul ediyorum. (KVKK)', 'I agree to my personal data being processed for appointment purposes.'), send: T('WhatsApp ile Gönder', 'Send via WhatsApp'), mail: T('E-posta ile gönder', 'Send by email'),
    note: T('Talebiniz WhatsApp veya e-posta uygulamanızda hazır bir mesaj olarak açılır; göndererek randevu talebini iletirsiniz. Acil durumlarda lütfen telefonla arayın.', 'Your request opens as a ready-made message in WhatsApp or your email app; sending it delivers your request. In an emergency, please call.'),
  };
  const body = `${pageHero(l, tr(U.nav.contact, l), tr(T('Randevu ve iletişim', 'Appointments & contact'), l), tr(T('Muayene ücretsiz. Takvimden size uygun saati seçin ya da WhatsApp ile bize yazın.', 'The check-up is free. Pick a time in the calendar or message us on WhatsApp.'), l))}
<section class="sec"><div class="wrap split">
  <div class="card booking" id="randevu">
    <h2>${tr(T('Online randevu', 'Book online'), l)}</h2>
    <p class="lead">${tr(T('Takvimden size uygun gün ve saati seçin. Muayene ücretsiz.', 'Pick a day and time that suits you. The check-up is free.'), l)}</p>
    <iframe class="dt-widget" title="${tr(T('Online randevu takvimi', 'Online booking calendar'), l)}" loading="lazy" src="${CFG.bookingWidget}&referer=${encodeURIComponent(CFG.siteUrl + '/')}"></iframe>
    <p class="note">${tr(T('Takvim açılmıyorsa', 'If the calendar does not load,'), l)} <a href="${CFG.bookingUrl}" target="_blank" rel="noopener">${tr(T('buradan randevu alabilirsiniz', 'book here'), l)}</a>. ${tr(T('Randevu takvimi DoktorTakvimi hizmeti ile sunulur.', 'The booking calendar is provided by DoktorTakvimi.'), l)}</p>
  </div>
  <aside class="contact-side">
    <div class="card info"><ul class="plain"><li>${ic('pin')}<a href="${CFG.mapsUrl}" target="_blank" rel="noopener">${tr(CFG.address, l)}</a></li><li>${ic('phone')}<a href="${tel}">${CFG.phone}</a></li><li>${ic('wa')}<a href="${wa}" target="_blank" rel="noopener">WhatsApp</a></li></ul><h3>${tr(T('Çalışma saatleri', 'Opening hours'), l)}</h3>${hoursBlock(l)}</div>
    <a class="btn btn-outline btn-lg wa-big" href="${CFG.mapsUrl}" target="_blank" rel="noopener">${ic('pin')}${tr(U.dir, l)}</a>
    <div class="card info emerg">${ic('alert')}<div><h3>${tr(T('Acil durum', 'Emergency'), l)}</h3><p>${tr(T('Şiddetli ağrı, şişlik veya kırık diş için hemen arayın.', 'For severe pain, swelling or a broken tooth, call right away.'), l)}</p><a class="tel-link" href="${tel}">${CFG.phone}</a></div></div>
    ${mapEmbed()}
  </aside>
</div></section>`;
  return { alt: both('contact'), title: tr(T('İletişim ve Randevu', 'Contact & Appointments'), l), desc: tr(T('Gebze Dental Klinik randevu formu, telefon, WhatsApp, adres ve çalışma saatleri.', 'Gebze Dental Klinik appointment form, phone, WhatsApp, address and opening hours.'), l), body, path: url(l, 'contact') };
});

// Privacy
add((l) => {
  const paras = l === 'tr'
    ? ['Bu metin, randevu formu ve iletişim kanalları üzerinden paylaştığınız kişisel verilerin işlenmesine ilişkin genel bir aydınlatmadır.', 'Veri sorumlusu: Gebze Dental Klinik. Paylaştığınız ad, telefon ve randevu bilgileri yalnızca randevu oluşturmak ve sizinle iletişim kurmak amacıyla işlenir; üçüncü kişilerle paylaşılmaz.', 'KVKK kapsamında verilerinize erişme, düzeltme ve silinmesini isteme haklarınız vardır. Talepleriniz için WhatsApp veya telefon ile bize ulaşabilirsiniz.', 'Bu web sitesi çerez veya izleme aracı kullanmaz. Online randevu takvimi DoktorTakvimi tarafından sunulur; takvimde girdiğiniz bilgiler o hizmetin gizlilik politikasına tabidir. Harita ve yazı tipi Google hizmetlerinden yüklenir.']
    : ['This notice explains how personal data you share through the appointment form and our contact channels is processed.', 'Data controller: Gebze Dental Klinik. The name, phone and appointment details you share are used only to arrange your appointment and contact you, and are not shared with third parties.', 'Under Turkey’s KVKK you may request access to, correction of or deletion of your data. Contact us via WhatsApp or phone.', 'This website does not use cookies or tracking tools. The online booking calendar is provided by DoktorTakvimi; details you enter there are subject to that service’s privacy policy. The map and fonts are loaded from Google services.'];
  const body = `${pageHero(l, '', tr(T('Gizlilik ve KVKK Aydınlatma Metni', 'Privacy & KVKK Notice'), l))}<section class="sec"><div class="wrap narrow"><article class="prose">${paras.map((x) => `<p>${x}</p>`).join('')}</article></div></section>`;
  return { alt: both('privacy'), title: tr(T('Gizlilik ve KVKK', 'Privacy & KVKK'), l), desc: tr(T('Kişisel verilerin işlenmesine ilişkin aydınlatma metni.', 'Notice on the processing of personal data.'), l), body, path: url(l, 'privacy') };
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
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((u) => `<url><loc>${CFG.siteUrl}${u.loc}</loc><xhtml:link rel="alternate" hreflang="tr" href="${CFG.siteUrl}${u.alt.tr}"/><xhtml:link rel="alternate" hreflang="en" href="${CFG.siteUrl}${u.alt.en}"/></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${CFG.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${CFG.name}</title><link rel="icon" href="/assets/icon.png"><link rel="alternate" hreflang="tr" href="/tr/"><link rel="alternate" hreflang="en" href="/en/"><meta http-equiv="refresh" content="0;url=/tr/"><script>var l=(navigator.language||'tr').toLowerCase().indexOf('tr')===0?'tr':'en';location.replace('/'+l+'/');</script></head><body style="font-family:sans-serif;text-align:center;padding:4rem"><p><a href="/tr/">Türkçe</a> · <a href="/en/">English</a></p></body></html>`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 | ${CFG.name}</title><link rel="stylesheet" href="/assets/style.css"></head><body><main class="phero"><div class="wrap center"><h1>404</h1><p class="lead">Sayfa bulunamadı · Page not found</p><p><a class="btn btn-primary" href="/tr/">Ana sayfa</a> <a class="btn btn-outline" href="/en/">Home</a></p></div></main></body></html>`);
console.log(`Built ${urls.length} pages.`);

