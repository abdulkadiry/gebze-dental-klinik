(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var hdr = $('#hdr'), drawer = $('#drawer'), burger = $('#burger');

  // header shrink
  var onScroll = function () { hdr && hdr.classList.toggle('small', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // drawer
  function setDrawer(open) {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () { setDrawer(true); });
    $('#drawer-close').addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
  }

  // active nav
  var p = location.pathname;
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (p.indexOf(a.getAttribute('href')) === 0) a.classList.add('on');
  });

  // year
  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    items.forEach(function (n) { io.observe(n); });
  } else items.forEach(function (n) { n.classList.add('in'); });

  // booking form -> WhatsApp / e-mail
  var form = $('#randevu');
  if (form) {
    var lang = form.dataset.lang;
    var L = lang === 'tr'
      ? { n: 'Ad Soyad', p: 'Telefon', t: 'Tedavi', z: 'Tercih edilen zaman', m: 'Mesaj', subj: 'Randevu talebi', hello: 'Merhaba, randevu almak istiyorum.', err: 'Lütfen ad, telefon ve onay kutusunu doldurun.', ok: 'Mesaj hazırlandı; gönderimi uygulamada tamamlayın.' }
      : { n: 'Full name', p: 'Phone', t: 'Treatment', z: 'Preferred time', m: 'Message', subj: 'Appointment request', hello: 'Hello, I would like to book an appointment.', err: 'Please fill in your name, phone and the consent box.', ok: 'Message prepared; finish sending in the app.' };
    var channel = 'wa';
    form.querySelectorAll('button[type=submit]').forEach(function (b) { b.addEventListener('click', function () { channel = b.dataset.channel; }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = false;
      ['name', 'phone'].forEach(function (k) { var v = f[k].value.trim(); f[k].classList.toggle('invalid', !v); if (!v) bad = true; });
      if (!f.consent.checked) bad = true;
      var st = $('[data-status]', form);
      if (bad) { st.textContent = L.err; return; }
      var lines = [L.hello, L.n + ': ' + f.name.value.trim(), L.p + ': ' + f.phone.value.trim()];
      if (f.treatment.value) lines.push(L.t + ': ' + f.treatment.value);
      lines.push(L.z + ': ' + f.time.value);
      if (f.message.value.trim()) lines.push(L.m + ': ' + f.message.value.trim());
      var text = lines.join('\n');
      st.textContent = L.ok;
      if (channel === 'wa') window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      else location.href = 'mailto:' + form.dataset.mail + '?subject=' + encodeURIComponent(L.subj) + '&body=' + encodeURIComponent(text);
    });
  }
})();
