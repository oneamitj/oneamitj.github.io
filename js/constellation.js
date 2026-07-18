// Constellation — a living architecture diagram behind the hero.
// Nodes = services, edges = connections, pulses = data in flight.
// Interactive: the pointer joins the network, and clicks fire pulse
// bursts that propagate hop-by-hop through the graph.
(function () {
    'use strict';

    const canvas = document.getElementById('constellation');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const PHOSPHOR = '148, 238, 178';   // spring green
    const AMBER = '244, 200, 130';      // warm counterpoint

    let width = 0, height = 0, dpr = 1;
    let nodes = [];
    let pulses = [];      // ambient data-in-flight
    let sparks = [];      // burst propagation pulses
    let bursts = [];      // shockwave rings
    let flashes = [];     // node flash-ups during a burst
    let rafId = null;
    let running = false;
    let lastPulseAt = 0;
    let lastBurstAt = 0;
    let scrollFade = 1;
    let pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };

    const LINK_DIST = 150;
    const CURSOR_DIST = 190;
    const HOP_MS = 110;
    const MAX_HOPS = 6;

    function nodeCount() {
        const area = width * height;
        const base = Math.round(area / 26000);
        return Math.max(24, Math.min(width < 720 ? 34 : 72, base));
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
        if (!running) drawFrame(performance.now());
    }

    function seed() {
        const n = nodeCount();
        nodes = [];
        for (let i = 0; i < n; i++) {
            // Bias density away from the hero copy block (left-center)
            let x = Math.random(), y = Math.random();
            if (x < 0.55 && y > 0.2 && y < 0.75 && Math.random() < 0.55) {
                x = 0.5 + Math.random() * 0.5;
            }
            nodes.push({
                x: x * width,
                y: y * height,
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                r: Math.random() < 0.16 ? 2.2 : 1.1 + Math.random() * 0.6,
                hub: Math.random() < 0.16,
                warm: Math.random() < 0.14,
                depth: 0.4 + Math.random() * 0.6,   // parallax layer
                phase: Math.random() * Math.PI * 2  // breathing offset
            });
        }
        pulses = []; sparks = []; bursts = []; flashes = [];
    }

    function spawnPulse(now) {
        if (pulses.length >= 4) return;
        for (let attempt = 0; attempt < 12; attempt++) {
            const a = nodes[(Math.random() * nodes.length) | 0];
            const b = nodes[(Math.random() * nodes.length) | 0];
            if (a === b) continue;
            const dx = a.x - b.x, dy = a.y - b.y;
            if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
                pulses.push({ a, b, t: 0, start: now, dur: 900 + Math.random() * 700, warm: Math.random() < 0.25 });
                return;
            }
        }
    }

    // --- Pulse burst: shockwave + hop-by-hop chain reaction through the graph ---
    function burst(px, py, now) {
        now = now || performance.now();
        if (now - lastBurstAt < 140) return; // debounce double-fires
        lastBurstAt = now;

        bursts.push({ x: px, y: py, start: now });
        if (bursts.length > 3) bursts.shift();

        // nearest node = patient zero
        let origin = null, best = Infinity;
        for (const n of nodes) {
            const d2 = (n.x - px) * (n.x - px) + (n.y - py) * (n.y - py);
            if (d2 < best) { best = d2; origin = n; }
        }
        if (!origin) return;

        // BFS through the current edge graph
        const hop = new Map([[origin, 0]]);
        const queue = [origin];
        flashes.push({ node: origin, t0: now });
        while (queue.length) {
            const cur = queue.shift();
            const h = hop.get(cur);
            if (h >= MAX_HOPS) continue;
            for (const n of nodes) {
                if (hop.has(n)) continue;
                const dx = cur.x - n.x, dy = cur.y - n.y;
                if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
                    hop.set(n, h + 1);
                    queue.push(n);
                    const t0 = now + (h + 1) * HOP_MS;
                    flashes.push({ node: n, t0 });
                    sparks.push({ a: cur, b: n, start: now + h * HOP_MS, dur: HOP_MS * 2.4, warm: n.warm });
                }
            }
        }
        // keep the arrays bounded
        if (flashes.length > 200) flashes.splice(0, flashes.length - 200);
        if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
    }

    // Exposed so site.js can fire the "system comes alive" moment post-entrance
    window.constellationBurst = function (x, y) {
        if (reduceMotion.matches) return;
        burst(x, y);
    };

    function drawFrame(now) {
        ctx.clearRect(0, 0, width, height);
        if (scrollFade <= 0.02 && !bursts.length && !sparks.length) return;

        const px = (pointer.x - 0.5) * 14;
        const py = (pointer.y - 0.5) * 10;
        // interactions stay lively even when the ambient layer has faded
        const liveFade = Math.max(scrollFade, 0.55);

        // edges
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            const ax = a.x + px * a.depth, ay = a.y + py * a.depth;
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const bx = b.x + px * b.depth, by = b.y + py * b.depth;
                const dx = ax - bx, dy = ay - by;
                const d2 = dx * dx + dy * dy;
                if (d2 < LINK_DIST * LINK_DIST) {
                    const d = Math.sqrt(d2);
                    const alpha = (1 - d / LINK_DIST) * 0.1 * scrollFade;
                    ctx.strokeStyle = 'rgba(' + PHOSPHOR + ',' + alpha.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                }
            }
        }

        // the pointer joins the network
        if (pointer.active) {
            const cx = pointer.x * width, cy = pointer.y * height;
            for (const n of nodes) {
                const nx = n.x + px * n.depth, ny = n.y + py * n.depth;
                const dx = cx - nx, dy = cy - ny;
                const d2 = dx * dx + dy * dy;
                if (d2 < CURSOR_DIST * CURSOR_DIST) {
                    const d = Math.sqrt(d2);
                    const alpha = (1 - d / CURSOR_DIST) * 0.45 * liveFade;
                    ctx.strokeStyle = 'rgba(' + PHOSPHOR + ',' + alpha.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(nx, ny);
                    ctx.stroke();
                }
            }
        }

        // node flash lookup for this frame
        const flashBoost = new Map();
        for (let i = flashes.length - 1; i >= 0; i--) {
            const f = flashes[i];
            const dt = now - f.t0;
            if (dt > 650) { flashes.splice(i, 1); continue; }
            if (dt < -50) continue;
            const b = Math.exp(-(dt / 260) * (dt / 260));
            flashBoost.set(f.node, Math.max(flashBoost.get(f.node) || 0, b));
        }

        // nodes
        for (const n of nodes) {
            const nx = n.x + px * n.depth, ny = n.y + py * n.depth;
            const col = n.warm ? AMBER : PHOSPHOR;
            const breathe = n.hub ? Math.sin(now / 1200 + n.phase) * 0.35 : 0;
            const boost = flashBoost.get(n) || 0;
            const alpha = Math.min(0.95, ((n.hub ? 0.5 : 0.32) + boost * 0.6) * (boost > 0.05 ? liveFade : scrollFade));
            const radius = n.r + breathe + boost * 2.6;
            if (boost > 0.05) {
                ctx.shadowColor = 'rgba(' + col + ',' + (0.8 * boost).toFixed(3) + ')';
                ctx.shadowBlur = 14 * boost;
            }
            ctx.fillStyle = 'rgba(' + col + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            if (n.hub) {
                ctx.strokeStyle = 'rgba(' + col + ',' + ((0.14 + boost * 0.3) * scrollFade).toFixed(3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(nx, ny, radius + 3.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // shockwave rings
        for (let i = bursts.length - 1; i >= 0; i--) {
            const b = bursts[i];
            // clamp: rAF frame timestamps can trail performance.now() slightly
            const t = Math.max(0, (now - b.start) / 900);
            if (t >= 1) { bursts.splice(i, 1); continue; }
            const ease = 1 - Math.pow(1 - t, 3);
            const r = ease * 260;
            const alpha = (1 - t) * 0.28 * liveFade;
            ctx.strokeStyle = 'rgba(' + PHOSPHOR + ',' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
            ctx.stroke();
            // second, tighter ring for depth
            ctx.strokeStyle = 'rgba(' + PHOSPHOR + ',' + (alpha * 0.5).toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, r * 0.62, 0, Math.PI * 2);
            ctx.stroke();
        }

        // travelling pulses (ambient + burst sparks)
        drawPulses(pulses, now, px, py, scrollFade, 1.6, 8);
        drawPulses(sparks, now, px, py, liveFade, 1.9, 10);
    }

    function drawPulses(list, now, px, py, fade, size, blur) {
        for (let i = list.length - 1; i >= 0; i--) {
            const p = list[i];
            const t = (now - p.start) / p.dur;
            if (t >= 1) { list.splice(i, 1); continue; }
            if (t < 0) continue;
            const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const x = p.a.x + (p.b.x - p.a.x) * ease + px * p.a.depth;
            const y = p.a.y + (p.b.y - p.a.y) * ease + py * p.a.depth;
            const col = p.warm ? AMBER : PHOSPHOR;
            const glow = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * fade;
            ctx.fillStyle = 'rgba(' + col + ',' + (0.85 * glow).toFixed(3) + ')';
            ctx.shadowColor = 'rgba(' + col + ',' + (0.8 * glow).toFixed(3) + ')';
            ctx.shadowBlur = blur;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function tick(now) {
        if (!running) return;
        const cx = pointer.x * width, cy = pointer.y * height;
        for (const n of nodes) {
            // gentle attraction: the network leans toward the visitor
            if (pointer.active) {
                const dx = cx - n.x, dy = cy - n.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > 400 && d2 < CURSOR_DIST * CURSOR_DIST) {
                    const d = Math.sqrt(d2);
                    const pull = (1 - d / CURSOR_DIST) * 0.012;
                    n.vx += (dx / d) * pull;
                    n.vy += (dy / d) * pull;
                }
            }
            // damping keeps drift calm after interactions
            n.vx *= 0.985; n.vy *= 0.985;
            const speed = Math.hypot(n.vx, n.vy);
            if (speed < 0.05) { // never fully still
                n.vx += (Math.random() - 0.5) * 0.02;
                n.vy += (Math.random() - 0.5) * 0.02;
            }
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -20) n.x = width + 20; else if (n.x > width + 20) n.x = -20;
            if (n.y < -20) n.y = height + 20; else if (n.y > height + 20) n.y = -20;
        }
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;

        if (now - lastPulseAt > 1100) {
            lastPulseAt = now;
            spawnPulse(now);
        }
        drawFrame(now);
        rafId = requestAnimationFrame(tick);
    }

    function start() {
        if (running || reduceMotion.matches) return;
        running = true;
        rafId = requestAnimationFrame(tick);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    // --- wiring ---
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    window.addEventListener('scroll', function () {
        const vh = window.innerHeight || 1;
        scrollFade = Math.max(0.25, 1 - (window.scrollY / vh) * 0.6);
    }, { passive: true });

    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', function (e) {
            pointer.tx = e.clientX / Math.max(1, window.innerWidth);
            pointer.ty = e.clientY / Math.max(1, window.innerHeight);
            pointer.active = true;
        }, { passive: true });
        window.addEventListener('pointerleave', function () { pointer.active = false; });
    }

    // clicks and taps fire a pulse burst through the network
    document.addEventListener('pointerdown', function (e) {
        if (reduceMotion.matches || !running) return;
        if (document.body.classList.contains('terminal-open')) return;
        if (e.target.closest && e.target.closest('.chat-panel, .terminal-overlay')) return;
        // snap pointer to the touch point so the burst originates under the finger
        pointer.tx = e.clientX / Math.max(1, window.innerWidth);
        pointer.ty = e.clientY / Math.max(1, window.innerHeight);
        burst(e.clientX, e.clientY);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
    });

    reduceMotion.addEventListener('change', function () {
        if (reduceMotion.matches) { stop(); drawFrame(performance.now()); }
        else start();
    });

    resize();
    if (reduceMotion.matches) {
        drawFrame(performance.now()); // single static frame
    } else {
        start();
    }
})();
