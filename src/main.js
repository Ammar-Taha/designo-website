// src/main.js
import "@oddbird/css-anchor-positioning";
import "./index.css";
import { loadHeaderAndFooter, loadContact } from "./utils/loadComponents.js";

// Load shared components first
await loadHeaderAndFooter();

// Add skip to content link for accessibility
// Note: This will only work if pages have a <main id="main-content"> element
// Insert it before the header element to ensure proper order
const skipLink = document.createElement("a");
skipLink.href = "#main-content";
skipLink.className = "skip-link visually_hidden";
skipLink.textContent = "Skip to main content";
const header = document.querySelector("header") || document.querySelector("[data-header]");
if (header) {
  document.body.insertBefore(skipLink, header);
} else {
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Setup mobile menu toggle functionality
function initMobileMenu() {
  const menuOpenBtn = document.querySelector(".menu-open-btn");
  const menuCloseBtn = document.querySelector(".menu-close-btn");
  const navOverlay = document.querySelector(".nav-overlay");
  const navList = document.querySelector(".nav__list");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!menuOpenBtn || !menuCloseBtn || !navList) {
    // Retry if elements aren't loaded yet
    setTimeout(initMobileMenu, 100);
    return;
  }

  // Function to handle animation class
  function handleAnimation() {
    // Add animating class
    navList.classList.add("animating");
    
    // Remove animating class after transition completes
    const handleTransitionEnd = (e) => {
      // Only remove if this is the translate transition
      if (e.propertyName === "translate" || e.propertyName === "transform") {
        navList.classList.remove("animating");
        navList.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
    
    navList.addEventListener("transitionend", handleTransitionEnd, { once: true });
    
    // Fallback: remove class after transition duration (300ms)
    setTimeout(() => {
      navList.classList.remove("animating");
    }, 300);
  }

  // Function to open menu
  function openMenu() {
    // Add animating class before changing state
    handleAnimation();
    // Use requestAnimationFrame to ensure class is added before state change
    requestAnimationFrame(() => {
      menuOpenBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    });
  }

  // Function to close menu
  function closeMenu() {
    // Add animating class before changing state
    handleAnimation();
    // Use requestAnimationFrame to ensure class is added before state change
    requestAnimationFrame(() => {
      menuOpenBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }

  // Open menu when clicking hamburger icon
  menuOpenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });

  // Close menu when clicking close icon
  menuCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpenBtn.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}

// Initialize menu after header is loaded
initMobileMenu();

loadContact();

// ---- Dynamically load page-specific CSS ----

// Convention: body has a class like "page-home", "page-about", etc.
const bodyClass = Array.from(document.body.classList).find((cls) =>
  cls.startsWith("page-")
);

switch (bodyClass) {
  case "page-home":
    import("./styles/home.css");
    break;
  case "page-about":
    import("./styles/about.css");
    break;
  case "page-app-design":
    import("./styles/app-design.css");
    break;
  case "page-contact":
    import("./styles/contact.css");
    break;
  case "page-graphic-design":
    import("./styles/graphic-design.css");
    break;
  case "page-locations":
    import("./styles/locations.css");
    break;
  case "page-web-design":
    import("./styles/web-design.css");
    break;
}
