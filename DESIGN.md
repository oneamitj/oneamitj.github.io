# Design

Visual system of amitj.me — "Mission Control": a cinematic dark portfolio where awe hands off to evidence. Defined in `css/site.css` (tokens at the top), with the retro terminal overlay styled separately in `css/terminal-overlay.css`.

## Theme

Dark-first, by intent: the scene is a CTO clicking through from LinkedIn at 9pm — the screen should feel like mission control at night: dark, alive, precise, quietly glowing. The heritage of the old green-CRT terminal site is evolved (refined phosphor), not cosplayed; the literal CRT look survives only inside the terminal overlay easter egg.

A light theme translates the same room to daylight: identical hues (170 neutral tint, phosphor 155, amber 85) with the lightness ramp inverted — mint-tinted paper canvas, white cards, accents deepened to emerald and bronze so every text role clears WCAG AA. Resolution order: saved choice (`localStorage.theme`) > OS `prefers-color-scheme` > dark. A pre-paint boot script in `<head>` stamps `data-theme` on `<html>`; the nav toggle (`#theme-toggle`, sun/moon) flips and persists it and syncs `<meta name="theme-color">`. Light tokens live in `:root[data-theme="light"]`; the few hardcoded dark literals have `[data-theme="light"]` twins at the end of `site.css`. The constellation canvas listens for `themechange` and swaps to the deep palette with boosted alphas (edges ×1.6, nodes ×1.25) so the network keeps equal presence on paper. The terminal overlay stays CRT-dark in both themes.

## Color

OKLCH throughout. Committed dark strategy: brand-tinted near-black canvas, one signature accent (phosphor green) plus a warm counterpoint (amber). Neutrals are tinted toward the brand hue (170).

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(14.5% 0.012 170)` | page canvas |
| `--bg-elev` | `oklch(17% 0.014 170)` | cards, panels |
| `--surface` | `oklch(19.5% 0.016 170)` | chrome bars, chat surfaces |
| `--line` / `--line-soft` | `oklch(30%/24% 0.02 170)` | hairline borders only (1px) |
| `--ink` | `oklch(94% 0.01 170)` | headings, primary text |
| `--ink-2` | `oklch(78% 0.022 170)` | body copy |
| `--ink-3` | `oklch(65% 0.024 170)` | mono labels, metadata |
| `--phosphor` | `oklch(86% 0.21 155)` | signature accent: CTAs, metrics, accent dot |
| `--amber` | `oklch(84% 0.14 85)` | warm counterpoint: periods, tags, role line |
| `--on-accent` | `oklch(16% 0.03 165)` | text on phosphor/amber fills |

Light-theme values (same roles): `--bg oklch(95.5% 0.008 170)`, `--surface oklch(98.8% 0.005 170)`, `--ink oklch(21% 0.02 170)`, `--phosphor oklch(46% 0.108 152)` (emerald), `--amber oklch(50% 0.103 85)` (bronze), `--on-accent oklch(98.5% 0.01 155)`; full set in `:root[data-theme="light"]`.

Semantics: phosphor = results, actions, "go"; amber = time, category, warmth. Never both on the same element.

## Typography

- **Bricolage Grotesque** (variable, opsz 12–96, wght 300–800): everything from display to body. Single family, contrast via weight (750 display / 620–640 titles / 400 body at ~380 for large ledes).
- **Fragment Mono**: data, labels, metrics, path markers, terminal DNA. Class `.mono`.
- **VT323**: terminal overlay only.
- Fluid `clamp()` scale: hero ≤6rem, titles ≤3.1rem, body fixed 1.0625rem/1.65. Display tracking −0.03em; `text-wrap: balance` on titles, `pretty` on prose. Light-on-dark compensation: +letter-spacing 0.005–0.02em, generous line-height.

## Signature motifs

- **Path markers**: each section opens with `$ cd ~/section` in mono phosphor — the site's named kicker system, tying the modern page to the working terminal behind `~`.
- **Accent dot**: section titles end with a phosphor period.
- **amit.yaml card**: profile-as-config-file, window chrome with dots.
- **Constellation canvas**: fixed background architecture diagram (nodes/edges/pulses, `js/constellation.js`), density-biased away from hero copy, fades on scroll, static frame under reduced motion. Interactive: the pointer joins the network (edges link to the cursor, nodes lean toward it), and any click/tap fires a **pulse burst** — a double shockwave ring plus a hop-by-hop chain reaction (BFS through the edge graph, 110ms per hop) that flashes nodes and sends sparks down edges. One autonomous burst fires beside the hero name ~1.7s after load, so every visitor sees the system come alive. Interactions stay lively down-page (alpha floor 0.55) while ambient layers fade.

## Motion

GSAP + ScrollTrigger + Lenis (vendored in `js/vendor/`). Ease: expo.out family, no bounce. One orchestrated hero entrance (~1.2s: nav → status → name with blur-out → role → lede → CTAs → proof strip). Scroll reveals are per-section and content-fitted: timeline rail scrub-draws, yaml card clip-path "prints", chips ripple (20ms stagger), quotes settle. Micro: underline slide on nav, arrow nudge on primary CTA, translateX on article titles. Everything JS-applied over a visible default; `prefers-reduced-motion` gets instant content.

## Layout

Max-width 76rem, gutter `clamp(1.25rem, 5vw, 3rem)`, section padding `clamp(6rem, 14vh, 10rem)`. Asymmetry for rhythm: about is 7/5 split with sticky yaml card, quote #2 pushes right, flagship project breaks the grid before a `repeat(auto-fit, minmax(300px, 1fr))` grid. Radii: 9–16px. Z-scale: canvas −1 → nav 100 → chat 600 → terminal 700 → toasts 800.

## Components

Buttons (`.btn-primary` phosphor fill / `.btn-ghost` hairline), chips (`.chip` outline, `.chip-expert` phosphor tint), timeline (`.timeline-item` + scrubbed rail), project cards (+ `.project-flagship`), pull quotes with underlined `<mark>` key sentences, article rows, chat panel + FAB, terminal overlay (CRT power-on scale-Y entrance).

## Accessibility

WCAG AA verified on all text tokens against `--bg`. Focus-visible: 2px phosphor outline. Full keyboard paths (Esc closes overlay/chat, `~` opens terminal). Semantic landmarks; content complete without JavaScript (JS-only affordances hidden via `<noscript>`).
