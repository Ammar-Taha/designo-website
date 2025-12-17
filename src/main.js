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
const header =
  document.querySelector("header") || document.querySelector("[data-header]");
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

    navList.addEventListener("transitionend", handleTransitionEnd, {
      once: true,
    });

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
    if (
      e.key === "Escape" &&
      menuOpenBtn.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
    }
  });
}

// Initialize menu after header is loaded
initMobileMenu();

loadContact();

// ---- Form Validation ----
function initContactFormValidation() {
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  // Wrap each input/textarea in a container for error positioning
  const fields = contactForm.querySelectorAll("input, textarea");
  fields.forEach((field) => {
    if (!field.parentElement.classList.contains("form-field-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "form-field-wrapper";
      field.parentNode.insertBefore(wrapper, field);
      wrapper.appendChild(field);
    }
  });

  // Validation rules for each field
  const validationRules = {
    name: {
      validate: (value) => value.trim().length > 0,
      message: "Can't be empty",
    },
    email: {
      validate: (value) => {
        if (value.trim().length === 0) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: (value) =>
        value.trim().length === 0
          ? "Can't be empty"
          : "Please use a valid email",
    },
    phone: {
      validate: (value) => {
        if (value.trim().length === 0) return false;
        // Allow various phone formats: digits, spaces, dashes, parentheses, plus sign
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 10;
      },
      message: (value) =>
        value.trim().length === 0
          ? "Can't be empty"
          : "Please use a valid phone",
    },
    message: {
      validate: (value) => value.trim().length > 0,
      message: "Can't be empty",
    },
  };

  // Create error message element
  function createErrorMessage(message) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "form-error";

    const errorText = document.createElement("span");
    errorText.className = "form-error__text";
    errorText.textContent = message;

    const errorIcon = document.createElement("span");
    errorIcon.className = "form-error__icon";
    errorIcon.setAttribute("aria-hidden", "true");
    errorIcon.innerHTML = "!";

    errorContainer.appendChild(errorText);
    errorContainer.appendChild(errorIcon);

    return errorContainer;
  }

  // Show error for a field
  function showError(field, message) {
    // Remove existing error if any
    removeError(field);

    // Add error class to field
    field.classList.add("error");

    // Get the wrapper (should be parent)
    const wrapper = field.parentElement;

    // Create and append error message
    const errorMsg = createErrorMessage(message);
    wrapper.appendChild(errorMsg);
  }

  // Remove error from a field
  function removeError(field) {
    field.classList.remove("error");
    const wrapper = field.parentElement;
    const existingError = wrapper.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }
  }

  // Validate a single field
  function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value;
    const rule = validationRules[fieldName];

    if (!rule) return true;

    const isValid = rule.validate(fieldValue);
    const message =
      typeof rule.message === "function"
        ? rule.message(fieldValue)
        : rule.message;

    if (!isValid) {
      showError(field, message);
      return false;
    } else {
      removeError(field);
      return true;
    }
  }

  // Validate all fields
  function validateForm() {
    const fields = contactForm.querySelectorAll("input, textarea");
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Add real-time validation on blur
  const formFields = contactForm.querySelectorAll("input, textarea");
  formFields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    // Clear error on input (optional - for better UX)
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) {
        validateField(field);
      }
    });
  });

  // Validate on form submit
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, you can submit it here
      console.log("Form is valid, ready to submit");
      // contactForm.submit(); // Uncomment to actually submit
    } else {
      // Focus first invalid field
      const firstError = contactForm.querySelector(
        "input.error, textarea.error"
      );
      if (firstError) {
        firstError.focus();
      }
    }
  });
}

// Initialize form validation if on contact page
if (document.body.classList.contains("page-contact")) {
  initContactFormValidation();
}

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
