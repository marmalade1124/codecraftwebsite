# Motion and section inventory

Reference: https://www.sybiosme.com/en. The earlier MCP recordings caught the hero only because the site scrolls inside `[data-scroller]`. Later direct-browser inspection traversed the internal scroller to the footer. The following maps those observed passages to authored CodeCraft equivalents. Timings below describe this implementation; they are not claimed as recovered source timings.

| Scene | Observed reference | CodeCraft implementation | Fallback |
|---|---|---|---|
| Arrival | Dark shutters open to the gray hero | 1.2s CSS shutter opening, hero/text entrance, no blocking pointer layer | Immediate visible content |
| Hero | Moving reflective sphere converted to halftone dots | Public 8x8 sprite sampled onto a 2D dot field; 64 frames, about 14fps; scroll parallax | Still frame; hidden/failed canvas does not hide content |
| Approach | Large rounded charcoal panel and four chart panels | Matching panel composition and one-shot bar/chart reveal | All panels remain readable |
| Process | Long dotted date/timeline at left, three sequential text steps at right | GSAP pin within 580svh desktop / 520svh mobile region; four copy states; canvas updates with scroll progress; scrub .7 | Unpinned stacked steps |
| Continued journey | Dotted road grows and carries the final statement | Last state of the same process canvas and timeline | Final statement in normal flow |
| Work | Large central headline, moving/rotating portfolio planes, transition to white | Four CSS 3D planes; GSAP pinned 570svh desktop / 460svh mobile; scrub 1; light field crossfade | Standard image grid |
| Project cards | White plan cards, inner textured faces, selection controls and sticky summary | Three CodeCraft scopes, radio selection, summary, add-on toggles; no fabricated prices | Native controls remain usable |
| Brief | Three-step subscription/checkout region in reference | Honest local brief preparation followed by existing CodeCraft inquiry form | Form content visible, external inquiry CTAs remain |
| FAQ/contact | Grouped disclosures and sticky contact/email panel | Native details/summary, sticky desktop card, normal-flow mobile card | Native disclosures and mail links |
| Footer | Large two-line statement, CTAs/link columns, orange bottom strip | Matching layout adapted to CodeCraft | Static content |
| Controls | Contact, sound, account and dot-menu circles | Contact anchor, opt-in synthesized ambient audio, inquiry link and accessible menu; separate motion preference inside menu | Direct links and reduced-motion system preference |

Motion uses locally bundled GSAP and ScrollTrigger. All particle and image layers are decorative and marked aria-hidden where appropriate; content stays in HTML. Pause reverts scene contexts to a static readable layout. No fake payment, delivery, or login success states are implemented.

The source and offline lifecycle checks pass. Full-page visual and performance comparison remains blocked by the browser origin-approval denial from this turn. No per-band visual score or browser acceptance is claimed.
