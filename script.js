/**
 * Code&Craft — Main Script
 * Powered by Lenis Smooth Scroll & anime.js v3
 * Podium Automation Animation Clone System
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LENIS SMOOTH SCROLL INITIALIZATION
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
     2. NAVBAR SCROLL BLUR & DRAWER TOGGLE
     ============================================================ */
  const navWrapper = document.getElementById('cc-nav-wrapper');
  const burgerBtn  = document.getElementById('cc-burger');
  const menuDrawer = document.getElementById('cc-menu-drawer');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
  }, { passive: true });

  function toggleDrawer(open) {
    const isCurrentlyOpen = navWrapper.getAttribute('data-nav-status') === 'open';
    const nextState = open !== undefined ? open : !isCurrentlyOpen;

    navWrapper.setAttribute('data-nav-status', nextState ? 'open' : 'closed');
    menuDrawer.setAttribute('aria-hidden', nextState ? 'false' : 'true');

    if (lenis) {
      if (nextState) lenis.stop(); else lenis.start();
    }

    if (nextState) {
      const items = document.querySelectorAll('.drawer-nav-item');
      items.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
      });

      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
        delay: anime.stagger(60, { start: 200 }),
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      });
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => toggleDrawer());
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  /* ============================================================
     3. ANIMATED HORIZONTAL DIVIDER LINES (Podium Clip-Path Sweep)
     ============================================================ */
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-animate-line', 'animated');
        entry.target.classList.add('line-visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate-line]').forEach(line => {
    lineObserver.observe(line);
  });

  /* ============================================================
     4. LINE-BY-LINE TEXT SPLIT & REVEAL (Hero & Headings)
     ============================================================ */
  const lineHeadings = document.querySelectorAll('[sa-lines]');

  lineHeadings.forEach(heading => {
    const originalText = heading.innerHTML;
    const lines = originalText.split('<br>');

    heading.innerHTML = lines.map(lineText => {
      return `<span style="display:block; overflow:hidden;"><span class="sa-line-inner" style="display:block; transform:translateY(110%); opacity:0;">${lineText.trim()}</span></span>`;
    }).join('');

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const inners = entry.target.querySelectorAll('.sa-line-inner');
          anime({
            targets: inners,
            opacity: [0, 1],
            translateY: ['110%', '0%'],
            duration: 950,
            delay: anime.stagger(90, { start: 100 }),
            easing: 'cubicBezier(0.19, 1, 0.22, 1)'
          });
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    headingObserver.observe(heading);
  });

  /* ============================================================
     5. BLOCK & CHILDREN REVEAL ANIMATIONS
     ============================================================ */
  const blockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [32, 0],
          duration: 800,
          easing: 'cubicBezier(0.19, 1, 0.22, 1)'
        });
        blockObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[sa-block]').forEach(el => {
    el.style.opacity = '0';
    blockObserver.observe(el);
  });

  const childrenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        anime({
          targets: Array.from(children),
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 750,
          delay: anime.stagger(100),
          easing: 'cubicBezier(0.19, 1, 0.22, 1)'
        });
        childrenObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[sa-children]').forEach(el => {
    Array.from(el.children).forEach(c => c.style.opacity = '0');
    childrenObserver.observe(el);
  });

  /* ============================================================
     6. HERO METRIC COUNTERS
     ============================================================ */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(el => {
          const targetVal = parseInt(el.getAttribute('data-count'), 10);
          const counterObj = { val: 0 };
          anime({
            targets: counterObj,
            val: targetVal,
            round: 1,
            duration: 1800,
            easing: 'easeOutExpo',
            update: () => {
              el.textContent = counterObj.val;
            }
          });
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const metricsStrip = document.querySelector('.hero-metrics-strip');
  if (metricsStrip) counterObserver.observe(metricsStrip);

  /* ============================================================
     7. HERO CODE STREAM STREAMER
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

        anime({
          targets: row,
          opacity: [0, 1],
          translateY: [6, 0],
          duration: 200,
          easing: 'easeOutQuad'
        });

        lineIndex++;
        setTimeout(renderLine, 180 + Math.random() * 100);
      }
    }

    setTimeout(renderLine, 800);
  }

  /* ============================================================
     8. PORTFOLIO CAROUSEL SLIDER CONTROLS
     ============================================================ */
  const track = document.getElementById('portfolio-track');
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
     9. SERVICE DETAIL MODAL SYSTEM
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
