// Synthérapies — menu mobile, année, formulaire de demande de rendez-vous
(function () {
  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En-tête : s'efface quand on descend, revient dès qu'on remonte
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var yNow = window.scrollY;
      var menuOpen = nav && nav.classList.contains('open');
      if (yNow > 240 && yNow > lastY + 4 && !menuOpen) header.classList.add('is-away');
      else if (yNow < lastY - 4 || yNow <= 240) header.classList.remove('is-away');
      lastY = yNow;
    }, { passive: true });
  }

  // Apparition lente des blocs à l'entrée dans l'écran
  if ('IntersectionObserver' in window && !calm) {
    var blocks = document.querySelectorAll('.section-head, .pillars, .split > *, .phases, .quote, .closing, .steps .step, .menu-item, .faq-group');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    blocks.forEach(function (b) { b.classList.add('reveal'); io.observe(b); });
  }

  // Pause respiration : une minute guidée, six souffles de 10 s partagés en section dorée
  // (3,82 s d'inspiration, 6,18 s d'expiration), comme l'animation du cercle
  var breathBtn = document.getElementById('breath-btn');
  var cue = document.getElementById('breath-cue');
  var stage = document.querySelector('.breath-stage');
  if (breathBtn && cue && stage) {
    var IDLE_CUE = cue.textContent, IDLE_BTN = breathBtn.textContent;
    var INHALE = 3820, EXHALE = 6180, CYCLES = 6;
    var timers = [], running = false;

    function say(text) {
      cue.classList.add('is-changing');
      timers.push(setTimeout(function () { cue.textContent = text; cue.classList.remove('is-changing'); }, calm ? 0 : 320));
    }
    function restartCircle() {
      // Relance l'animation du cercle pour qu'elle parte avec la première inspiration
      var img = stage.querySelector('img');
      stage.style.display = 'none'; void stage.offsetHeight; stage.style.display = '';
      if (img) { img.style.animation = 'none'; void img.offsetHeight; img.style.animation = ''; }
    }
    function stop(finalCue) {
      timers.forEach(clearTimeout); timers = [];
      running = false;
      breathBtn.textContent = IDLE_BTN;
      breathBtn.setAttribute('aria-pressed', 'false');
      cue.classList.remove('is-changing');
      cue.textContent = finalCue || IDLE_CUE;
      if (finalCue) timers.push(setTimeout(function () { if (!running) cue.textContent = IDLE_CUE; }, 8000));
    }
    function start() {
      running = true;
      breathBtn.textContent = 'Arrêter';
      breathBtn.setAttribute('aria-pressed', 'true');
      restartCircle();
      for (var i = 0; i < CYCLES; i++) {
        (function (n) {
          var t0 = n * (INHALE + EXHALE);
          timers.push(setTimeout(function () { say('Inspirez'); }, t0));
          timers.push(setTimeout(function () { say('Expirez'); }, t0 + INHALE));
        })(i);
      }
      timers.push(setTimeout(function () { stop('Reprenez à votre rythme'); }, CYCLES * (INHALE + EXHALE)));
    }
    breathBtn.setAttribute('aria-pressed', 'false');
    breathBtn.addEventListener('click', function () { running ? stop() : start(); });
  }

  // Formulaire de demande
  var form = document.getElementById('demande');
  if (!form) return;

  // Pré-sélection de la formule depuis l'adresse (?formule=premiere|suivi|mineur)
  var params = new URLSearchParams(location.search);
  var f = params.get('formule');
  var select = form.querySelector('#formule');
  if (f && select) {
    var opt = select.querySelector('option[data-key="' + f + '"]');
    if (opt) opt.selected = true;
  }

  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');
  var btnLabel = btn ? btn.textContent : '';

  function setStatus(type, msg) {
    status.hidden = false;
    status.className = 'form-status ' + type;
    status.textContent = msg;
  }

  function validate() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var valid = el.type === 'checkbox' ? el.checked : el.value.trim() !== '' && el.checkValidity();
      el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      var err = document.getElementById(el.id + '-error');
      if (err) err.textContent = valid ? '' : (el.dataset.error || 'Ce champ est requis.');
      if (!valid && ok) { el.focus(); ok = false; }
    });
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      setStatus('error', 'Merci de compléter les champs signalés.');
      return;
    }
    var key = form.querySelector('[name="access_key"]').value;
    if (!key || key.indexOf('VOTRE_CLE') === 0) {
      setStatus('error', "Le formulaire n'est pas encore activé. En attendant, merci d'appeler le 06 27 49 30 78.");
      return;
    }

    // Regroupe les moments préférés en une seule ligne lisible dans l'e-mail
    var data = new FormData(form);
    var moments = data.getAll('moments').join(', ');
    data.delete('moments');
    data.append('Moments préférés', moments || 'Indifférent');

    btn.disabled = true;
    btn.dataset.state = 'loading';
    btn.textContent = 'Envoi en cours…';
    status.hidden = true;

    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          setStatus('success', 'Merci, votre demande est bien envoyée. Je vous recontacte rapidement pour convenir ensemble d’un créneau.');
        } else {
          setStatus('error', "L'envoi n'a pas abouti. Vérifiez votre connexion puis réessayez, ou appelez le 06 27 49 30 78.");
        }
      })
      .catch(function () {
        setStatus('error', "L'envoi n'a pas abouti. Vérifiez votre connexion puis réessayez.");
      })
      .then(function () {
        btn.disabled = false;
        delete btn.dataset.state;
        btn.textContent = btnLabel;
      });
  });
})();
