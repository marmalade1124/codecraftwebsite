/**
 * CodeCraft — script.js
 * Powered by anime.js v4
 * Brand: #F58332 (orange) · #0C425F (navy)
 */

/* =============================================
   WAIT FOR DOM
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. NAV — Scroll Blur + Active Link Spy
     ============================================= */
  const nav = document.getElementById('cc-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // Scroll → frosted glass
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link spy
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =============================================
     2. MOBILE MENU
     ============================================= */
  const hamburger  = document.getElementById('cc-hamburger');
  const mobileMenu = document.getElementById('cc-mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      toggleMenu(!mobileMenu.classList.contains('active'));
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* =============================================
     3. HERO ANIMATIONS (anime.js v4)
     ============================================= */
  const heroWords = document.querySelectorAll('.hero-heading .word-wrap');
  const heroBadge = document.querySelector('.hero-badge');
  const heroSub   = document.querySelector('.hero-subtext');
  const heroActions = document.querySelector('.hero-actions');
  const heroStats = document.querySelectorAll('.hero-stat');

  // Stagger word reveal
  if (heroWords.length) {
    anime({
      targets: heroWords,
      opacity: [0, 1],
      translateY: ['60%', '0%'],
      easing: 'cubicBezier(0.21, 1, 0.34, 1)',
      duration: 900,
      delay: anime.stagger(80, { start: 200 }),
    });
  }

  // Badge + subtext + actions
  if (heroBadge) {
    anime({
      targets: [heroBadge, heroSub, heroActions],
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'cubicBezier(0.21, 1, 0.34, 1)',
      duration: 700,
      delay: anime.stagger(120, { start: 600 }),
    });
  }

  // Terminal card slide-in
  const termCard = document.querySelector('.hero-terminal');
  if (termCard) {
    anime({
      targets: termCard,
      opacity: [0, 1],
      translateX: [60, 0],
      easing: 'cubicBezier(0.21, 1, 0.34, 1)',
      duration: 900,
      delay: 400,
    });
  }

  // Stats count up
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: target,
        easing: 'easeOutExpo',
        duration: 1800,
        delay: 800,
        round: 1,
        update() { el.textContent = obj.val; },
      });
    });
  }
  animateCounters();

  /* =============================================
     4. TERMINAL CODE TYPING
     ============================================= */
  const terminalBody = document.getElementById('terminal-code-body');
  if (terminalBody) {
    const codeLines = [
      { html: '<span class="code-keyword">import</span> <span class="code-plain">{</span> <span class="code-func">Solutions</span> <span class="code-plain">}</span> <span class="code-keyword">from</span> <span class="code-string">\'@codecraft/core\'</span><span class="code-plain">;</span>' },
      { html: '<br/>' },
      { html: '<span class="code-comment">// Turning ideas into reality</span>' },
      { html: '<span class="code-keyword">const</span> <span class="code-func">Project</span> <span class="code-plain">= () => {</span>' },
      { html: '<span class="code-plain pl-4">  </span><span class="code-keyword">return</span> <span class="code-plain">(</span>' },
      { html: '<span class="code-plain">    &lt;</span><span class="code-func">Solutions</span>' },
      { html: '<span class="code-plain">      type</span><span class="code-plain">={[</span><span class="code-string">\'3D_Print\'</span><span class="code-plain">, </span><span class="code-string">\'Web_Dev\'</span><span class="code-plain">]}</span>' },
      { html: '<span class="code-plain">      quality</span><span class="code-plain">={</span><span class="code-string">"PixelPerfect"</span><span class="code-plain">}</span>' },
      { html: '<span class="code-plain">    /></span>' },
      { html: '<span class="code-plain">  );</span>' },
      { html: '<span class="code-plain">};</span>' },
      { html: '<br/>' },
      { html: '<span class="code-keyword">export default</span> <span class="code-func">Project</span><span class="code-plain">;</span>' },
    ];

    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';

    function typeLine() {
      if (i < codeLines.length) {
        const wrap = document.createElement('div');
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateX(-8px)';
        wrap.innerHTML = codeLines[i].html;
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        terminalBody.appendChild(wrap);
        wrap.appendChild(cursor);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        anime({
          targets: wrap,
          opacity: [0, 1],
          translateX: [-8, 0],
          duration: 250,
          easing: 'easeOutQuad',
        });

        i++;
        setTimeout(typeLine, 180 + Math.random() * 120);
      } else {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      }
    }

    setTimeout(typeLine, 1200);
  }

  /* =============================================
     5. SCROLL-TRIGGERED REVEAL (IntersectionObserver + anime)
     ============================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const dir = el.classList.contains('will-animate-left') ? 'left'
                : el.classList.contains('will-animate-right') ? 'right'
                : 'up';

      anime({
        targets: el,
        opacity: [0, 1],
        translateY: dir === 'up'    ? [30, 0] : [0, 0],
        translateX: dir === 'left'  ? [-40, 0]
                  : dir === 'right' ? [40, 0] : [0, 0],
        easing: 'cubicBezier(0.21, 1, 0.34, 1)',
        duration: 750,
        complete() {
          el.style.opacity = '1';
          el.style.transform = 'none';
        },
      });

      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.will-animate, .will-animate-left, .will-animate-right')
    .forEach(el => revealObserver.observe(el));

  // Staggered children reveal
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const children = entry.target.querySelectorAll(':scope > *');
      anime({
        targets: Array.from(children),
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'cubicBezier(0.21, 1, 0.34, 1)',
        duration: 700,
        delay: anime.stagger(80),
      });

      staggerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-stagger]')
    .forEach(el => {
      el.querySelectorAll(':scope > *').forEach(c => { c.style.opacity = '0'; });
      staggerObserver.observe(el);
    });

  // Process steps
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const steps = entry.target.querySelectorAll('.process-step');
      anime({
        targets: steps,
        opacity: [0, 1],
        translateY: [24, 0],
        easing: 'cubicBezier(0.21, 1, 0.34, 1)',
        duration: 700,
        delay: anime.stagger(120),
      });
      processObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  const processGrid = document.querySelector('.process-steps');
  if (processGrid) {
    processGrid.querySelectorAll('.process-step').forEach(s => { s.style.opacity = '0'; });
    processObserver.observe(processGrid);
  }

  /* =============================================
     6. SERVICE CARDS — Magnetic Hover
     ============================================= */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      anime({
        targets: card,
        rotateX: -dy * 4,
        rotateY: dx * 4,
        duration: 300,
        easing: 'easeOutQuad',
      });
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        duration: 600,
        easing: 'cubicBezier(0.21, 1, 0.34, 1)',
      });
    });
  });

  /* =============================================
     7. SERVICE MODAL
     ============================================= */
  const servicesData = {
    '3d-design': {
      title: '3D Design & Printing',
      desc: 'We transform your concepts into tangible reality. From intricate industrial parts to artistic sculptures, our high-precision 3D printing and CAD modeling services cover it all. Filament types include PLA, PETG, and ABS for every application.',
      image: '3d-design.jpg',
      tag: 'Fusion 360',
      features: [
        'Filament Printing (PLA, PETG, ABS)',
        'Industrial CAD Modeling (Fusion 360)',
        'Prototyping & Iterative Design',
        'Post-processing & Surface Finishing',
      ],
    },
    'digital-arts': {
      title: 'Digital Arts & Branding',
      desc: 'Elevate your brand with stunning visuals. We specialize in creating cohesive brand identities, user interfaces, and engaging motion graphics that leave a lasting impression on every screen and print.',
      image: 'digital-design.jpg',
      tag: 'Branding',
      features: [
        'Logo Design (Basic to Premium)',
        'UI/UX Design for Web & Mobile',
        'Social Media Asset Packs',
        'Vector Illustrations & Icons',
      ],
    },
    'electronics': {
      title: 'Electronics & IoT',
      desc: 'Smart solutions for a connected world. We design and assemble custom circuit boards and IoT systems perfect for automation, thesis projects, and industrial monitoring at every scale.',
      image: 'logic-circuit.jpg',
      tag: 'IoT Systems',
      features: [
        'PCB Layout & Schematic Capture',
        'Arduino & ESP32 Integration',
        'Sensor Interfacing & Firmware',
        'Wireless & IoT Connectivity',
      ],
    },
    'prototyping': {
      title: 'Rapid Prototyping',
      desc: 'Accelerate your product development cycle. We integrate hardware and software into functional MVPs ready for testing, investor demos, and manufacturing hand-off.',
      image: 'prototype-promo.jpg',
      tag: 'Product Dev',
      features: [
        'Full-stack MVP Development',
        'Enclosure Design & Fabrication',
        'Firmware Programming',
        'System Integration Testing',
      ],
    },
    'software': {
      title: 'Software Development',
      desc: 'Robust software tailored to your exact needs. From simple automation scripts to complex enterprise-grade web and mobile applications, we code for performance, scalability, and maintainability.',
      image: 'programming.jpg',
      tag: 'Full Stack',
      features: [
        'Web Applications (React, Node.js)',
        'Mobile App Development',
        'Desktop Software (Java, C++)',
        'Automation Scripts (Python)',
      ],
    },
  };

  const modalBackdrop = document.getElementById('service-modal');
  const modalImage    = document.getElementById('modal-image');
  const modalTag      = document.getElementById('modal-tag');
  const modalTitle    = document.getElementById('modal-title');
  const modalDesc     = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const closeModalBtn = document.getElementById('close-modal');

  function openModal(id) {
    const data = servicesData[id];
    if (!data || !modalBackdrop) return;

    modalImage.src      = data.image;
    modalTag.textContent    = data.tag;
    modalTitle.textContent  = data.title;
    modalDesc.textContent   = data.desc;
    modalFeatures.innerHTML = data.features
      .map(f => `<li>${f}</li>`)
      .join('');

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.service));
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Expose for footer links
  window.scrollToService = (id) => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => openModal(id), 700);
  };

  /* =============================================
     8. PORTFOLIO SLIDER
     ============================================= */
  const track    = document.getElementById('portfolio-track');
  const btnLeft  = document.getElementById('slide-left');
  const btnRight = document.getElementById('slide-right');

  if (track && btnLeft && btnRight) {
    const scrollAmount = () => track.querySelector('.portfolio-item')?.offsetWidth + 24 || 420;

    btnRight.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
    btnLeft.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
  }

  /* =============================================
     9. CTA BUTTON RIPPLE
     ============================================= */
  document.querySelectorAll('.btn-primary, .nav-cta, .contact-big-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,0.3);
        width:4px;height:4px;
        top:${e.clientY - rect.top}px;
        left:${e.clientX - rect.left}px;
        transform:scale(0);
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      anime({
        targets: ripple,
        scale: [0, 100],
        opacity: [1, 0],
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => ripple.remove(),
      });
    });
  });

  /* =============================================
     10. HERO TYPEWRITER (secondary line)
     ============================================= */
  const typewriterEl = document.getElementById('hero-typewriter');
  if (typewriterEl) {
    const words = ['Code.', 'Create.', 'Innovate.', 'Deliver.'];
    let wi = 0, ci = 0, deleting = false;

    function tick() {
      const word = words[wi];
      if (deleting) {
        typewriterEl.textContent = word.substring(0, ci--);
        if (ci < 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 60);
      } else {
        typewriterEl.textContent = word.substring(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 120);
      }
    }
    setTimeout(tick, 1000);
  }

}); // end DOMContentLoaded
