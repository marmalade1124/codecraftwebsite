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
const sections = document.querySelectorAll("section, .dashboard > header");
const navLinks = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Offset for better triggering
    if (pageYOffset >= sectionTop - 300) {
      current = section.getAttribute("id");
      // Values: home, services, etc.
      // header doesn't have an ID usually, let's assume home is default
    }
  });

  // Header specific fix (if header is 'home')
  if (window.scrollY < 300) {
    current = "home";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
