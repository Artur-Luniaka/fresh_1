// Main JavaScript file for Friday Night Funkin' Unblocked
// Musical and rhythm-themed variable names and functions

// Global variables with musical theme
let beatData = [];
let funkFlowActive = false;
let comboStreak = 0;
let rhythmTimer = null;

// Initialize the groove when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  launchFunkFlow();
  loadDynamicComponents();
  setupEventListeners();
  initializeRhythmEffects();
});

// Initialize components after header is loaded
function initializeComponentsAfterHeader() {
  // Initialize mobile menu controller
  if (typeof MobileMenuController !== "undefined") {
    new MobileMenuController();
  }

  // Initialize other components
  if (typeof ParallaxController !== "undefined") {
    new ParallaxController();
  }

  if (typeof SmoothScroller !== "undefined") {
    new SmoothScroller();
  }

  if (typeof FormValidator !== "undefined") {
    new FormValidator("contact-form");
  }

  if (typeof PerformanceMonitor !== "undefined") {
    new PerformanceMonitor();
  }
}

// Launch the main funk flow functionality
function launchFunkFlow() {
  funkFlowActive = true;

  // Load content based on current page
  const currentPage = getCurrentPage();
  loadPageContent(currentPage);

  // Start rhythm effects
  startRhythmPulse();
}

// Load dynamic components (header and footer)
function loadDynamicComponents() {
  loadComponent("rhythm-header-placeholder", "rhythm-header.html");
  loadComponent("beat-footer-placeholder", "beat-footer.html");
}

// Load a component into a placeholder
async function loadComponent(placeholderId, componentPath) {
  try {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    const response = await fetch(componentPath);
    const componentHtml = await response.text();

    placeholder.innerHTML = componentHtml;

    // Initialize component-specific functionality
    if (componentPath.includes("rhythm-header")) {
      initializeHeaderFunctionality();
      // Initialize components after header is loaded
      setTimeout(initializeComponentsAfterHeader, 100);
    } else if (componentPath.includes("beat-footer")) {
      initializeFooterFunctionality();
    }
  } catch (error) {
    console.error("❌ Error loading component:", error);
    placeholder.innerHTML = "<p>Component loading failed</p>";
  }
}

// Initialize header functionality
function initializeHeaderFunctionality() {
  // Header functionality is now handled by components.js
}

// Initialize footer functionality
function initializeFooterFunctionality() {
  // Set current year
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Load footer contact info
  loadFooterContactInfo();
}

// Load footer contact information
async function loadFooterContactInfo() {
  try {
    const response = await fetch("data/contact.json");
    const contactData = await response.json();

    const footerContactInfo = document.getElementById("footer-contact-info");
    if (footerContactInfo) {
      footerContactInfo.innerHTML = `
                <p><strong>Email:</strong> ${contactData.contact_info.email}</p>
                <p><strong>Phone:</strong> ${contactData.contact_info.phone}</p>
                <p><strong>Address:</strong> ${contactData.contact_info.address}</p>
            `;
    }
  } catch (error) {
    console.error("❌ Error loading footer contact info:", error);
  }
}

// Setup event listeners for interactive elements
function setupEventListeners() {
  // Form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmission);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Handle contact form submission
async function handleFormSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData);

  // Validate form fields
  const name = formObject.name?.trim();
  const phone = formObject.phone?.trim();
  const message = formObject.message?.trim();

  // Simple validation - check if fields are filled
  if (!name || !phone || !message) {
    showNotificationOverlay("Please fill in all fields", "error");
    return;
  }

  // Get submit button and show processing state
  const submitButton = event.target.querySelector(".submit-button");
  const originalText = submitButton.textContent;
  const originalBackground = submitButton.style.background;

  // Show processing state
  submitButton.textContent = "Processing... ⚡";
  submitButton.style.background =
    "linear-gradient(45deg, var(--neon-blue), var(--sync-green))";
  submitButton.disabled = true;

  try {
    // Simulate form processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Show success notification overlay
    showNotificationOverlay("Message sent successfully! 🎵", "success");

    // Reset form
    event.target.reset();
  } catch (error) {
    console.error("❌ Form submission error:", error);
    showNotificationOverlay(
      "Error sending message. Please try again.",
      "error"
    );
  } finally {
    // Restore button state
    submitButton.textContent = originalText;
    submitButton.style.background = originalBackground;
    submitButton.disabled = false;
  }
}

