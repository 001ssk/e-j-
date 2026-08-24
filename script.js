/* Eesti Õendusjuhtide Ühing — lehe skriptid */
(function () {
  'use strict';

  /* --- Mobiilimenüü --------------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Sulge menüü' : 'Ava menüü');
    });
  }

  /* --- Sisuplokkide ilmumine ------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- Suvekooli staatus ja "täna" märgis ------------------------------ */
  var days = document.querySelectorAll('.day[data-day]');
  if (days.length) {
    var now = new Date();
    var today = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');

    var isToday = false;
    days.forEach(function (d) {
      if (d.getAttribute('data-day') === today) {
        isToday = true;
        var b = d.querySelector('.day__badge');
        if (b) { b.hidden = false; b.classList.add('badge--live'); b.textContent = 'Täna'; }
      }
    });

    var status = document.getElementById('staatus');
    if (status) {
      var start = new Date(2026, 7, 17);
      var end = new Date(2026, 7, 19, 23, 59);
      var txt;
      if (now < start) {
        var diff = Math.ceil((start - now) / 86400000);
        txt = diff === 1 ? 'Algab homme' : 'Algab ' + diff + ' päeva pärast';
      } else if (now <= end) {
        txt = isToday ? 'Suvekool käib praegu' : 'Suvekool käib';
      } else {
        txt = 'Suvekool on toimunud';
      }
      status.innerHTML = '<span class="badge ' +
        (now >= start && now <= end ? 'badge--live' : 'badge--gold') + '">' + txt + '</span>' +
        '<span>Hotell Pesa, Põlva linn</span><span>17.–19. august 2026</span>';
    }
  }

  /* --- Logogalerii: suurendus ja lemmikute märkimine -------------------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.logo-card'));
  var lb = document.getElementById('lightbox');

  if (cards.length && lb) {
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var current = 0;

    function show(i) {
      current = (i + cards.length) % cards.length;
      var c = cards[current];
      lbImg.src = c.getAttribute('data-src');
      lbImg.alt = 'Logokavand ' + c.getAttribute('data-no');
      lbCap.textContent = c.querySelector('.logo-card__label').textContent +
        '  ·  ' + (current + 1) + '/' + cards.length;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function hide() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    cards.forEach(function (c, i) {
      c.addEventListener('click', function (e) {
        if (e.target.closest('.logo-pick')) return;
        show(i);
      });
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); }
      });
    });

    lb.querySelector('.lb__close').addEventListener('click', hide);
    lb.querySelector('.lb__nav--prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lb__nav--next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) hide(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    /* Lemmikute märkimine (ainult selle külastuse ajaks, midagi ei salvestata) */
    var picked = [];
    var out = document.getElementById('valikud');

    function render() {
      if (!out) return;
      if (!picked.length) { out.textContent = 'veel valimata'; return; }
      var sorted = picked.slice().sort(function (a, b) { return a - b; });
      out.textContent = sorted.map(function (n) { return 'kavand ' + n; }).join(', ');
    }

    cards.forEach(function (c) {
      var no = parseInt(c.getAttribute('data-no'), 10);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'logo-pick';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Märgi kavand ' + no + ' lemmikuks');
      btn.textContent = '♡';
      btn.style.cssText =
        'position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;' +
        'border:1px solid var(--line);background:var(--white);color:var(--blue);' +
        'font-size:1rem;line-height:1;cursor:pointer;transition:all .2s';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var i = picked.indexOf(no);
        if (i === -1) {
          picked.push(no);
          btn.textContent = '♥';
          btn.style.background = 'var(--blue)';
          btn.style.color = '#fff';
          btn.style.borderColor = 'var(--blue)';
          btn.setAttribute('aria-pressed', 'true');
        } else {
          picked.splice(i, 1);
          btn.textContent = '♡';
          btn.style.background = 'var(--white)';
          btn.style.color = 'var(--blue)';
          btn.style.borderColor = 'var(--line)';
          btn.setAttribute('aria-pressed', 'false');
        }
        render();
      });
      c.appendChild(btn);
    });
    render();
  }
})();
