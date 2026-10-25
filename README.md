# Code&Craft website

A buildless static website. All runtime fonts, imagery and GSAP libraries are local. No API key or package installation is required to view it.

## Preview

Run `python -m http.server 4174 --bind 127.0.0.1`, then open http://127.0.0.1:4174/.

## Checks

Install development-only test dependencies with `npm ci`, then run `npm run check` and `npm test`.

The checks cover local assets and anchors, five service mappings, quote URLs, project-brief formatting, offline DOM interactions, menu/dialog focus handling, selection summary, add-ons, copying, stale-brief invalidation, trimmed-input validation, pinned-scene lifecycle, finite particle geometry, pause cleanup and missing-library fallback. Linkedom is used only for tests. Those tests do not render CSS or certify browser motion performance.

## Complete page rebuild — 2026-10-25

The user requested a close reproduction of the complete https://www.sybiosme.com/en experience. The rebuild includes:

- Full-screen gray halftone sphere, opening shutters, large white wordmark and circular navigation.
- Rounded approach and four benefit panels.
- One pinned process/road scene spanning the three steps and continuing statement.
- A pinned portfolio scene with four traveling, rotating 3D image planes and a dark-to-light transition.
- Three selectable project cards, a sticky summary, three optional add-ons and a project-brief panel.
- Ten FAQ disclosures, a contact panel, and a large light closing footer with orange strip.
- User-started ambient audio; background-animation pause; reduced-motion/static and no-library layouts.

GSAP 3.13.0 and ScrollTrigger are bundled in `assets/vendor/` for pinned timelines and scrubbed 3D transforms. They replace ad-hoc scroll math. Sphere playback pauses offscreen and when the page is hidden. The dotted road draws only on scroll updates. No audio starts automatically.

## Functional boundary

CodeCraft content and the existing external project inquiry destination are retained. The selection/brief interface is an inquiry configurator, not billing: no prices, subscriptions or payments are invented. The brief is prepared in browser memory and can be copied into the existing inquiry form. It is not saved or sent automatically. The email panel opens a mail draft in the visitor's configured email app. Account-shaped navigation opens the existing inquiry app, rather than implementing new accounts.

## Reference assets and evidence

The public reference sphere sprite is `assets/hero-sphere.avif`; Overused Grotesk font files are in `assets/fonts/`. These are reference assets, not original CodeCraft artwork. Existing CodeCraft project photos are used for the portfolio. Source inspection and local study evidence are in ignored `output/reference-review/`. See `MOTION.md` for scene mapping.

## Verification limits

The preceding hero version had browser checks. This complete rebuild has passed syntax, asset, pure-function and offline DOM tests, but has NOT received visual browser acceptance: the connected browser rejected localhost access during this turn. The permission denial was respected; no alternate browser or screenshot tool was used to bypass it. Responsive CSS, native validation, audio playback, visual transitions and performance need a real-browser pass. Do not describe the result as a pixel-perfect or fully verified copy.

No production deployment was performed. A static deployment package is prepared separately without node_modules, tests, graph data or study artifacts.

## Netlify deployment

`npm run build` prepares `dist/` and verifies runtime assets. `netlify.toml` tells Netlify to run that command and publish only `dist/`. Tests, project graphs and study artifacts remain outside the published site.
