// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 50,
  easing: "ease-out-cubic",
});

// Particles.js Configuration
particlesJS("particles-js", {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#f97316", "#06b6d4"], // Orange & Cyan
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.05,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.2,
        },
      },
    },
  },
  retina_detect: true,
});

// Navigation Active State Logic (Scroll Spy)
const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollPosition = window.scrollY + 300; // Offset

  sections.forEach((section) => {
    // Skip hidden sections (like Testimonials)
    if (section.offsetParent === null) return;
    
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop) {
      const id = section.getAttribute("id");
      if (id) {
        current = id;
      }
    }
  });

  // Default to home if near top
  if (window.scrollY < 100) {
    current = "home";
  }
  
  // Hande Portfolio section (keep Pricing or Process active? or none? User wants white text)
  // Actually, if 'portfolio' is current, it's not in nav. 
  // Maybe we want 'portfolio' to map to a previous section if needed, but for now let's just ensure IDs match.

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
// Timeline Animation Logic
const timelineSection = document.querySelector('.timeline-section');
const timelineLineFilled = document.querySelector('.timeline-line-filled');
const timelineItems = document.querySelectorAll('.timeline-item');

if (timelineSection && timelineLineFilled) {
  window.addEventListener('scroll', () => {
    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the section is visible
    // Start filling when top reaches center of screen
    const startOffset = windowHeight / 2;
    let progress = (windowHeight - rect.top - startOffset) / (rect.height);
    
    // Clamp between 0 and 1
    progress = Math.max(0, Math.min(1, progress));
    
    // Set height
    timelineLineFilled.style.height = `${progress * 100}%`;
    
    // Check items
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < windowHeight * 0.8) { // Trigger when item is 80% down the viewport
        item.classList.add('active');
      }
    });
  });
}

// Tilted Card Effect
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 15deg)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});
