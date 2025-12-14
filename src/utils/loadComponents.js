/**
 * Calculate the path to assets folder from current page
 * @returns {string} Path to assets folder (relative or absolute based on base URL)
 */
function getAssetsPath() {
  const pathname = window.location.pathname;

  // Get base URL for production
  let baseUrl = "/";
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) {
      baseUrl = import.meta.env.BASE_URL;
    } else if (pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  } catch (e) {
    if (pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  }

  // In production with base URL, use absolute paths
  if (baseUrl !== "/") {
    return `${baseUrl}assets/`;
  }

  // Development mode: use relative paths
  const isIndexPage =
    pathname === "/" ||
    pathname.endsWith("/") ||
    pathname.endsWith("index.html") ||
    !pathname.includes("/pages/");

  // From index.html (root): assets are at assets/ (relative to root)
  // From src/pages/*.html: assets are at ../../assets/
  return isIndexPage ? "assets/" : "../../assets/";
}

/**
 * Fix asset paths in loaded HTML to work from current page location
 * @param {string} html - The HTML content to fix
 * @returns {string} HTML with corrected asset paths
 */
function fixAssetPaths(html) {
  const assetsPath = getAssetsPath();
  console.log(`[fixAssetPaths] Assets path determined: ${assetsPath}`);

  // First, handle absolute paths that start with /assets/ (most common case)
  let fixedHtml = html.replace(
    /(src|href)\s*=\s*["']\/assets\/([^"']+)["']/g,
    (match, attr, relativePath) => {
      const newPath = `${assetsPath}${relativePath}`;
      console.log(
        `[fixAssetPaths] Converting absolute path: /assets/${relativePath} -> ${newPath}`
      );
      return `${attr}="${newPath}"`;
    }
  );

  // Then handle relative paths with assets/ (../../assets/..., ./assets/..., assets/...)
  fixedHtml = fixedHtml.replace(
    /(src|href)\s*=\s*["']([^"']*\/assets\/[^"']*)["']/g,
    (match, attr, path) => {
      // Only process if not already processed (doesn't start with the assetsPath)
      if (path.startsWith(assetsPath)) {
        return match; // Already fixed, skip
      }

      // Extract the path after /assets/ or assets/
      let assetRelativePath = path
        .replace(/^\/assets\//, "") // Remove /assets/ from start
        .replace(/^(\.\.\/)+assets\//, "") // Remove ../../assets/ or ../assets/
        .replace(/^\.\/assets\//, "") // Remove ./assets/
        .replace(/^assets\//, ""); // Remove assets/ if still present

      // If path still starts with /, remove it
      assetRelativePath = assetRelativePath.replace(/^\//, "");

      const newPath = `${assetsPath}${assetRelativePath}`;
      console.log(
        `[fixAssetPaths] Converting relative path: ${path.trim()} -> ${newPath}`
      );
      return `${attr}="${newPath}"`;
    }
  );

  return fixedHtml;
}

/**
 * Fix navigation links in loaded HTML to work from current page location
 * @param {string} html - The HTML content to fix
 * @returns {string} HTML with corrected navigation links
 */
function fixNavigationLinks(html) {
  const pathname = window.location.pathname;

  // Get base URL from Vite (will be "/designo-website/" in production, "/" in dev)
  // In production build, Vite exposes BASE_URL via import.meta.env
  let baseUrl = "/";
  try {
    // Try to get BASE_URL from Vite's environment
    if (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) {
      baseUrl = import.meta.env.BASE_URL;
    } else if (pathname.includes("/designo-website/")) {
      // Fallback: detect from pathname
      baseUrl = "/designo-website/";
    }
  } catch (e) {
    // If import.meta is not available, use pathname detection
    if (pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  }

  // Map page names to their file paths
  const pageMap = {
    about: "about.html",
    locations: "locations.html",
    contact: "contact.html",
    "web-design": "web-design.html",
    "app-design": "app-design.html",
    "graphic-design": "graphic-design.html",
  };

  // Fix home/index page links - replace ../index.html or ./index.html patterns
  // Use a more precise regex that only matches the href attribute value
  let fixedHtml = html.replace(
    /(href\s*=\s*["'])([^"']*index\.html)(["'])/g,
    (match, prefix, fullPath, suffix) => {
      let newPath;

      if (baseUrl === "/") {
        // Development mode
        const isIndexPage =
          pathname === "/" ||
          pathname.endsWith("/") ||
          pathname.endsWith("index.html") ||
          (!pathname.includes("/pages/") &&
            !pathname.includes("about.html") &&
            !pathname.includes("locations.html") &&
            !pathname.includes("contact.html") &&
            !pathname.includes("web-design.html") &&
            !pathname.includes("app-design.html") &&
            !pathname.includes("graphic-design.html"));

        if (isIndexPage) {
          // Already on index, link to itself
          newPath = "index.html";
        } else {
          // From pages directory (src/pages/): go up two levels to root
          // From src/pages/about.html, we need ../../ to reach root
          newPath = "../../index.html";
        }
      } else {
        // Production mode: link to base URL (home page)
        newPath = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      }

      console.log(
        `[fixNavigationLinks] Converting home link: ${fullPath.trim()} -> ${newPath}`
      );
      return `${prefix}${newPath}${suffix}`;
    }
  );

  // Fix navigation links - replace ../pages/pageName.html patterns
  // Use absolute paths from base URL for consistency in both dev and production
  // More precise regex that only matches the href attribute value
  fixedHtml = fixedHtml.replace(
    /(href\s*=\s*["'])([^"']*pages\/([\w-]+)\.html)(["'])/g,
    (match, prefix, fullPath, pageName, suffix) => {
      const fileName = pageMap[pageName] || `${pageName}.html`;
      let newPath;

      if (baseUrl === "/") {
        // Development mode: use relative paths
        // Check if we're on index page or in pages directory
        const isIndexPage =
          pathname === "/" ||
          pathname.endsWith("/") ||
          pathname.endsWith("index.html") ||
          !pathname.includes("/pages/");

        if (isIndexPage) {
          // From index: use src/pages/pageName.html
          newPath = `src/pages/${fileName}`;
        } else {
          // From pages directory: use just filename (same directory)
          newPath = fileName;
        }
      } else {
        // Production mode: Vite preserves directory structure
        // So src/pages/about.html becomes /designo-website/src/pages/about.html
        newPath = `${baseUrl}src/pages/${fileName}`;
      }

      console.log(
        `[fixNavigationLinks] Converting: ${fullPath.trim()} -> ${newPath} (base: ${baseUrl})`
      );
      return `${prefix}${newPath}${suffix}`;
    }
  );

  // Keep target="_blank" - don't remove it (user wants links to open in new tabs)

  return fixedHtml;
}

/**
 * Utility function to load HTML components into the page
 * @param {string} componentPath - Path to the component HTML file
 * @param {string} targetSelector - CSS selector for the target element
 */
export async function loadComponent(componentPath, targetSelector) {
  try {
    console.log(`[loadComponent] Attempting to load: ${componentPath}`);
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(
        `Failed to load component: ${componentPath} (Status: ${response.status})`
      );
    }
    let html = await response.text();

    // Check if we accidentally got a full HTML page instead of component content
    if (html.includes("<!DOCTYPE html>") || html.includes("<html")) {
      console.error(
        `[loadComponent] ERROR: Received full HTML page instead of component for ${componentPath}. This usually means the component file doesn't exist at that path.`
      );
      throw new Error(
        `Component file not found or incorrect path: ${componentPath}`
      );
    }

    // Log original HTML for debugging
    if (componentPath.includes("header.html")) {
      console.log(
        "[loadComponent] Original header HTML:",
        html.substring(0, 500)
      );
    }

    // Fix asset paths to work from current page location
    html = fixAssetPaths(html);

    // Fix navigation links if this is the header component
    if (componentPath.includes("header.html")) {
      html = fixNavigationLinks(html);
      console.log(
        "[loadComponent] Processed header HTML:",
        html.substring(0, 500)
      );

      // Specifically check for logo image src after processing
      const logoMatch = html.match(
        /<img[^>]*src=["']([^"']+)["'][^>]*class=["']logo["']/
      );
      if (logoMatch) {
        console.log(
          "[loadComponent] ✓ Logo image src after processing:",
          logoMatch[1]
        );
      } else {
        console.warn(
          "[loadComponent] ✗ Logo image src NOT found in processed HTML!"
        );
        // Try to find any img tag
        const anyImg = html.match(/<img[^>]*>/);
        if (anyImg) {
          console.log("[loadComponent] Found img tag:", anyImg[0]);
        }
      }
    }

    const target = document.querySelector(targetSelector);
    if (target) {
      target.innerHTML = html;
      console.log(
        `[loadComponent] Successfully loaded component into ${targetSelector}`
      );

      // After inserting, check the actual DOM element
      if (componentPath.includes("header.html")) {
        const logoImg = target.querySelector("img.logo");
        if (logoImg) {
          console.log(
            "[loadComponent] Logo img element found in DOM, src:",
            logoImg.src
          );
          console.log(
            "[loadComponent] Logo img element found in DOM, currentSrc:",
            logoImg.currentSrc
          );
        } else {
          console.warn(
            "[loadComponent] Logo img element NOT found in DOM after insertion!"
          );
        }
      }
    } else {
      console.warn(`Target element not found: ${targetSelector}`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
    console.error(`Current pathname: ${window.location.pathname}`);
    console.error(`Try checking if the file exists at: ${componentPath}`);
  }
}

/**
 * Load header and footer components
 */
export async function loadHeaderAndFooter() {
  // Get base URL for production
  let baseUrl = "/";
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) {
      baseUrl = import.meta.env.BASE_URL;
    } else if (window.location.pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  } catch (e) {
    if (window.location.pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  }

  // Determine the base path based on current page location
  const pathname = window.location.pathname;
  const isIndexPage =
    pathname === "/" ||
    pathname === baseUrl ||
    pathname.endsWith("/") ||
    pathname.endsWith("index.html") ||
    (!pathname.includes("/pages/") &&
      !pathname.includes("about.html") &&
      !pathname.includes("locations.html") &&
      !pathname.includes("contact.html") &&
      !pathname.includes("web-design.html") &&
      !pathname.includes("app-design.html") &&
      !pathname.includes("graphic-design.html"));

  // Calculate component path - account for production base URL
  let basePath;
  if (baseUrl !== "/") {
    // Production: use absolute path from base URL
    basePath = `${baseUrl}src/components/`;
  } else {
    // Development: use relative paths
    basePath = isIndexPage ? "./src/components/" : "../components/";
  }

  // Load header into <header> element or create one at the start of body
  const headerTarget =
    document.querySelector("header") ||
    document.querySelector("[data-header]") ||
    document.body;

  if (headerTarget === document.body) {
    const headerElement = document.createElement("header");
    headerElement.className = "site-header";
    document.body.insertBefore(headerElement, document.body.firstChild);
    await loadComponent(`${basePath}header.html`, "header");
  } else {
    // Add class name to existing header element if it doesn't have one
    if (headerTarget.tagName === "HEADER" && !headerTarget.className) {
      headerTarget.className = "site-header";
    }
    await loadComponent(
      `${basePath}header.html`,
      headerTarget.tagName === "HEADER" ? "header" : "[data-header]"
    );
  }

  // Load footer into <footer> element or create one at the end of body
  const footerTarget =
    document.querySelector("footer") ||
    document.querySelector("[data-footer]") ||
    document.body;

  if (footerTarget === document.body) {
    const footerElement = document.createElement("footer");
    footerElement.className = "site-footer";
    document.body.appendChild(footerElement);
    await loadComponent(`${basePath}footer.html`, "footer");
  } else {
    // Add class name to existing footer element if it doesn't have one
    if (footerTarget.tagName === "FOOTER" && !footerTarget.className) {
      footerTarget.className = "site-footer";
    }
    await loadComponent(
      `${basePath}footer.html`,
      footerTarget.tagName === "FOOTER" ? "footer" : "[data-footer]"
    );
  }
}

/**
 * Load contact component (excluded from contact.html page)
 */
export async function loadContact() {
  // Check if we're on the contact page - if so, skip loading the contact component
  const isContactPage =
    window.location.pathname.includes("contact.html") ||
    window.location.pathname.endsWith("/contact");

  if (isContactPage) {
    return; // Don't load contact component on contact page
  }

  // Get base URL for production
  let baseUrl = "/";
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) {
      baseUrl = import.meta.env.BASE_URL;
    } else if (window.location.pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  } catch (e) {
    if (window.location.pathname.includes("/designo-website/")) {
      baseUrl = "/designo-website/";
    }
  }

  // Determine the base path based on current page location
  const pathname = window.location.pathname;
  const isIndexPage =
    pathname === "/" ||
    pathname === baseUrl ||
    pathname.endsWith("/") ||
    pathname.endsWith("index.html") ||
    (!pathname.includes("/pages/") &&
      !pathname.includes("about.html") &&
      !pathname.includes("locations.html") &&
      !pathname.includes("contact.html") &&
      !pathname.includes("web-design.html") &&
      !pathname.includes("app-design.html") &&
      !pathname.includes("graphic-design.html"));

  // Calculate component path - account for production base URL
  let basePath;
  if (baseUrl !== "/") {
    // Production: use absolute path from base URL
    basePath = `${baseUrl}src/components/`;
  } else {
    // Development: use relative paths
    basePath = isIndexPage ? "./src/components/" : "../components/";
  }

  // Load contact into <section data-contact> element or create one
  const contactTarget =
    document.querySelector("[data-contact]") ||
    document.querySelector("section[data-contact]");

  if (!contactTarget) {
    // Create a section element for the contact component
    const contactElement = document.createElement("section");
    contactElement.className = "contact-section";
    contactElement.setAttribute("data-contact", "");
    // Insert before footer if it exists, otherwise append to body
    const footer =
      document.querySelector("footer") ||
      document.querySelector("[data-footer]");
    if (footer) {
      document.body.insertBefore(contactElement, footer);
    } else {
      document.body.appendChild(contactElement);
    }
    await loadComponent(`${basePath}contact.html`, "[data-contact]");
  } else {
    // Add class name to existing contact element if it doesn't have one
    if (!contactTarget.className) {
      contactTarget.className = "contact-section";
    }
    await loadComponent(`${basePath}contact.html`, "[data-contact]");
  }
}