// Show notification overlay
function showNotificationOverlay(message, type = "success") {
  // Remove existing overlay if any
  const existingOverlay = document.querySelector(".notification-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  // Create notification content
  const notification = document.createElement("div");
  notification.className = `notification-content notification-${type}`;

  notification.innerHTML = `
    <div class="notification-message">${message}</div>
  `;

  overlay.appendChild(notification);
  document.body.appendChild(overlay);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
    }
  }, 5000);
}

// Show form submission feedback (legacy function - keeping for compatibility)
function showSubmissionFeedback() {
  const submitButton = document.querySelector(".submit-button");
  if (submitButton) {
    const originalText = submitButton.textContent;
    submitButton.textContent = "Message Sent! 🎵";
    submitButton.style.background =
      "linear-gradient(45deg, var(--sync-green), var(--neon-blue))";

    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.style.background =
        "linear-gradient(45deg, var(--funk-pink), var(--groove-vibe))";
    }, 3000);
  }
}

// Get current page identifier
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes("funk-updates")) return "updates";
  if (path.includes("contact-funk")) return "contact";
  if (path.includes("funk-disclaimer")) return "disclaimer";
  if (path.includes("funk-cookies")) return "cookies";
  if (path.includes("funk-privacy")) return "privacy";
  return "home";
}

// Load content based on current page
function loadPageContent(pageType) {
  switch (pageType) {
    case "home":
      loadHomePageContent();
      break;
    case "updates":
      loadUpdatesPageContent();
      break;
    case "contact":
      loadContactPageContent();
      break;
    default:
  }
}

// Load home page content
async function loadHomePageContent() {
  try {
    // Load controls data
    await loadControlsData();

    // Load testimonials data
    await loadTestimonialsData();

    // Load unlockables data
    await loadUnlockablesData();
  } catch (error) {
    console.error("❌ Error loading home page content:", error);
  }
}

// Load controls data
async function loadControlsData() {
  try {
    const response = await fetch("data/controls.json");
    const controlsData = await response.json();

    const controlsContainer = document.getElementById("controls-content");
    if (controlsContainer) {
      let controlsHtml = "";

      controlsData.controls.forEach((control) => {
        controlsHtml += `
                    <div class="control-item">
                        <div class="control-key">${control.key}</div>
                        <div class="control-description">${control.description}</div>
                        <div class="control-tip">💡 ${control.tip}</div>
                    </div>
                `;
      });

      // Add tips section
      controlsHtml += "<h3>Pro Tips</h3>";
      controlsHtml += '<div class="control-item">';
      controlsData.tips.forEach((tip) => {
        controlsHtml += `<div class="control-tip">🎯 ${tip}</div>`;
      });
      controlsHtml += "</div>";

      controlsContainer.innerHTML = controlsHtml;
    }
  } catch (error) {
    console.error("❌ Error loading controls data:", error);
  }
}

// Load testimonials data
async function loadTestimonialsData() {
  try {
    const response = await fetch("data/testimonials.json");
    const testimonialsData = await response.json();

    const testimonialsContainer = document.getElementById(
      "testimonials-content"
    );
    if (testimonialsContainer) {
      let testimonialsHtml = "";

      testimonialsData.testimonials.forEach((testimonial) => {
        const stars = "⭐".repeat(testimonial.rating);
        testimonialsHtml += `
                    <div class="testimonial-card">
                        <div class="testimonial-header">
                            <div class="testimonial-author">${testimonial.name}</div>
                            <div class="testimonial-rating">${stars}</div>
                        </div>
                        <div class="testimonial-comment">${testimonial.comment}</div>
                        <div class="testimonial-achievement">🏆 ${testimonial.achievement}</div>
                    </div>
                `;
      });

      testimonialsContainer.innerHTML = testimonialsHtml;
    }
  } catch (error) {
    console.error("❌ Error loading testimonials data:", error);
  }
}

