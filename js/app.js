import { loginHandler } from "./handlers/auth/loginHandler.js";
import { registerHandler } from "./handlers/auth/registerHandler.js";
import { editPostHandler } from "./handlers/posts/editPostHandler.js";
import { feedHandler } from "./handlers/posts/feedHandler.js";
import searchPostHandler from "./handlers/posts/searchPostHandler.js";
import singlePostHandler from "./handlers/posts/singlePostHandler.js";
import { isLoggedIn } from "./helpers/storage.js";
import { initSorting } from "./handlers/posts/sortingPostHandler.js";

/**
 * Application router - directs to appropriate handler based on current page
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the application routing
 * router();
 * ```
 */
function router() {
  const pathname = window.location.pathname;

  // Authentication check for protected routes
  if (
    (pathname === "/feed/" ||
      pathname === "/feed/index.html" ||
      pathname === "/profile/" ||
      pathname === "/profile/index.html") &&
    !isLoggedIn()
  ) {
    location.href = "/";
    return;
  }

  // Route to appropriate handler
  switch (pathname) {
    case "/":
    case "/index.html":
      loginHandler();
      break;

    case "/register/":
    case "/register/index.html":
      registerHandler();
      break;

    case "/feed/":
    case "/feed/index.html":
      feedHandler();
      searchPostHandler();
      initSorting();
      break;

    case "/feed/post.html":
      singlePostHandler();
      break;

    case "/feed/edit.html":
      editPostHandler();
      break;

    case "/profile/":
    case "/profile/index.html":
      // profileHandler(); // Implement this if needed
      break;
  }

  // Set up global navigation handlers
  setupNavigation();

  // Initialize UI components
  initializeUIComponents();
}

/**
 * Set up global navigation event handlers for the application
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Setup navigation handlers
 * setupNavigation();
 * ```
 */
function setupNavigation() {
  // Handle logout buttons
  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.clear();
      location.href = "/";
    });
  });
}

/**
 * Initialize all UI components for the current page
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize all UI components after page load
 * initializeUIComponents();
 * ```
 */
function initializeUIComponents() {
  // Mobile Menu
  initializeMobileMenu();

  // Post Form
  initializePostForm();

  // Search
  initializeSearch();

  // Sorting (if not already handled by initSorting())
  initializeSorting();
}

/**
 * Initialize the mobile menu functionality with toggle behavior
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Setup mobile menu toggle functionality
 * initializeMobileMenu();
 * ```
 */
function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuButton) {
    // Try to find it by aria attribute as a fallback
    const buttonByAria = document.querySelector(
      "button[aria-controls='mobile-menu']"
    );
    if (buttonByAria) {
      mobileMenuButton = buttonByAria;
    } else {
      return;
    }
  }

  if (!mobileMenu) {
    return;
  }

  // Remove any existing click listeners to prevent duplicates
  mobileMenuButton.removeEventListener("click", toggleMobileMenu);

  // Add click event for menu toggle
  mobileMenuButton.addEventListener("click", toggleMobileMenu);

  /**
   * Toggle the mobile menu visibility
   * @param {Event} e - The click event
   * @returns {void} Does not return a value
   */
  function toggleMobileMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    // Toggle the hidden class
    mobileMenu.classList.toggle("hidden");

    // Update aria-expanded attribute
    const isExpanded = !mobileMenu.classList.contains("hidden");
    mobileMenuButton.setAttribute(
      "aria-expanded",
      isExpanded ? "true" : "false"
    );
  }

  // Optional: Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      mobileMenuButton &&
      mobileMenu &&
      !mobileMenuButton.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      if (!mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    }
  });
}

/**
 * Initialize the post form submission handler
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Setup post form handling
 * initializePostForm();
 * ```
 */
function initializePostForm() {
  const postForm = document.getElementById("postForm");

  if (!postForm) {
    // Form not present on this page
    return;
  }

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(postForm);
    const postData = {
      title: formData.get("title"),
      body: formData.get("body"),
      mediaUrl: formData.get("mediaUrl") || "",
      mediaAlt: formData.get("mediaAlt") || "",
    };

    // Here you would normally send this data to your server
    // For now, just simulate success
    alert("Post submitted successfully!");
    postForm.reset();
  });
}

/**
 * Initialize the search functionality
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Setup search functionality
 * initializeSearch();
 * ```
 */
function initializeSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (!searchInput || !searchButton) {
    // Search elements not present on this page
    return;
  }

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      // Your search implementation goes here
    }
  });

  // Allow search on pressing Enter
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });
}

/**
 * Initialize the post sorting functionality if not handled by imported initSorting
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Setup post sorting
 * initializeSorting();
 * ```
 */
function initializeSorting() {
  const sortSelect = document.getElementById("sort-posts");

  if (!sortSelect) {
    // Sort element not present on this page
    return;
  }

  // Only add event listener if one doesn't exist from imported initSorting
  if (!sortSelect.hasAttribute("data-initialized")) {
    sortSelect.addEventListener("change", function () {
      const sortValue = sortSelect.value;
      // Your sorting implementation goes here
    });

    // Mark as initialized
    sortSelect.setAttribute("data-initialized", "true");
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  router();
});

// Also make sure it works if we're loaded after DOM is ready
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  router();
}

// Initialize the application
router();
