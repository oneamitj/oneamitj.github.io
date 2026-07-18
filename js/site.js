// site.js — navigation, motion choreography, clock, oneai chat, terminal overlay glue
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = typeof window.gsap !== 'undefined';

    /* ============ Melbourne clock ============ */
    const clockEl = document.getElementById('melb-clock');
    function updateClock() {
        if (!clockEl) return;
        try {
            const fmt = new Intl.DateTimeFormat('en-AU', {
                timeZone: 'Australia/Melbourne',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            });
            const t = fmt.format(new Date());
            clockEl.textContent = t;
            clockEl.setAttribute('datetime', t);
        } catch (e) { /* Intl timezone unsupported: leave placeholder */ }
    }
    updateClock();
    setInterval(updateClock, 1000);

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ============ Nav scrolled state ============ */
    const nav = document.getElementById('site-nav');
    function onScrollNav() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ============ Smooth scroll (Lenis) ============ */
    let lenis = null;
    if (!reduceMotion && typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({ lerp: 0.12, wheelMultiplier: 1 });
        if (hasGSAP && window.ScrollTrigger) {
            lenis.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
            window.gsap.ticker.lagSmoothing(0);
        } else {
            (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
        }
    }

    // Anchor navigation that respects Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) lenis.scrollTo(target, { offset: -64, duration: 1.1 });
            else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            history.pushState(null, '', id);
        });
    });

    /* ============ Motion choreography (GSAP) ============ */
    if (hasGSAP && !reduceMotion) {
        const gsap = window.gsap;
        if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

        /* --- Hero entrance: one orchestrated sequence --- */
        const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        heroTl
            .from('.site-nav', { y: -14, autoAlpha: 0, duration: 0.6 }, 0.1)
            .from('.hero-status', { y: 14, autoAlpha: 0, duration: 0.5 }, 0.18)
            .from('.hero-name', { y: 36, autoAlpha: 0, filter: 'blur(12px)', duration: 0.95 }, 0.26)
            .from('.hero-role', { y: 16, autoAlpha: 0, duration: 0.6 }, 0.55)
            .from('.hero-lede', { y: 18, autoAlpha: 0, duration: 0.6 }, 0.66)
            .from('.hero-cta .btn', { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.78)
            .from('.proof-strip li', { y: 10, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, 0.9)
            .from('.scroll-cue', { autoAlpha: 0, duration: 0.6 }, 1.15)
            // the system comes alive: one pulse burst ripples through the
            // constellation right after the entrance settles
            .call(function () {
                if (typeof window.constellationBurst !== 'function') return;
                const name = document.querySelector('.hero-name');
                const r = name ? name.getBoundingClientRect() : null;
                const x = r ? Math.min(window.innerWidth - 80, r.right + 140) : window.innerWidth * 0.62;
                const y = r ? r.top + r.height * 0.45 : window.innerHeight * 0.4;
                window.constellationBurst(x, y);
            }, null, 1.7);

        if (window.ScrollTrigger) {
            /* --- Section titles & path markers --- */
            document.querySelectorAll('.section').forEach(function (section) {
                const head = section.querySelectorAll('.path-marker, .section-title, .contact-headline');
                if (head.length) {
                    gsap.from(head, {
                        y: 26, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1,
                        scrollTrigger: { trigger: section, start: 'top 74%' }
                    });
                }
            });

            /* --- About: copy rises, yaml card prints itself --- */
            gsap.from('.about-copy p', {
                y: 22, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.09,
                scrollTrigger: { trigger: '.about-copy', start: 'top 72%' }
            });
            gsap.from('.about-card', {
                clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, y: 18,
                duration: 1.0, ease: 'expo.out',
                scrollTrigger: { trigger: '.about-card', start: 'top 78%' }
            });

            /* --- Journey: rail draws with scroll, entries slide in --- */
            gsap.to('#rail-fill', {
                height: '100%', ease: 'none',
                scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
            });
            document.querySelectorAll('.timeline-item').forEach(function (item) {
                gsap.from(item, {
                    x: -22, autoAlpha: 0, duration: 0.7, ease: 'expo.out',
                    scrollTrigger: { trigger: item, start: 'top 82%' }
                });
            });

            /* --- Work: flagship rises, grid staggers --- */
            gsap.from('.project-flagship', {
                y: 36, autoAlpha: 0, duration: 0.85, ease: 'expo.out',
                scrollTrigger: { trigger: '.project-flagship', start: 'top 80%' }
            });
            gsap.from('.project-grid .project', {
                y: 28, autoAlpha: 0, duration: 0.65, ease: 'expo.out', stagger: 0.07,
                scrollTrigger: { trigger: '.project-grid', start: 'top 82%' }
            });
            gsap.from('.project-more', {
                autoAlpha: 0, y: 14, duration: 0.6, ease: 'expo.out',
                scrollTrigger: { trigger: '.project-more', start: 'top 88%' }
            });

            /* --- Stack: rows reveal, chips ripple --- */
            document.querySelectorAll('.stack-group').forEach(function (group) {
                gsap.from(group.querySelectorAll('.chip'), {
                    y: 8, autoAlpha: 0, duration: 0.4, ease: 'power2.out', stagger: 0.02,
                    scrollTrigger: { trigger: group, start: 'top 88%' }
                });
            });
            gsap.from('.stack-title', {
                autoAlpha: 0, duration: 0.6,
                scrollTrigger: { trigger: '.stack', start: 'top 85%' }
            });

            /* --- Voices: each quote settles in --- */
            document.querySelectorAll('.quote').forEach(function (q) {
                gsap.from(q, {
                    y: 30, autoAlpha: 0, duration: 0.85, ease: 'expo.out',
                    scrollTrigger: { trigger: q, start: 'top 80%' }
                });
            });

            /* --- Writing: article rows cascade --- */
            gsap.from('.article-list li', {
                x: -18, autoAlpha: 0, duration: 0.55, ease: 'expo.out', stagger: 0.06,
                scrollTrigger: { trigger: '.article-list', start: 'top 82%' }
            });
            gsap.from('.speaking > *', {
                y: 18, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07,
                scrollTrigger: { trigger: '.speaking', start: 'top 80%' }
            });

            /* --- Contact: closer --- */
            gsap.from(['.contact-lede', '.contact-cta', '.contact-alt', '.terminal-hint'], {
                y: 20, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.09,
                scrollTrigger: { trigger: '.contact', start: 'top 70%' }
            });

            // Recalculate positions once web fonts settle
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
            }
        }
    }

    /* ============ Terminal overlay ============ */
    const overlay = document.getElementById('terminal-overlay');
    const openBtn = document.getElementById('open-terminal');
    const closeBtn = document.getElementById('close-terminal');
    const hintBtn = document.getElementById('terminal-hint');
    let lastFocus = null;
    let terminalOpen = false;

    function openTerminal(initialCmd) {
        if (!overlay || terminalOpen) return;
        terminalOpen = true;
        lastFocus = document.activeElement;
        overlay.hidden = false;
        // next frame so the transition can play
        requestAnimationFrame(function () { overlay.classList.add('open'); });
        document.body.classList.add('terminal-open');
        if (lenis) lenis.stop();

        // lazy-boot the retro terminal on first open
        let term = window.retroTerminal;
        if (!term && typeof window.bootTerminal === 'function') {
            term = window.bootTerminal();
        }
        const input = document.getElementById('input');
        if (input) setTimeout(function () { input.focus(); }, 60);

        if (initialCmd && term) {
            setTimeout(function () {
                term.stopTyping('silent');
                // let the welcome typewriter loop observe the stop flag before
                // starting a new typeText, or the two interleave
                setTimeout(function () {
                    const cmdDiv = document.createElement('div');
                    cmdDiv.innerHTML = '<span class="prompt">oneamitj@devops:~$</span> ' + initialCmd.replace(/[<>&]/g, '');
                    term.output.appendChild(cmdDiv);
                    term.executeCommand(initialCmd);
                }, 180);
            }, 350);
        }
    }

    function closeTerminal() {
        if (!overlay || !terminalOpen) return;
        terminalOpen = false;
        overlay.classList.remove('open');
        document.body.classList.remove('terminal-open');
        if (lenis) lenis.start();
        const done = function () { overlay.hidden = true; };
        if (reduceMotion) done();
        else setTimeout(done, 280);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (openBtn) openBtn.addEventListener('click', function () { openTerminal(); });
    if (hintBtn) hintBtn.addEventListener('click', function () { openTerminal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

    document.addEventListener('keydown', function (e) {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
        if ((e.key === '~' || e.key === '`') && !typing && !terminalOpen) {
            e.preventDefault();
            openTerminal();
        } else if (e.key === 'Escape' && terminalOpen) {
            closeTerminal();
        }
    });

    // Deep link: /?cmd=skills opens the terminal and runs the command
    const params = new URLSearchParams(window.location.search);
    const deepCmd = params.get('cmd');
    if (deepCmd) {
        window.addEventListener('load', function () {
            setTimeout(function () { openTerminal(deepCmd); }, 400);
        });
    }

    /* ============ oneai chat ============ */
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const suggests = document.getElementById('chat-suggests');
    let chatBusy = false;

    function toggleChat(open) {
        if (!panel || !fab) return;
        panel.hidden = !open;
        fab.setAttribute('aria-expanded', String(open));
        if (open && chatInput) chatInput.focus();
        else fab.focus();
    }
    if (fab) fab.addEventListener('click', function () { toggleChat(true); });
    if (chatClose) chatClose.addEventListener('click', function () { toggleChat(false); });

    function appendMsg(kind, text) {
        const div = document.createElement('div');
        div.className = 'chat-msg ' + (kind === 'user' ? 'chat-msg-user' : 'chat-msg-ai');
        if (kind === 'error') div.className = 'chat-msg chat-msg-ai chat-msg-error';
        const p = document.createElement('p');
        p.textContent = text;
        div.appendChild(p);
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-typing';
        div.setAttribute('aria-label', 'oneai is thinking');
        div.innerHTML = '<i></i><i></i><i></i>';
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        return div;
    }

    async function askOneAI(message) {
        const tokenHeaders = new Headers();
        tokenHeaders.append('X-Factor', Date.now().toString());
        const tokenResponse = await fetch('https://oneai-proxy.vercel.app/t0', {
            method: 'GET', headers: tokenHeaders, redirect: 'follow'
        });
        if (!tokenResponse.ok) throw new Error('token ' + tokenResponse.status);
        const tokenData = await tokenResponse.json();

        const aiHeaders = new Headers();
        aiHeaders.append('X-Factor', Date.now().toString());
        aiHeaders.append('Content-Type', 'text/plain');
        aiHeaders.append('Authorization', 'Bearer ' + tokenData.token);
        const aiResponse = await fetch('https://oneai-proxy.vercel.app/p0', {
            method: 'POST', headers: aiHeaders, body: message, redirect: 'follow'
        });
        if (!aiResponse.ok) throw new Error('ai ' + aiResponse.status);
        return aiResponse.text();
    }

    async function submitChat(message) {
        if (chatBusy || !message.trim()) return;
        chatBusy = true;
        if (suggests) suggests.remove();
        appendMsg('user', message.trim());
        if (chatInput) { chatInput.value = ''; chatInput.disabled = true; }
        const typing = showTyping();
        try {
            const reply = await askOneAI(message.trim());
            typing.remove();
            appendMsg('ai', reply);
        } catch (err) {
            typing.remove();
            appendMsg('error', "Hmm, my AI brain didn't respond. Try again in a moment, or just ask the human: linkedin.com/in/oneamitj");
        } finally {
            chatBusy = false;
            if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
        }
    }

    if (chatForm) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitChat(chatInput ? chatInput.value : '');
        });
    }
    document.querySelectorAll('.chat-suggest').forEach(function (btn) {
        btn.addEventListener('click', function () { submitChat(btn.textContent); });
    });
})();
