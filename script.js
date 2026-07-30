/**
 * Code&Craft — Main Animation Engine
 * Lenis Smooth Scroll + anime.js v3
 * Podium Automation Exact Animation System
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LENIS SMOOTH SCROLL & TICKER SYNC
     ============================================================ */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ============================================================
     2. PODIUM FLOATING PILL NAV (Scroll Collapse & Drawer)
     ============================================================ */
  const navWrapper   = document.getElementById('cc-nav-wrapper');
  const burgerInline = document.getElementById('cc-burger-inline');
  const menuDrawer   = document.getElementById('cc-menu-drawer');
  const drawerLinks  = document.querySelectorAll('[data-drawer-link]');

  const COLLAPSE_THRESHOLD = 80;
  function handleScrollNav() {
    if (!navWrapper) return;
    if (window.scrollY > COLLAPSE_THRESHOLD) {
      navWrapper.setAttribute('data-nav-desktop', 'closed');
    } else {
      navWrapper.setAttribute('data-nav-desktop', 'opened');
    }
  }

  window.addEventListener('scroll', handleScrollNav, { passive: true });
  if (lenis) lenis.on('scroll', handleScrollNav);
  handleScrollNav();

  function toggleDrawer(open) {
    if (!navWrapper || !menuDrawer) return;
    const isCurrentlyOpen = navWrapper.getAttribute('data-nav-status') === 'open';
    const nextState = open !== undefined ? open : !isCurrentlyOpen;

    navWrapper.setAttribute('data-nav-status', nextState ? 'open' : 'closed');
    menuDrawer.setAttribute('aria-hidden', nextState ? 'false' : 'true');

    if (lenis) {
      if (nextState) lenis.stop(); else lenis.start();
    }

    if (nextState && typeof anime !== 'undefined') {
      const items = document.querySelectorAll('.drawer-nav-item');
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 650,
        delay: anime.stagger(50, { start: 150 }),
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      });
    }
  }

  if (burgerInline) {
    burgerInline.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  /* ============================================================
     3. HERO LETTER-BY-LETTER ELASTIC STAGGER ([sa-letters])
     ============================================================ */
  const letterHeadings = document.querySelectorAll('[sa-letters]');
  letterHeadings.forEach(heading => {
    const rawText = heading.textContent.trim();
    heading.innerHTML = rawText.split('').map(char => {
      if (char === ' ') return '&nbsp;';
      return `<span class="letter-span" style="display:inline-block; opacity:0; transform:translateY(40px) rotate(8deg);">${char}</span>`;
    }).join('');

    const letters = heading.querySelectorAll('.letter-span');
    if (typeof anime !== 'undefined') {
      anime({
        targets: letters,
        opacity: [0, 1],
        translateY: [40, 0],
        rotate: [8, 0],
        duration: 900,
        delay: anime.stagger(35, { start: 250 }),
        easing: 'easeOutElastic(1, .6)'
      });
    } else {
      letters.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
    }
  });

  /* ============================================================
     4. HERO CODE STREAM TERMINAL
     ============================================================ */
  const codeStreamBody = document.getElementById('hero-code-stream');
  if (codeStreamBody) {
    const codeLines = [
      `<span class="code-cmt">// Code&amp;Craft Automated Pipeline</span>`,
      `<span class="code-kw">import</span> { CAD, Electronics, Software } <span class="code-kw">from</span> <span class="code-str">'@codecraft/core'</span>;`,
      `<br/>`,
      `<span class="code-kw">const</span> <span class="code-fn">project</span> = <span class="code-kw">new</span> Solutions({`,
      `  cadModel: <span class="code-str">"Fusion360_Precision.step"</span>,`,
      `  printMaterial: <span class="code-str">"PETG_HighTemp"</span>,`,
      `  pcbFirmware: <span class="code-str">"ESP32_WiFi_Sensor"</span>,`,
      `  webApp: <span class="code-str">"Fullstack_React_Node"</span>`,
      `});`,
      `<br/>`,
      `<span class="code-kw">await</span> project.<span class="code-fn">buildAndDeploy</span>();`,
      `<span class="code-cmt">// Status: 200 OK — Ready for hand-off</span>`
    ];

    let lineIndex = 0;
    const cursor = document.createElement('span');
    cursor.className = 'code-cursor';

    function renderLine() {
      if (lineIndex < codeLines.length) {
        const row = document.createElement('div');
        row.style.opacity = '0';
        row.style.transform = 'translateY(6px)';
        row.innerHTML = codeLines[lineIndex];

        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        codeStreamBody.appendChild(row);
        row.appendChild(cursor);
        codeStreamBody.scrollTop = codeStreamBody.scrollHeight;

        if (typeof anime !== 'undefined') {
          anime({
            targets: row,
            opacity: [0, 1],
            translateY: [6, 0],
            duration: 180,
            easing: 'easeOutQuad'
          });
        } else {
          row.style.opacity = '1';
          row.style.transform = 'none';
        }

        lineIndex++;
        setTimeout(renderLine, 140 + Math.random() * 80);
      }
    }

    setTimeout(renderLine, 500);
  }

  /* ============================================================
     5. HERO METRIC COUNTERS
     ============================================================ */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(el => {
          const targetVal = parseInt(el.getAttribute('data-count'), 10);
          const counterObj = { val: 0 };
          if (typeof anime !== 'undefined') {
            anime({
              targets: counterObj,
              val: targetVal,
              round: 1,
              duration: 1600,
              easing: 'easeOutExpo',
              update: () => {
                el.textContent = counterObj.val;
              }
            });
          } else {
            el.textContent = targetVal;
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const metricsStrip = document.querySelector('.hero-metrics-strip');
  if (metricsStrip) counterObserver.observe(metricsStrip);

  /* ============================================================
     6. ANIMATED HORIZONTAL DIVIDER LINES (Podium Clip-Path Sweep)
     ============================================================ */
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-animate-line', 'animated');
        entry.target.classList.add('line-visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate-line]').forEach(line => {
    lineObserver.observe(line);
  });

  /* ============================================================
     7. SCROLL REVEALS ([sa-lines], [sa-block], [sa-children])
     ============================================================ */
  const lineHeadings = document.querySelectorAll('[sa-lines]');
  lineHeadings.forEach(heading => {
    const rawHTML = heading.innerHTML;
    const lines = rawHTML.split('<br>');

    heading.innerHTML = lines.map(lineText => {
      return `<span style="display:block; overflow:hidden;"><span class="sa-line-inner" style="display:block; transform:translateY(105%); opacity:0;">${lineText.trim()}</span></span>`;
    }).join('');

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const inners = entry.target.querySelectorAll('.sa-line-inner');
          if (typeof anime !== 'undefined') {
            anime({
              targets: inners,
              opacity: [0, 1],
              translateY: ['105%', '0%'],
              duration: 900,
              delay: anime.stagger(90),
              easing: 'cubicBezier(0.19, 1, 0.22, 1)'
            });
          } else {
            inners.forEach(i => { i.style.opacity = '1'; i.style.transform = 'none'; });
          }
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    headingObserver.observe(heading);
  });

  const blockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (typeof anime !== 'undefined') {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 750,
            easing: 'cubicBezier(0.19, 1, 0.22, 1)'
          });
        }
        blockObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[sa-block]').forEach(el => {
    blockObserver.observe(el);
  });

  const childrenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = Array.from(entry.target.children);
        if (typeof anime !== 'undefined') {
          anime({
            targets: children,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            delay: anime.stagger(80),
            easing: 'cubicBezier(0.19, 1, 0.22, 1)'
          });
        }
        childrenObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[sa-children]').forEach(el => {
    childrenObserver.observe(el);
  });

  /* ============================================================
     8. SVG CIRCUIT PATH DRAWING ANIMATION
     ============================================================ */
  const svgPathObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const path = entry.target.querySelector('.circuit-path');
        if (path) path.classList.add('path-drawn');
        svgPathObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.circuit-divider-wrap').forEach(wrap => {
    svgPathObserver.observe(wrap);
  });

  /* ============================================================
     9. HERO GEOMETRIC CANVAS
     ============================================================ */
  const heroCanvas = document.getElementById('hero-particle-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width  = heroCanvas.width  = heroCanvas.parentElement.offsetWidth;
    let height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      width  = heroCanvas.width  = heroCanvas.parentElement.offsetWidth;
      height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 25;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.35 + 0.15
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245, 131, 50, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12, 66, 95, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ============================================================
     10. CUSTOM MAGNETIC SPOTLIGHT CURSOR
     ============================================================ */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top  = `${mouseY}px`;
    }, { passive: true });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top  = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    requestAnimationFrame(renderCursorRing);

    document.querySelectorAll('a, button, .service-editorial-row, .portfolio-card, .pricing-column').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width  = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'var(--orange)';
        cursorRing.style.backgroundColor = 'rgba(245, 131, 50, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width  = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'var(--orange)';
        cursorRing.style.backgroundColor = 'transparent';
      });
    });
  }

  /* ============================================================
     11. PORTFOLIO CAROUSEL SLIDER CONTROLS
     ============================================================ */
  const track   = document.getElementById('portfolio-track');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  if (track && prevBtn && nextBtn) {
    const getScrollStep = () => {
      const card = track.querySelector('.portfolio-card');
      return card ? card.offsetWidth + 32 : 440;
    };

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  /* ============================================================
     12. SERVICE DETAIL MODAL SYSTEM
     ============================================================ */
  const modalData = {
    '3d-design': {
      title: '3D Design & Printing',
      tag: 'HARDWARE & CAD',
      image: '3d-design.jpg',
      desc: 'We transform complex mechanical ideas into physical prototypes. High-precision 3D printing and CAD modeling using Fusion 360 & AutoCAD across PLA, PETG, and ABS materials.',
      features: ['Filament Printing (PLA, PETG, ABS)', 'Industrial CAD Modeling (Fusion 360)', 'Prototyping & Iterative Design', 'Post-processing & Surface Finishing']
    },
    'digital-arts': {
      title: 'Digital Arts & Branding',
      tag: 'CREATIVE & UI/UX',
      image: 'digital-design.jpg',
      desc: 'Pixel-perfect digital visual assets and UI/UX systems. We craft distinctive logo identities, brand guidelines, and user interfaces engineered for conversions.',
      features: ['Logo Design (Basic to Premium)', 'UI/UX Design for Web & Mobile', 'Social Media Asset Packs', 'Vector Illustrations & Icons']
    },
    'electronics': {
      title: 'Electronics & IoT Systems',
      tag: 'EMBEDDED SYSTEMS',
      image: 'logic-circuit.jpg',
      desc: 'Custom PCB design, circuit schematics, and embedded firmware development for microcontrollers including Arduino and ESP32 with wireless connectivity.',
      features: ['PCB Layout & Schematic Capture', 'Arduino & ESP32 Integration', 'Sensor Interfacing & Firmware', 'Wireless & IoT Connectivity']
    },
    'prototyping': {
      title: 'Rapid Prototyping',
      tag: 'PRODUCT FABRICATION',
      image: 'prototype-promo.jpg',
      desc: 'End-to-end MVP fabrication combining 3D-printed enclosures, custom PCB electronics, and embedded software ready for investor demos or field testing.',
      features: ['Full-stack MVP Development', 'Enclosure Design & Fabrication', 'Firmware Programming', 'System Integration Testing']
    },
    'software': {
      title: 'Software Development',
      tag: 'FULL-STACK CODE',
      image: 'programming.jpg',
      desc: 'High-performance web, desktop, and mobile software applications. From automation scripts in Python to React/Node web platforms and C++/Java applications.',
      features: ['Web Applications (React, Node.js)', 'Mobile App Development', 'Desktop Software (Java, C++)', 'Automation Scripts (Python)']
    }
  };

  const modalOverlay  = document.getElementById('service-modal');
  const modalImage    = document.getElementById('modal-image');
  const modalTag      = document.getElementById('modal-tag');
  const modalTitle    = document.getElementById('modal-title');
  const modalDesc     = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalCloseBtn = document.getElementById('close-modal');

  function openModal(id) {
    const data = modalData[id];
    if (!data || !modalOverlay) return;

    modalImage.src          = data.image;
    modalTag.textContent    = data.tag;
    modalTitle.textContent  = data.title;
    modalDesc.textContent   = data.desc;
    modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

    modalOverlay.classList.add('open');
    if (lenis) lenis.stop();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    if (lenis) lenis.start();
  }

  document.querySelectorAll('.service-editorial-row').forEach(row => {
    row.addEventListener('click', () => openModal(row.dataset.service));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(row.dataset.service);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

});
