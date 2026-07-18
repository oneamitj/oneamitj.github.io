// Constellation — a living architecture diagram behind the hero.
// Nodes = services, edges = connections, pulses = data in flight.
// Subtle by design: it should read as atmosphere, not decoration.
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
    let pulses = [];
    let rafId = null;
    let running = false;
    let lastPulseAt = 0;
    let scrollFade = 1;
    let pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const LINK_DIST = 150;

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
                depth: 0.4 + Math.random() * 0.6   // parallax layer
            });
        }
        pulses = [];
    }

    function spawnPulse(now) {
        if (pulses.length >= 4) return;
        // pick a random connected pair
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

    function drawFrame(now) {
        ctx.clearRect(0, 0, width, height);
        if (scrollFade <= 0.02) return;

        const px = (pointer.x - 0.5) * 14;
        const py = (pointer.y - 0.5) * 10;

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

        // nodes
        for (const n of nodes) {
            const nx = n.x + px * n.depth, ny = n.y + py * n.depth;
            const col = n.warm ? AMBER : PHOSPHOR;
            const alpha = (n.hub ? 0.5 : 0.32) * scrollFade;
            ctx.fillStyle = 'rgba(' + col + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
            ctx.fill();
            if (n.hub) {
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.14 * scrollFade).toFixed(3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(nx, ny, n.r + 3.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // pulses (data in flight)
        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t = (now - p.start) / p.dur;
            if (p.t >= 1) { pulses.splice(i, 1); continue; }
            const ease = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
            const x = p.a.x + (p.b.x - p.a.x) * ease + px * p.a.depth;
            const y = p.a.y + (p.b.y - p.a.y) * ease + py * p.a.depth;
            const col = p.warm ? AMBER : PHOSPHOR;
            const fade = Math.sin(p.t * Math.PI) * scrollFade;
            ctx.fillStyle = 'rgba(' + col + ',' + (0.85 * fade).toFixed(3) + ')';
            ctx.shadowColor = 'rgba(' + col + ',' + (0.8 * fade).toFixed(3) + ')';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function tick(now) {
        if (!running) return;
        // drift
        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -20) n.x = width + 20; else if (n.x > width + 20) n.x = -20;
            if (n.y < -20) n.y = height + 20; else if (n.y > height + 20) n.y = -20;
        }
        // pointer easing
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
        }, { passive: true });
    }

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
