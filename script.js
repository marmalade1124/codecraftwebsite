// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Simple Portfolio Slider Logic
  // --- Service Modal Logic ---
  const serviceCards = document.querySelectorAll('.service-card');
  const modal = document.getElementById('service-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal');
  
  // Modal Elements
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalTitleMobile = document.getElementById('modal-title-mobile');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTag = document.getElementById('modal-tag');

  // Service Data
  const servicesData = {
      '3d-design': {
          title: '3D Design & Printing',
          desc: 'We transform your concepts into tangible reality. From intricate industrial parts to artistic sculptures, our high-precision 3D printing and CAD modeling services cover it all.',
          image: '3d-design.jpg',
          tag: 'Fusion 360',
          features: [
              'Filament Printing (PLA, PETG, ABS)',
              'Industrial CAD Modeling',
              'Prototyping & Iteration',
              'Post-processing & Finishing'
          ]
      },
      'digital-arts': {
          title: 'Digital Arts & Branding',
          desc: 'Elevate your brand with stunning visuals. We specialize in creating cohesive brand identities, user interfaces, and engaging motion graphics that leave a lasting impression.',
          image: 'digital-design.jpg',
          tag: 'Branding',
          features: [
              'Logo Design (Basic to Premium)',
              'UI/UX Design for Web & Mobile',
              'Social Media Assets',
              'Vector Illustrations'
          ]
      },
      'electronics': {
          title: 'Electronics & IoT',
          desc: 'Smart solutions for a connected world. We design and assemble custom circuit boards and IoT systems perfect for automation, thesis projects, and industrial monitoring.',
          image: 'logic-circuit.jpg',
          tag: 'IoT Systems',
          features: [
              'PCB Layout & Design',
              'Schematic Capture',
              'Arduino & ESP32 Integration',
              'Sensor Interfacing'
          ]
      },
      'prototyping': {
          title: 'Rapid Prototyping',
          desc: 'Accelerate your product development cycle. We integrate hardware and software into functional MVPs (Minimum Viable Products) ready for testing and demonstration.',
          image: 'prototype-promo.jpg',
          tag: 'Product Dev',
          features: [
              'Full-stack MVP Development',
              'Enclosure Design & Fabrication',
              'Firmware Programming',
              'System Integration Testing'
          ]
      },
      'software': {
          title: 'Software Development',
          desc: 'Robust software tailored to your needs. From simple automation scripts to complex enterprise-grade web and mobile applications, we code for performance and scalability.',
          image: 'programming.jpg',
          tag: 'Full Stack',
          features: [
              'Web Applications (React, Node.js)',
              'Mobile App Development',
              'Desktop Software (Java, C++)',
              'Automation Scripts (Python)'
          ]
      }
  };

  function openServiceModal(serviceId) {
      if (!serviceId || !servicesData[serviceId]) return;
      
      const data = servicesData[serviceId];
      
      modalImage.src = data.image;
      modalTitle.textContent = data.title;
      modalTitleMobile.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalTag.textContent = data.tag;
      
      // Clear and populate features
      modalFeatures.innerHTML = '';
      data.features.forEach(feature => {
          const li = document.createElement('li');
          li.className = 'flex items-center gap-2';
          li.innerHTML = `<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> ${feature}`;
          modalFeatures.appendChild(li);
      });

      // Show Modal
      modal.classList.remove('hidden');
      // Trigger reflow
      void modal.offsetWidth; 
      modal.classList.remove('opacity-0');
      modalContent.classList.remove('scale-95');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeServiceModal() {
      modal.classList.add('opacity-0');
      modalContent.classList.add('scale-95');
      
      setTimeout(() => {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
      }, 300);
  }

  // Event Listeners for Cards
  serviceCards.forEach(card => {
      card.addEventListener('click', () => {
          const serviceId = card.getAttribute('data-service');
          openServiceModal(serviceId);
      });
  });

  // Close Modal Listeners
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeServiceModal);
  
  // Close on backdrop click
  if (modal) {
      modal.addEventListener('click', (e) => {
          if (e.target === modal) closeServiceModal();
      });
  }
  
  // Expose to window for inline calls if needed
  window.closeServiceModal = closeServiceModal;

  // --- Scroll to Service & Open Modal ---
  function scrollToService(serviceId) {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
          // Open modal after a short delay to allow scroll to start/finish
          setTimeout(() => {
              openServiceModal(serviceId);
          }, 800); 
      }
  }
  window.scrollToService = scrollToService;

  // --- Theme Toggle Logic (Removed) ---
  // Default to dark mode logic is handled by CSS class on HTML tag HTML tag is hardcoded to dark.
  localStorage.setItem('theme', 'dark'); // Enforce dark mode preference
  const htmlElement = document.documentElement;
  htmlElement.classList.add('dark');


  // --- Portfolio Slider Logic (Fixed) ---
  const slider = document.getElementById('portfolio-slider');
  const leftBtn = document.getElementById('slide-left');
  const rightBtn = document.getElementById('slide-right');

  if (slider && leftBtn && rightBtn) {
    rightBtn.addEventListener('click', () => {
      slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' }); // Scroll full width
    });

    leftBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' }); // Scroll full width
    });
  }

  // --- Reveal on Scroll Animation ---
  const revealElements = document.querySelectorAll('section, .service-card, .portfolio-item');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    // Add initial state classes if not present (optional, but good for JS-enabled)
    el.classList.add('transition-all', 'duration-700', 'transform');
    // We'll set initial opacity via CSS or just let them fade in naturally if we add the starting class
    // For now, let's just observe them. To make it pop, we should add the starting classes in HTML or here.
    // Let's add them here to avoid massive HTML diffs.
    el.classList.add('opacity-0', 'translate-y-8'); 
    
    revealObserver.observe(el);
  });

  // --- Hero Typing Effect ---
  const heroTextStr = "Code. Create.";
  const heroTypewriterEl = document.getElementById('hero-typewriter');
  
  if (heroTypewriterEl) {
    let i = 0;
    function typeHero() {
        if (i < heroTextStr.length) {
            heroTypewriterEl.textContent += heroTextStr.charAt(i);
            i++;
            setTimeout(typeHero, 150); // Typing speed
        }
    }
    // Start after slight delay
    setTimeout(typeHero, 500);
  }

  // --- Terminal Code Typing Simulation ---
  const terminalBody = document.getElementById('terminal-code-body');
  if (terminalBody) {
      const codeLines = [
          { html: '<span class="code-keyword">import</span> <span class="code-plain">{</span> <span class="code-func">Solutions</span> <span class="code-plain">}</span> <span class="code-keyword">from</span> <span class="code-string">\'@codecraft/core\'</span><span class="code-plain">;</span>', delay: 50 },
          { html: '<br/>', delay: 20 },
          { html: '<div class="code-comment">// Turning ideas into reality</div>', delay: 40 },
          { html: '<div><span class="code-keyword">const</span> <span class="code-func">Project</span> <span class="code-plain">= () => {</span></div>', delay: 30 },
          { html: '<div class="pl-4"><span class="code-keyword">return</span> <span class="code-plain">(</span></div>', delay: 30 },
          { html: '<div class="pl-8"><span class="code-plain">&lt;</span><span class="code-func">Solutions</span></div>', delay: 30 },
          { html: '<div class="pl-12"><span class="code-plain">type=</span><span class="code-plain">{[</span><span class="code-string">\'3D_Print\'</span><span class="code-plain">, </span><span class="code-string">\'Web_Dev\'</span><span class="code-plain">]}</span></div>', delay: 20 },
          { html: '<div class="pl-12"><span class="code-plain">quality=</span><span class="code-plain">{</span><span class="code-string">"PixelPerfect"</span><span class="code-plain">}</span></div>', delay: 20 },
          { html: '<div class="pl-8"><span class="code-plain">/></span></div>', delay: 30 },
          { html: '<div class="pl-4"><span class="code-plain">);</span></div>', delay: 30 },
          { html: '<div><span class="code-plain">};</span></div>', delay: 30 },
          { html: '<br/>', delay: 20 },
          { html: '<div><span class="code-keyword">export default</span> <span class="code-func">Project</span><span class="code-plain">;</span></div>', delay: 50 }
      ];

      let lineIndex = 0;
      function typeCode() {
          if (lineIndex < codeLines.length) {
              const line = codeLines[lineIndex];
              const lineEl = document.createElement('div');
              lineEl.innerHTML = line.html;
              terminalBody.appendChild(lineEl);
              
              // Auto scroll to bottom
              terminalBody.scrollTop = terminalBody.scrollHeight;
              
              lineIndex++;
              setTimeout(typeCode, Math.random() * 100 + 100); // Random typing delay between lines
          }
      }
      setTimeout(typeCode, 1500); // Start after hero text
  }



  // --- Scroll Spy (Active Nav Link) ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary', 'dark:text-primary'); // Remove highlight
      link.classList.add('text-slate-600', 'dark:text-slate-300'); // Restore defaults
      if (link.getAttribute('href').includes(current)) {
        link.classList.remove('text-slate-600', 'dark:text-slate-300');
        link.classList.add('text-primary', 'dark:text-primary'); // Add highlight
      }
    });
  });

  // --- Particles.js Initialization ---
  if (document.getElementById('particles-js')) {
      particlesJS("particles-js", {
          "particles": {
              "number": {
                  "value": 60,
                  "density": {
                      "enable": true,
                      "value_area": 800
                  }
              },
              "color": {
                  "value": ["#F58230", "#3b82f6"] // Orange and Blue
              },
              "shape": {
                  "type": "circle",
                  "stroke": {
                      "width": 0,
                      "color": "#000000"
                  },
              },
              "opacity": {
                  "value": 0.3,
                  "random": true,
                  "anim": {
                      "enable": true,
                      "speed": 1,
                      "opacity_min": 0.1,
                      "sync": false
                  }
              },
              "size": {
                  "value": 3,
                  "random": true,
                  "anim": {
                      "enable": false,
                      "speed": 40,
                      "size_min": 0.1,
                      "sync": false
                  }
              },
              "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#475569", // Slate-600ish interaction line
                  "opacity": 0.2,
                  "width": 1
              },
              "move": {
                  "enable": true,
                  "speed": 2,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                      "enable": false,
                      "rotateX": 600,
                      "rotateY": 1200
                  }
              }
          },
          "interactivity": {
              "detect_on": "canvas",
              "events": {
                  "onhover": {
                      "enable": true,
                      "mode": "grab"
                  },
                  "onclick": {
                      "enable": true,
                      "mode": "push"
                  },
                  "resize": true
              },
              "modes": {
                  "grab": {
                      "distance": 140,
                      "line_linked": {
                          "opacity": 0.6
                      }
                  },
                  "push": {
                      "particles_nb": 4
                  }
              }
          },
          "retina_detect": true
      });
  }
