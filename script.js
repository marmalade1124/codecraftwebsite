// Carousel functionality
class Carousel {
  constructor() {
    this.track = document.getElementById("carouselTrack");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.dotsContainer = document.getElementById("carouselDots");
    this.cards = document.querySelectorAll(".service-card");
    this.currentIndex = 0;
    this.cardsPerView = this.getCardsPerView();

    this.init();
  }

  init() {
    this.createDots();
    this.updateCarousel();
    this.attachEventListeners();
    window.addEventListener("resize", () => this.handleResize());
  }

  getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  createDots() {
    const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
    this.dotsContainer.innerHTML = "";

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    const cardWidth = this.cards[0].offsetWidth;
    const gap = 32; // 2rem in pixels
    const offset = -(this.currentIndex * (cardWidth + gap));

    this.track.style.transform = `translateX(${offset}px)`;
    this.updateDots();
    this.updateButtons();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }

  updateButtons() {
    const maxIndex = Math.ceil(this.cards.length / this.cardsPerView) - 1;
    this.prevBtn.style.opacity = this.currentIndex === 0 ? "0.5" : "1";
    this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? "0.5" : "1";
    this.prevBtn.style.cursor =
      this.currentIndex === 0 ? "not-allowed" : "pointer";
    this.nextBtn.style.cursor =
      this.currentIndex >= maxIndex ? "not-allowed" : "pointer";
  }

  next() {
    const maxIndex = Math.ceil(this.cards.length / this.cardsPerView) - 1;
    const scrollBy = 2; // Scroll by 2 cards for balanced navigation
    if (this.currentIndex < maxIndex) {
      this.currentIndex += scrollBy;
      // Don't go past the last valid position
      const maxPosition = this.cards.length - this.cardsPerView;
      if (this.currentIndex > maxPosition) {
        this.currentIndex = maxPosition;
      }
      this.updateCarousel();
    }
  }

  prev() {
    const scrollBy = 2; // Scroll by 2 cards for balanced navigation
    if (this.currentIndex > 0) {
      this.currentIndex -= scrollBy;
      // Don't go below 0
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  handleResize() {
    const newCardsPerView = this.getCardsPerView();
    if (newCardsPerView !== this.cardsPerView) {
      this.cardsPerView = newCardsPerView;
      this.currentIndex = 0;
      this.createDots();
      this.updateCarousel();
    }
  }

  attachEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener("touchend", () => {
      if (!isDragging) return;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      isDragging = false;
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });
  }
}

// Smooth scroll animation for page load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel
  new Carousel();

  // Add entrance animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe service cards
  document.querySelectorAll(".service-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Auto-flip cards on mobile hint
  if (window.innerWidth < 768) {
    setTimeout(() => {
      const firstCard = document.querySelector(".service-card");
      if (firstCard) {
        const inner = firstCard.querySelector(".card-inner");
        inner.style.transform = "rotateY(180deg)";
        setTimeout(() => {
          inner.style.transform = "rotateY(0deg)";
        }, 2000);
      }
    }, 1000);
  }
});

// Parallax effect for background
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      document.body.style.backgroundPosition = `center ${scrolled * 0.5}px`;
      ticking = false;
    });
    ticking = true;
  }
});

// Interactive Cursor Trail - Fluid Brush Effect
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;
let lastX = 0;
let lastY = 0;
const smoothness = 0.2;

// Track mouse position and create trail
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Calculate distance moved
  const dx = mouseX - lastX;
  const dy = mouseY - lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Create trail particles continuously when moving
  if (distance > 2) { // Only when cursor moves
    const angle = Math.atan2(dy, dx);
    createFluidTrail(mouseX, mouseY, angle, distance);
    lastX = mouseX;
    lastY = mouseY;
  }
});

// Smooth animation for main glow
function animateGlow() {
  glowX += (mouseX - glowX) * smoothness;
  glowY += (mouseY - glowY) * smoothness;
  
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top = `${glowY}px`;
  
  requestAnimationFrame(animateGlow);
}

// Create fluid brush stroke trail
function createFluidTrail(x, y, angle, speed) {
  const particle = document.createElement('div');
  particle.className = 'cursor-trail';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // Rotate particle based on movement direction for brush effect
  const rotation = (angle * 180 / Math.PI);
  particle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  
  // Vary size slightly based on speed
  const size = Math.min(speed * 0.5, 3);
  particle.style.setProperty('--trail-size', size);
  
  document.body.appendChild(particle);
  
  // Remove particle after animation completes
  setTimeout(() => {
    particle.remove();
  }, 800);
}

// Start the animation
animateGlow();

// Scroll Reveal Animation for Pricing Section (mokn.io inspired)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger the reveal with increasing delay
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, index * 100);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '-50px'
});

// Observe all reveal elements
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});

// Smooth scroll to pricing section
document.querySelector('.learn-more-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector('#services-pricing');
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

// Scroll Fade Effect - Content fades as you scroll past
function handleScrollFade() {
  const sections = document.querySelectorAll('.business-header, .services-section, .service-detail, .contact-section');
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementHeight = rect.height;
    const elementCenter = elementTop + (elementHeight / 2);
    
    // Calculate distance from viewport center
    const viewportCenter = scrollY + (windowHeight / 2);
    const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
    const maxDistance = windowHeight * 0.8;
    
    // Calculate opacity (1 when centered, fades as it moves away)
    let opacity = 1 - (distanceFromCenter / maxDistance);
    opacity = Math.max(0.3, Math.min(1, opacity)); // Clamp between 0.3 and 1
    
    section.style.opacity = opacity;
    section.style.transition = 'opacity 0.3s ease-out';
  });
}

// Throttle scroll for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    handleScrollFade();
  });
});

// Initial call
handleScrollFade();

// Mobile Touch: Tap to flip service cards
if ('ontouchstart' in window) {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    let isFlipped = false;
    
    card.addEventListener('touchstart', (e) => {
      // Prevent default to avoid hover simulation
      e.preventDefault();
      
      const cardInner = card.querySelector('.card-inner');
      
      if (isFlipped) {
        cardInner.style.transform = 'rotateY(0deg)';
        isFlipped = false;
      } else {
        cardInner.style.transform = 'rotateY(180deg)';
        isFlipped = true;
      }
    });
  });
}
