import {buildProjectBrief} from './project.mjs';
import {initMotion} from './motion.mjs';
/** Code&Craft: navigation, service details, and project carousel. */
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The reference sprite is sampled into dots rather than stretched as a flat image.
  const canvas = document.getElementById('sphere-canvas');
  const motionToggle = document.getElementById('motion-toggle');
  const context = canvas.getContext('2d');
  const sample = document.createElement('canvas');
  sample.width = 150; sample.height = 120;
  const sampleContext = sample.getContext('2d', {willReadFrequently: true});
  const sphere = new Image();
  let frame = 0, lastDraw = 0, animationId = 0, visible = true;
  let sceneMotion;
  let paused = reducedMotion.matches;
  function paintSphere() {
    if (!context || !sampleContext) return;
    sampleContext.clearRect(0, 0, 150, 120);
    sampleContext.drawImage(sphere, (frame % 8) * 320 + 54, Math.floor(frame / 8) * 320 + 54, 212, 212, 0, 0, 150, 120);
    const pixels = sampleContext.getImageData(0, 0, 150, 120).data;
    context.clearRect(0, 0, 900, 720);
    context.fillStyle = '#fff';
    for (let y = 0; y < 120; y++) {
      for (let x = 0; x < 150; x++) {
        const value = pixels[(y * 150 + x) * 4] / 255;
        if (value < 0.025) continue;
        context.globalAlpha = Math.min(1, value * 3 + 0.12);
        context.beginPath();
        context.arc(x * 6, y * 6, Math.min(3, Math.pow(value, 0.6) * 4.2), 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
  }
  function tick(time) {
    if (!context || !sampleContext || paused || !visible || document.hidden || !sphere.complete || !sphere.naturalWidth) { animationId = 0; return; }
    if (time - lastDraw > 70) { frame = (frame + 1) % 64; paintSphere(); lastDraw = time; }
    animationId = requestAnimationFrame(tick);
  }
  function syncMotion() {
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    motionToggle.textContent = paused ? 'Play animation' : 'Pause animation';
    sceneMotion?.setPaused(paused);
    if (!paused && visible && !animationId) animationId = requestAnimationFrame(tick);
  }
  motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }).observe(canvas);
  sphere.addEventListener('load', () => { paintSphere(); syncMotion(); });
  sphere.addEventListener('error', () => { canvas.hidden = true; });
  sphere.src = 'assets/hero-sphere.avif';
  const nav = document.getElementById('cc-nav-wrapper');
  const burger = document.getElementById('cc-burger-inline');
  const drawer = document.getElementById('cc-menu-drawer');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const headerLinks = document.querySelectorAll('.nav-brand, .reference-controls > a, #sound-toggle, .skip-link');
  const modal = document.getElementById('service-modal');
  const close = document.getElementById('close-modal');
  let returnFocus;
  let activeOverlay;

  function toggleDrawer(open) {
    const next = open ?? nav.dataset.navStatus !== 'open';
    nav.dataset.navStatus = next ? 'open' : 'closed';
    burger.setAttribute('aria-expanded', String(next));
    burger.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!next));
    drawer.inert = !next;
    main.inert = footer.inert = next;
    headerLinks.forEach(element => { element.inert = next; });
    document.body.style.overflow = next ? 'hidden' : '';
    activeOverlay = next ? drawer : null;
    if (next) requestAnimationFrame(() => { if (activeOverlay === drawer) drawer.querySelector('a').focus(); });
    else burger.focus();
  }
  burger.addEventListener('click', () => toggleDrawer());
  document.querySelectorAll('[data-drawer-link]').forEach(link => {
    link.addEventListener('click', () => {
      toggleDrawer(false);
      const target = document.querySelector(link.hash);
      if (target) { target.tabIndex = -1; target.focus({preventScroll: true}); }
    });
  });
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


  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    main.inert = footer.inert = nav.inert = false;
    document.body.style.overflow = '';
    activeOverlay = null;
    returnFocus?.focus();
  }
  function openModal(id, trigger) {
    const data = modalData[id];
    if (!data) return;
    returnFocus = trigger;
    document.getElementById('modal-image').src = data.image;
    document.getElementById('modal-image').alt = data.title;
    document.getElementById('modal-tag').textContent = data.tag;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-features').replaceChildren(...data.features.map(feature => {
      const item = document.createElement('li'); item.textContent = feature; return item;
    }));
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    main.inert = footer.inert = nav.inert = true;
    document.body.style.overflow = 'hidden';
    activeOverlay = modal;
    requestAnimationFrame(() => { if (activeOverlay === modal) close.focus(); });
  }
  document.querySelectorAll('.service-editorial-row').forEach(row => {
    row.addEventListener('click', () => openModal(row.dataset.service, row));
    row.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); openModal(row.dataset.service, row);
      }
    });
  });
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (!activeOverlay) return;
    if (event.key === 'Escape') {
      if (activeOverlay === modal) closeModal(); else toggleDrawer(false);
    }
    if (event.key === 'Tab') {
      const items = [...activeOverlay.querySelectorAll('a[href], button')];
      if (activeOverlay === drawer) items.push(burger);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  sceneMotion = initMotion(paused);
  const planInputs = [...document.querySelectorAll('input[name="project-plan"]')];
  const addonInputs = [...document.querySelectorAll('input[name="addon"]')];
  const briefForm = document.getElementById('brief-form');
  const briefResult = document.getElementById('brief-result');
  function selectedScope() {
    return {plan: planInputs.find(input => input.checked), extras: addonInputs.filter(input => input.checked).map(input => input.dataset.title)};
  }
  function updateSummary() {
    const {plan, extras} = selectedScope();
    document.getElementById('summary-plan').textContent = plan.dataset.title;
    document.getElementById('summary-description').textContent = plan.closest('.plan-card').querySelector('.plan-face p').textContent;
    const rows = extras.length ? extras : ['No extras selected'];
    document.getElementById('summary-addons').replaceChildren(...rows.map(text => {
      const li = document.createElement('li'); li.textContent = text;
      const label = document.createElement('span'); label.textContent = extras.length ? 'Requested' : 'Optional'; li.append(label); return li;
    }));
    planInputs.forEach(input => { input.closest('.plan-card').classList.toggle('selected',input.checked); });
    briefResult.hidden = true;
  }
  [...planInputs,...addonInputs].forEach(input => input.addEventListener('change',updateSummary));
  updateSummary();
  briefForm.addEventListener('input', event => { briefResult.hidden = true; event.target.setCustomValidity?.(''); });
  briefForm.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(briefForm));
    briefForm.elements.name.setCustomValidity(values.name.trim() ? '' : 'Please enter your name.');
    briefForm.elements.message.setCustomValidity(values.message.trim().length >= 10 ? '' : 'Please describe your project in at least 10 characters.');
    if (!briefForm.reportValidity()) return;
    const {plan, extras} = selectedScope();
    document.getElementById('prepared-brief').value = buildProjectBrief(values,plan.dataset.title,extras);
    briefResult.hidden = false;
    document.getElementById('brief-status').textContent = 'Copy this brief, then paste it into the project inquiry form.';
    briefResult.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  document.getElementById('copy-brief').addEventListener('click', async () => {
    const brief = document.getElementById('prepared-brief');
    try { await navigator.clipboard.writeText(brief.value); document.getElementById('brief-status').textContent = 'Brief copied. Open the project inquiry and paste it into the message field.'; }
    catch { brief.focus(); brief.select(); document.getElementById('brief-status').textContent = 'Select and copy the brief above, then paste it into the project inquiry.'; }
  });
  document.getElementById('email-form').addEventListener('submit',event => {
    event.preventDefault(); const form=event.currentTarget;
    if (!form.reportValidity()) return;
    const data=new FormData(form);
    location.href='mailto:cc.codecraft3d@gmail.com?subject='+encodeURIComponent('Code&Craft project inquiry')+'&body='+encodeURIComponent('From: '+data.get('email')+'\n\n'+data.get('message'));
  });
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle',() => { if(window.ScrollTrigger) ScrollTrigger.refresh(); }));
  const soundToggle = document.getElementById('sound-toggle');
  let audio, soundEnabled=false;
  soundToggle.addEventListener('click',async () => {
    try {
      if (!audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        audio=new Audio(); const volume=audio.createGain(); volume.gain.value=.009; volume.connect(audio.destination);
        [130.81,196,261.63].forEach((frequency,index) => { const tone=audio.createOscillator(); tone.type='sine'; tone.frequency.value=frequency+index*.2; tone.connect(volume); tone.start(); });
      }
      soundEnabled=!soundEnabled;
      if(soundEnabled) await audio.resume(); else await audio.suspend();
      soundToggle.setAttribute('aria-pressed',String(soundEnabled));
      soundToggle.setAttribute('aria-label',soundEnabled?'Turn sound off':'Turn sound on');
      soundToggle.classList.toggle('sound-on',soundEnabled);
    } catch { soundToggle.setAttribute('aria-label','Sound unavailable in this browser'); soundToggle.disabled=true; }
  });
  document.addEventListener('visibilitychange',()=>{ if(audio){ if(document.hidden) audio.suspend(); else if(soundEnabled) audio.resume().catch(()=>{}); } });

});
