/* Cookie consent: analytics only after an explicit "accept". Stores gdk_consent = granted | denied.
   No personal or health data is ever pushed to the dataLayer; only the Consent Mode update. */
(function () {
  var KEY = 'gdk_consent';
  var lang = (document.documentElement.lang || 'tr').slice(0, 2) === 'en' ? 'en' : 'tr';
  var TXT = {
    tr: { text: 'Sitemizi geliştirmek için, onay verirseniz ziyaret istatistiklerini kullanıyoruz.', ok: 'Kabul et', no: 'Reddet', more: 'Ayrıntılar', href: '/tr/gizlilik-kvkk/', label: 'Çerez tercihi' },
    en: { text: 'To improve our site, we use visit statistics if you give your consent.', ok: 'Accept', no: 'Decline', more: 'Details', href: '/en/privacy/', label: 'Cookie preference' }
  }[lang];

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: choice lasts for this page only */ } }
  function consent(state) {
    window.dataLayer = window.dataLayer || [];
    var g = window.gtag || function () { window.dataLayer.push(arguments); };
    g('consent', 'update', { analytics_storage: state });
  }

  var box = null;
  function close() { if (box) { box.classList.remove('show'); box.setAttribute('hidden', ''); } }
  function choose(v) { write(v); consent(v); close(); }

  function build() {
    box = document.createElement('div');
    box.className = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', TXT.label);
    box.hidden = true;
    box.innerHTML = '<p>' + TXT.text + ' <a href="' + TXT.href + '">' + TXT.more + '</a></p>' +
      '<div class="cc-act"><button type="button" class="cc-btn cc-ok">' + TXT.ok + '</button><button type="button" class="cc-btn cc-no">' + TXT.no + '</button></div>';
    box.querySelector('.cc-ok').addEventListener('click', function () { choose('granted'); });
    box.querySelector('.cc-no').addEventListener('click', function () { choose('denied'); });
    document.body.appendChild(box);
  }
  function open() {
    if (!box) build();
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('show'); });
  }

  var saved = read();
  if (saved !== 'granted' && saved !== 'denied') open();

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cookie-settings]')) open();
  });
})();
