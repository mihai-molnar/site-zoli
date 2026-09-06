/* R89 Repairs — interacțiuni minime (meniu mobil, dropdown, formulare mock).
   La trecerea pe PHP: se păstrează; blocul "formulare mock" se elimină
   (formularele vor trimite real către handler-ele PHP). */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  var mobile = window.matchMedia('(max-width: 980px)');

  /* Umbră pe header după scroll */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 4); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Meniu mobil */
  function closeNav() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Deschide meniul');
  }
  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
  });

  /* Dropdown "Servicii": hover pe desktop (CSS), tap pe mobil (JS) */
  Array.prototype.forEach.call(document.querySelectorAll('.main-nav .has-dropdown > a'), function (link) {
    link.addEventListener('click', function (e) {
      if (!mobile.matches) return;
      e.preventDefault();
      var li = link.parentElement;
      var open = li.classList.toggle('open');
      link.setAttribute('aria-expanded', String(open));
    });
  });

  /* Închide meniul mobil după click pe un link */
  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (mobile.matches && a.parentElement.classList.contains('has-dropdown')) return;
    closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeNav();
    Array.prototype.forEach.call(document.querySelectorAll('.main-nav .open'), function (li) { li.classList.remove('open'); });
  });

  /* Link activ în meniu, în funcție de "pagina" vizibilă */
  var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav > li > a[href^="#"]'));
  function setActive(id) {
    var target = id.indexOf('servicii') === 0 ? '#servicii' : '#' + id;
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === target); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.page[id]'), function (p) { io.observe(p); });
  }

  /* Preselectează echipamentul în formular când se vine de pe o pagină de serviciu */
  Array.prototype.forEach.call(document.querySelectorAll('a[data-equip]'), function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('echipament');
      if (sel) sel.value = a.getAttribute('data-equip');
    });
  });

  /* Formulare mock: validare nativă + mesaj de confirmare, fără trimitere */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-mock]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('is-sent');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
