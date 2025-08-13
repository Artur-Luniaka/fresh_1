// Components JavaScript file for Friday Night Funkin' Unblocked
// Additional utilities and component functionality

// Utility functions with musical theme names
const grooveUtils = {
  // Generate random musical note
  generateRandomNote: function () {
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    const octaves = [1, 2, 3, 4, 5, 6, 7];
    const note = notes[Math.floor(Math.random() * notes.length)];
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    return `${note}${octave}`;
  },

  // Create beat pattern
  createBeatPattern: function (length = 8) {
    const pattern = [];
    for (let i = 0; i < length; i++) {
      pattern.push(Math.random() > 0.5 ? 1 : 0);
    }
    return pattern;
  },

  // Calculate rhythm score
  calculateRhythmScore: function (hits, total) {
    if (total === 0) return 0;
    const accuracy = hits / total;
    return Math.round(accuracy * 100);
  },
};

// Audio context for sound effects (if supported)
let audioContext = null;
let masterGain = null;

// Initialize audio system
function initializeAudioSystem() {
  try {
    if (
      typeof AudioContext !== "undefined" ||
      typeof webkitAudioContext !== "undefined"
    ) {
      audioContext = new (AudioContext || webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.value = 0.3; // Set volume to 30%
    }
  } catch (error) {}
}

// Play sound effect
function playSoundEffect(frequency = 440, duration = 0.1, type = "sine") {
  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {}
}

// Enhanced mobile menu functionality
class MobileMenuController {
  constructor() {
    this.isOpen = false;
    this.burgerButton = null;
    this.mobileMenu = null;
    this.overlay = null;
    this.init();
  }

  init() {
    this.burgerButton = document.getElementById("burger-toggle");
    this.mobileMenu = document.getElementById("mobile-menu");

    if (this.burgerButton && this.mobileMenu) {
      this.createOverlay();
      this.bindEvents();
    }
  }

  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "mobile-menu-overlay";
    this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

    document.body.appendChild(this.overlay);
  }

  bindEvents() {
    this.burgerButton.addEventListener("click", () => this.toggle());
    this.overlay.addEventListener("click", () => this.close());

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Close menu when clicking on mobile nav links
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => this.close());
    });

    // Close menu on scroll
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      if (this.isOpen) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => this.close(), 100);
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.burgerButton.classList.add("active");

    // Show mobile menu
    this.mobileMenu.style.display = "block";

    // Force reflow to ensure transition works
    this.mobileMenu.offsetHeight;

    // Add active class for animation
    this.mobileMenu.classList.add("active");

    // Show overlay
    this.overlay.style.opacity = "1";
    this.overlay.style.visibility = "visible";

    // Hide cookie bar when mobile menu is open
    this.hideCookieBar();

    // Play sound effect
    playSoundEffect(523.25, 0.1, "sine"); // C5 note

    // Add body scroll lock
    document.body.style.overflow = "hidden";
  }

  close() {
    this.isOpen = false;
    this.burgerButton.classList.remove("active");
    this.mobileMenu.classList.remove("active");
    this.overlay.style.opacity = "0";
    this.overlay.style.visibility = "hidden";

    // Wait for transition to complete before hiding
    setTimeout(() => {
      if (!this.isOpen) {
        this.mobileMenu.style.display = "none";
      }
    }, 300);

    // Show cookie bar when mobile menu is closed (if cookies not accepted)
    this.showCookieBarIfNeeded();

    // Play sound effect
    playSoundEffect(440, 0.1, "sine"); // A4 note

    // Remove body scroll lock
    document.body.style.overflow = "";
  }

  // Hide cookie bar
  hideCookieBar() {
    const cookieBar = document.getElementById("cookie-consent");
    if (cookieBar) {
      cookieBar.classList.remove("show");
    }
  }

  // Show cookie bar if cookies haven't been accepted
  showCookieBarIfNeeded() {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      const cookieBar = document.getElementById("cookie-consent");
      if (cookieBar) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          cookieBar.classList.add("show");
        }, 100);
      }
    }
  }
}

// Parallax effect disabled - keeping only hover effects
class ParallaxController {
  constructor() {}

  init() {
    // Parallax disabled
  }

  handleScroll() {
    // Parallax disabled
  }

  handleResize() {
    // Parallax disabled
  }
}

// Smooth scrolling utility
class SmoothScroller {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => this.handleClick(e, anchor));
    });
  }

  handleClick(e, anchor) {
    e.preventDefault();
    const targetId = anchor.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      const headerHeight =
        document.querySelector(".rhythm-header")?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Play sound effect
      playSoundEffect(659.25, 0.1, "sine"); // E5 note
    }
  }
}

// Form validation utility
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.validateForm(e));
      this.setupRealTimeValidation();
    }
  }

  setupRealTimeValidation() {
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        isValid = false;
        errorMessage = "Please enter a valid phone number";
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
            color: var(--street-graffiti);
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;

    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = "var(--street-graffiti)";
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
    field.style.borderColor = "var(--groove-vibe)";
  }

  validateForm(e) {
    const fields = this.form.querySelectorAll("input, textarea");
    let isFormValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      e.preventDefault();
      playSoundEffect(220, 0.2, "sawtooth"); // A3 note for error
    } else {
      playSoundEffect(880, 0.1, "sine"); // A5 note for success
    }

    return isFormValid;
  }
}

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      firstContentfulPaint: 0,
    };
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureDOMContentLoaded();
    this.measureFirstContentfulPaint();
  }

  measurePageLoad() {
    window.addEventListener("load", () => {
      this.metrics.pageLoadTime = performance.now();
    });
  }

  measureDOMContentLoaded() {
    document.addEventListener("DOMContentLoaded", () => {
      this.metrics.domContentLoaded = performance.now();
    });
  }

  measureFirstContentfulPaint() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ["paint"] });
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize audio system when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializeAudioSystem();
});

// Add CSS for additional styles (animations removed)
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
    .mobile-menu-overlay {
        backdrop-filter: blur(5px);
    }
    
    .field-error {
        position: relative;
        padding-left: 1rem;
    }
    
    .field-error::before {
        content: "⚠️";
        position: absolute;
        left: 0;
        top: 0;
    }
`;

document.head.appendChild(additionalStyles);

// Export utilities for global use
window.grooveUtils = grooveUtils;
window.playSoundEffect = playSoundEffect;
