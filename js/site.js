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

    /* ============ Theme toggle ============ */
    // The boot script in <head> already set data-theme before first paint;
    // this only handles switching, persistence, and OS-preference follow.
    const themeBtn = document.getElementById('theme-toggle');
    function applyTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#ebf2ef' : '#0b1210');
        if (themeBtn) {
            themeBtn.setAttribute('aria-label',
                theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        }
        if (persist) {
            try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
        }
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    if (themeBtn) {
        themeBtn.setAttribute('aria-label',
            document.documentElement.getAttribute('data-theme') === 'light'
                ? 'Switch to dark theme' : 'Switch to light theme');
        themeBtn.addEventListener('click', function () {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next, true);
        });
    }
    // Follow OS changes live, but only while the visitor has not chosen manually
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        let saved = null;
        try { saved = localStorage.getItem('theme'); } catch (err) { /* private mode */ }
        if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark', false);
    });

    /* ============ Nav scrolled state ============ */
    const nav = document.getElementById('site-nav');
    function onScrollNav() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ============ Anchor navigation ============ */
    // Scrolling is fully native (wheel smoothing felt resistive on trackpads);
    // anchors glide via scrollIntoView + scroll-margin-top on sections.
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const id = link.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
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
            /* --- Cinematic hero exit: scrubbed departure as you scroll away --- */
            gsap.to('.hero-inner', {
                y: -70, scale: 0.95, autoAlpha: 0.15, filter: 'blur(7px)',
                transformOrigin: '20% 40%', ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 45%', scrub: 0.5 }
            });

            /* --- Path markers fade in; titles reveal word-by-word from masks --- */
            document.querySelectorAll('.path-marker').forEach(function (marker) {
                gsap.from(marker, {
                    y: 20, autoAlpha: 0, duration: 0.7, ease: 'expo.out',
                    scrollTrigger: { trigger: marker, start: 'top 80%' }
                });
            });

            // split a heading into masked word spans (keeps <br>; the accent
            // dot rides inside the previous word so it can never wrap alone)
            function splitWords(el) {
                let lastWord = null;
                Array.from(el.childNodes).forEach(function (node) {
                    if (node.nodeType === 3) {
                        const frag = document.createDocumentFragment();
                        node.textContent.split(/(\s+)/).forEach(function (part) {
                            if (!part) return;
                            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                            const mask = document.createElement('span');
                            mask.className = 'w-mask';
                            const w = document.createElement('span');
                            w.className = 'w';
                            w.textContent = part;
                            mask.appendChild(w);
                            frag.appendChild(mask);
                            lastWord = w;
                        });
                        el.replaceChild(frag, node);
                    } else if (node.nodeType === 1 && node.tagName !== 'BR') {
                        if (lastWord) { lastWord.appendChild(node); return; }
                        const mask = document.createElement('span');
                        mask.className = 'w-mask';
                        node.replaceWith(mask);
                        const w = document.createElement('span');
                        w.className = 'w';
                        w.appendChild(node);
                        mask.appendChild(w);
                        lastWord = w;
                    }
                });
                return el.querySelectorAll('.w');
            }

            document.querySelectorAll('.section-title, .contact-headline').forEach(function (title) {
                const words = splitWords(title);
                if (!words.length) return;
                gsap.from(words, {
                    yPercent: 115, duration: 0.75, ease: 'expo.out', stagger: 0.055,
                    scrollTrigger: { trigger: title, start: 'top 82%' }
                });
            });

            /* --- Metric count-ups: numbers tick up as they enter view --- */
            document.querySelectorAll('.metric, .project-metrics li, .proof-strip li').forEach(function (el) {
                const tokens = el.textContent.split(/(\d+)/);
                const nums = [];
                tokens.forEach(function (t, i) { if (/^\d+$/.test(t)) nums.push({ i: i, v: +t }); });
                if (!nums.length) return;
                const state = { p: 0 };
                gsap.to(state, {
                    p: 1, duration: 1.1, ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 90%' },
                    onUpdate: function () {
                        el.textContent = tokens.map(function (t, i) {
                            for (const n of nums) { if (n.i === i) return String(Math.round(n.v * state.p)); }
                            return t;
                        }).join('');
                    }
                });
            });

            /* --- About: copy rises, yaml card prints itself --- */
            gsap.from('.about-copy p', {
                y: 22, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.09,
                scrollTrigger: { trigger: '.about-copy', start: 'top 72%' }
            });
            /* --- amit.yaml types itself, line by line, then leaves the caret blinking --- */
            (function () {
                const lines = gsap.utils.toArray('.about-yaml .y-line');
                if (!lines.length) return;
                const tl = gsap.timeline({
                    scrollTrigger: { trigger: '.about-card', start: 'top 78%' }
                });
                tl.from('.about-card', { y: 24, autoAlpha: 0, duration: 0.55, ease: 'expo.out' });
                lines.forEach(function (line) {
                    const chars = Math.max(6, line.textContent.length);
                    tl.fromTo(line,
                        { clipPath: 'inset(-5% 102% -5% -2%)' },
                        {
                            clipPath: 'inset(-5% -2% -5% -2%)',
                            duration: Math.min(0.42, chars * 0.011),
                            ease: 'steps(' + Math.min(chars, 24) + ')'
                        }, '>0.04');
                });
                tl.call(function () {
                    lines[lines.length - 1].classList.add('typing'); // resting caret
                });
            })();

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

    /* ============ Tactile micro-interactions (pointer: fine only) ============ */
    if (hasGSAP && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        const gsap = window.gsap;

        /* --- Magnetic primary CTAs: the button leans toward the cursor --- */
        document.querySelectorAll('.btn-primary').forEach(function (btn) {
            btn.classList.add('magnetized');
            const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
            const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
            const sTo = gsap.quickTo(btn, 'scale', { duration: 0.25, ease: 'power3.out' });
            btn.addEventListener('pointermove', function (e) {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.14);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.2);
            });
            btn.addEventListener('pointerenter', function () { sTo(1.02); });
            btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); sTo(1); });
            btn.addEventListener('pointerdown', function () { sTo(0.97); });
            btn.addEventListener('pointerup', function () { sTo(1.02); });
        });

        /* --- 3D tilt + tracking glow on project cards --- */
        document.querySelectorAll('.project').forEach(function (card) {
            card.classList.add('tilt');
            gsap.set(card, { transformPerspective: 750 });
            const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
            const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
            const lift = gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power2.out' });
            card.addEventListener('pointermove', function (e) {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                const damp = Math.min(1, 380 / r.width); // wide cards tilt less
                ry(px * 6 * damp);
                rx(-py * 6 * damp);
                card.style.setProperty('--gx', ((px + 0.5) * 100).toFixed(1) + '%');
                card.style.setProperty('--gy', ((py + 0.5) * 100).toFixed(1) + '%');
            });
            card.addEventListener('pointerenter', function () { lift(-3); });
            card.addEventListener('pointerleave', function () { rx(0); ry(0); lift(0); });
        });
    }

    /* ============ Dev console easter egg ============ */
    try {
        console.log(
            '%c amitj %c you found the third interface.',
            'background:#3ce39b;color:#0b1210;padding:2px 8px;border-radius:3px;font-weight:bold;font-family:monospace',
            'color:#3ce39b;font-family:monospace'
        );
        console.log(
            '%cthe first is the page. the second hides behind the ~ key. this one is all yours.\nshipping something real? linkedin.com/in/oneamitj',
            'color:#7d8f87;font-family:monospace'
        );
    } catch (e) { /* consoles are optional */ }

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
        document.body.classList.add('terminal-open'); // body overflow:hidden locks the page

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
    const chatNew = document.getElementById('chat-new');
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    let chatBusy = false;

    // Conversation awareness without an API change: history rides inside the
    // one plain-text message as an XML block. First message goes raw.
    const HISTORY_MAX_TURNS = 8;    // 4 exchanges
    const HISTORY_TURN_CHARS = 600; // per-turn clip keeps the payload lean
    let chatHistory = [];
    // pristine greeting + suggestion chips, restored on "new chat"
    const chatLogHome = chatLog ? chatLog.innerHTML : '';

    function clipTurn(text) {
        return text.length > HISTORY_TURN_CHARS ? text.slice(0, HISTORY_TURN_CHARS) + '…' : text;
    }
    function buildPayload(message, history) {
        if (!history.length) return message;
        const lines = history.map(function (t) {
            return (t.role === 'user' ? 'User: ' : 'Assistant: ') + clipTurn(t.text);
        });
        return '<conversation_history>\n' + lines.join('\n') + '\n</conversation_history>\n\n' +
               '<current_message>\n' + message + '\n</current_message>';
    }
    function rememberTurn(history, role, text) {
        history.push({ role: role, text: text });
        while (history.length > HISTORY_MAX_TURNS) history.shift();
    }

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

    // Typewriter reveal for AI replies. The proxy returns the full text at
    // once; the reveal is presentation only, so input unlocks as soon as it
    // starts and a new submit completes any reveal still in flight.
    let revealFinish = null;
    function revealMsg(text) {
        const div = appendMsg('ai', '');
        const p = div.querySelector('p');
        if (reduceMotion) {
            p.textContent = text;
            chatLog.scrollTop = chatLog.scrollHeight;
            return;
        }
        div.classList.add('chat-msg-revealing');
        let i = 0;
        // chunk size scales with length: full reveal never takes over ~3.5s
        const step = Math.max(2, Math.round(text.length / 220));
        const timer = setInterval(function () {
            i += step;
            p.textContent = text.slice(0, i);
            chatLog.scrollTop = chatLog.scrollHeight;
            if (i >= text.length && revealFinish) revealFinish();
        }, 16);
        revealFinish = function () {
            clearInterval(timer);
            revealFinish = null;
            p.textContent = text;
            div.classList.remove('chat-msg-revealing');
            chatLog.scrollTop = chatLog.scrollHeight;
        };
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
        const text = message.trim();
        if (chatBusy || !text) return;
        chatBusy = true;
        if (revealFinish) revealFinish(); // settle any reply still typing out
        const sug = document.getElementById('chat-suggests');
        if (sug) sug.remove();
        appendMsg('user', text);
        if (chatInput) { chatInput.value = ''; chatInput.disabled = true; }
        const typing = showTyping();
        try {
            const reply = await askOneAI(buildPayload(text, chatHistory));
            typing.remove();
            revealMsg(reply);
            rememberTurn(chatHistory, 'user', text);
            rememberTurn(chatHistory, 'assistant', reply);
        } catch (err) {
            typing.remove();
            appendMsg('error', "Hmm, my AI brain didn't respond. Try again in a moment, or just ask the human: linkedin.com/in/oneamitj");
        } finally {
            chatBusy = false;
            if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
        }
    }

    function resetChat() {
        if (chatBusy) return; // never wipe mid-flight
        if (revealFinish) revealFinish(); // stop a reply still typing out
        chatHistory = [];
        if (chatLog) chatLog.innerHTML = chatLogHome;
        if (chatInput) { chatInput.value = ''; chatInput.focus(); }
    }
    if (chatNew) chatNew.addEventListener('click', resetChat);

    if (chatForm) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitChat(chatInput ? chatInput.value : '');
        });
    }
    // delegated so chips restored by resetChat keep working
    if (chatLog) {
        chatLog.addEventListener('click', function (e) {
            const btn = e.target.closest ? e.target.closest('.chat-suggest') : null;
            if (btn) submitChat(btn.textContent);
        });
    }
})();