// Load unlockables data
async function loadUnlockablesData() {
  try {
    const response = await fetch("data/unlockables.json");
    const unlockablesData = await response.json();

    const unlockablesContainer = document.getElementById("unlockables-content");
    if (unlockablesContainer) {
      let unlockablesHtml = "";

      unlockablesData.unlockables.forEach((category) => {
        unlockablesHtml += `
                    <div class="unlock-category">
                        <h3 class="category-title">${category.category}</h3>
                        <div class="unlock-items">
                `;

        category.items.forEach((item) => {
          unlockablesHtml += `
                        <div class="unlock-item">
                            <div class="unlock-name">${item.name}</div>
                            <div class="unlock-requirement">${item.requirement}</div>
                            <div class="unlock-description">${item.description}</div>
                        </div>
                    `;
        });

        unlockablesHtml += `
                        </div>
                    </div>
                `;
      });

      unlockablesContainer.innerHTML = unlockablesHtml;
    }
  } catch (error) {
    console.error("❌ Error loading unlockables data:", error);
  }
}

// Load updates page content
async function loadUpdatesPageContent() {
  try {
    // Load patches data
    await loadPatchesData();

    // Load diaries data
    await loadDiariesData();
  } catch (error) {
    console.error("❌ Error loading updates page content:", error);
  }
}

