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
})();
