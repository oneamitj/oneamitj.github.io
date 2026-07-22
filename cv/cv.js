// cv.js — theme toggle, nav state, scroll reveal, timeline rail for /cv/
// (lightweight vanilla equivalent of the main site's GSAP choreography —
// a resume page should stay fast, so no motion library is loaded here)
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ============ Theme toggle ============ */
    var themeBtn = document.getElementById('theme-toggle');
    function applyTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#ebf2ef' : '#0b1210');
        if (themeBtn) {
            themeBtn.setAttribute('aria-label',
                theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        }
        if (persist) {
            try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
        }
    }
    if (themeBtn) {
        themeBtn.setAttribute('aria-label',
            document.documentElement.getAttribute('data-theme') === 'light'
                ? 'Switch to dark theme' : 'Switch to light theme');
        themeBtn.addEventListener('click', function () {
            var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next, true);
        });
    }
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (err) { /* private mode */ }
        if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark', false);
    });

    /* ============ Nav scrolled state ============ */
    var nav = document.getElementById('site-nav');
    function onScrollNav() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ============ Anchor navigation ============ */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            history.pushState(null, '', id);
        });
    });

    /* ============ Scroll reveal ============ */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ============ Experience timeline rail fill ============ */
    var rail = document.querySelector('.timeline');
    var railFill = document.getElementById('cv-rail-fill');
    if (rail && railFill && !reduceMotion) {
        var ticking = false;
        function updateRailFill() {
            ticking = false;
            var rect = rail.getBoundingClientRect();
            var vh = window.innerHeight;
            var start = vh * 0.7;
            var end = vh * 0.6 - rect.height;
            var span = start - end;
            var progress = span > 0 ? (start - rect.top) / span : 0;
            progress = Math.max(0, Math.min(1, progress));
            railFill.style.height = (progress * 100) + '%';
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(updateRailFill); }
        }, { passive: true });
        window.addEventListener('resize', updateRailFill);
        updateRailFill();
    } else if (railFill) {
        railFill.style.height = '100%';
    }
}());