// Load patches data
async function loadPatchesData() {
  try {
    const response = await fetch("data/patches.json");
    const patchesData = await response.json();

    const patchesContainer = document.getElementById("patches-content");
    if (patchesContainer) {
      let patchesHtml = "";

      patchesData.patches.forEach((patch) => {
        patchesHtml += `
                    <div class="patch-card" data-patch-version="${patch.version}">
                        <div class="patch-header">
                            <div class="patch-version">v${patch.version}</div>
                            <div class="patch-date">${patch.date}</div>
                            <div class="patch-type">${patch.type}</div>
                        </div>
                        <h3 class="patch-title">${patch.title}</h3>
                        <ul class="patch-changes">
                `;

        patch.changes.forEach((change) => {
          patchesHtml += `<li>${change}</li>`;
        });

        patchesHtml += `
                        </ul>
                        
                        <!-- Overlay -->
                        <div class="patch-overlay">
                            <button class="mobile-close-btn" aria-label="Close overlay">×</button>
                            <div class="overlay-content">
                                <div class="overlay-highlights">
                                    <ul>
                `;

        patch.overlay.highlights.forEach((highlight) => {
          patchesHtml += `<li>${highlight}</li>`;
        });

        patchesHtml += `
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
      });

      patchesContainer.innerHTML = patchesHtml;

      // Initialize mobile overlay functionality
      initializeMobilePatchOverlays();
    }
  } catch (error) {
    console.error("❌ Error loading patches data:", error);
  }
}

// Load diaries data
async function loadDiariesData() {
  try {
    const response = await fetch("data/diaries.json");
    const diariesData = await response.json();

    const diariesContainer = document.getElementById("diaries-content");
    if (diariesContainer) {
      let diariesHtml = "";

      diariesData.diaries.forEach((diary) => {
        diariesHtml += `
                    <div class="diary-card" style="background-image: url('${diary.backgroundImage}')">
                        <div class="diary-overlay">
                            <div class="diary-header">
                                <div class="diary-author">${diary.author}</div>
                                <div class="diary-date">${diary.date}</div>
                            </div>
                            <h3 class="diary-title">${diary.title}</h3>
                            <div class="diary-story">${diary.story}</div>
                            <div class="diary-footer">
                                <div class="diary-achievement">🏆 ${diary.achievement}</div>
                                <div class="diary-difficulty">Difficulty: ${diary.difficulty}</div>
                            </div>
                        </div>
                    </div>
                `;
      });

      diariesContainer.innerHTML = diariesHtml;
    }
  } catch (error) {
    console.error("❌ Error loading diaries data:", error);
  }
}

// Load contact page content
async function loadContactPageContent() {
  try {
    const response = await fetch("data/contact.json");
    const contactData = await response.json();

    const contactInfoContainer = document.getElementById(
      "contact-info-content"
    );
    if (contactInfoContainer) {
      let contactHtml = "";

      // Main contact info
      contactHtml += `
                <div class="info-item">
                    <div class="info-text">
                        <strong>Email:</strong> ${contactData.contact_info.email}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-text">
                        <strong>Phone:</strong> ${contactData.contact_info.phone}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-text">
                        <strong>Address:</strong> ${contactData.contact_info.address}
                    </div>
                </div>
            `;

      // Business hours and response time
      contactHtml += `
                <div class="info-item">
                    <div class="info-text">
                        <strong>Business Hours:</strong> ${contactData.contact_info.business_hours}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-text">
                        <strong>Response Time:</strong> ${contactData.contact_info.response_time}
                    </div>
                </div>
            `;

      contactInfoContainer.innerHTML = contactHtml;
    }

    // Form validation is handled by the main form submission handler
    // No need to add another event listener here
  } catch (error) {
    console.error("❌ Error loading contact page content:", error);
  }
}

// Initialize rhythm effects
function initializeRhythmEffects() {
  // Rhythm effects disabled - keeping only hover effects
}

// Rhythm pulse and floating notes functions removed - keeping only hover effects

// Start rhythm pulse effect
function startRhythmPulse() {
  // Rhythm pulse disabled - keeping only hover effects
}

// Tally combo streak
function tallyComboStreak() {
  return comboStreak;
}

// Initialize mobile patch overlay functionality
function initializeMobilePatchOverlays() {
  const patchCards = document.querySelectorAll(".patch-card");

  patchCards.forEach((card) => {
    // Check if device is mobile/touch
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // Add touch event listeners for mobile
      card.addEventListener("touchstart", function (e) {
        // Prevent default to avoid conflicts with hover
        e.preventDefault();
      });

      card.addEventListener("touchend", function (e) {
        e.preventDefault();
        toggleMobileOverlay(card);
      });

      // Add click event listener for mobile devices that support both touch and click
      card.addEventListener("click", function (e) {
        if (isMobile) {
          e.preventDefault();
          toggleMobileOverlay(card);
        }
      });

      // Add event listeners for close button
      const closeBtn = card.querySelector(".mobile-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          hideMobileOverlay(card);
        });
      }
    }
  });
}

// Toggle mobile overlay visibility
function toggleMobileOverlay(card) {
  const isActive = card.classList.contains("mobile-overlay-active");

  if (isActive) {
    hideMobileOverlay(card);
  } else {
    showMobileOverlay(card);
  }
}

// Show mobile overlay
function showMobileOverlay(card) {
  // Hide all other overlays first
  document
    .querySelectorAll(".patch-card.mobile-overlay-active")
    .forEach((otherCard) => {
      if (otherCard !== card) {
        hideMobileOverlay(otherCard);
      }
    });

  card.classList.add("mobile-overlay-active");
}

// Hide mobile overlay
function hideMobileOverlay(card) {
  card.classList.remove("mobile-overlay-active");
}

// Cleanup function
function cleanupFunkFlow() {
  if (rhythmTimer) {
    clearInterval(rhythmTimer);
  }
  funkFlowActive = false;
}

// CSS animations removed - keeping only hover effects

// Cookie Consent Management
function initializeCookieConsent() {
  const cookieBar = document.getElementById("cookie-consent");
  const acceptButton = document.getElementById("accept-cookies");

  if (!cookieBar || !acceptButton) return;

  // Check if user has already accepted cookies
  const cookiesAccepted = localStorage.getItem("cookiesAccepted");

  if (!cookiesAccepted) {
    // Show cookie bar after a short delay, but only if mobile menu is not open
    setTimeout(() => {
      // Check if mobile menu is open before showing cookie bar
      const mobileMenu = document.getElementById("mobile-menu");
      const isMobileMenuOpen =
        mobileMenu && mobileMenu.classList.contains("active");

      if (!isMobileMenuOpen) {
        cookieBar.classList.add("show");
      }
    }, 1000);
  }

  // Handle accept button click
  acceptButton.addEventListener("click", function () {
    // Save to localStorage
    localStorage.setItem("cookiesAccepted", "true");

    // Hide cookie bar with animation
    cookieBar.classList.remove("show");
  });
}

// Initialize cookie consent when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeCookieConsent();
});

// Cleanup on page unload
window.addEventListener("beforeunload", cleanupFunkFlow);
