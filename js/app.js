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
 */
function router() {
  const pathname = window.location.pathname;
  console.log("Current path:", pathname);

  // Authentication check for protected routes
  if (
    (pathname === "/feed/" ||
      pathname === "/feed/index.html" ||
      pathname === "/profile/" ||
      pathname === "/profile/index.html") &&
    !isLoggedIn()
  ) {
    console.log("Protected route, redirecting to login");
    location.href = "/";
    return;
  }

  // Route to appropriate handler
  switch (pathname) {
    case "/":
    case "/index.html":
      console.log("Home/Login page");
      loginHandler();
      break;

    case "/register/":
    case "/register/index.html":
      console.log("Register page");
      registerHandler();
      break;

    case "/feed/":
    case "/feed/index.html":
      console.log("Feed page");
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
      console.log("Profile page");
      // profileHandler(); // Implement this if needed
      break;

    default:
      console.log("No specific handler for this route");
  }

  // Set up global navigation handlers
  setupNavigation();

  // Initialize UI components
  initializeUIComponents();
}

/**
 * Set up global navigation event handlers
 */
function setupNavigation() {
  // Handle logout buttons
  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Logging out");
      localStorage.clear();
      location.href = "/";
    });
  });
}

/**
 * Initialize all UI components
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
 * Mobile Menu Functionality
 */
function initializeMobileMenu() {
  console.log("Setting up mobile menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuButton) {
    console.error("Mobile menu button not found");
    // Try to find it by aria attribute as a fallback
    const buttonByAria = document.querySelector(
      "button[aria-controls='mobile-menu']"
    );
    if (buttonByAria) {
      console.log("Found mobile menu button by aria attribute");
      mobileMenuButton = buttonByAria;
    } else {
      return;
    }
  }

  if (!mobileMenu) {
    console.error("Mobile menu not found");
    return;
  }

  console.log("Mobile menu elements found");

  // Remove any existing click listeners to prevent duplicates
  mobileMenuButton.removeEventListener("click", toggleMobileMenu);

  // Add click event for menu toggle
  mobileMenuButton.addEventListener("click", toggleMobileMenu);

  function toggleMobileMenu(e) {
    console.log("Mobile menu button clicked");
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

    console.log("Mobile menu is now " + (isExpanded ? "visible" : "hidden"));
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
 * Post Form Functionality
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

    console.log("Submitting post:", postData);

    // Here you would normally send this data to your server
    // For now, just simulate success
    alert("Post submitted successfully!");
    postForm.reset();
  });
}

/**
 * Search Functionality
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
      console.log("Searching for:", searchTerm);
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
 * Sorting Functionality (if not already handled by imported initSorting)
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
      console.log("Sorting posts by:", sortValue);
      // Your sorting implementation goes here
    });

    // Mark as initialized
    sortSelect.setAttribute("data-initialized", "true");
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded, initializing application");
  router();
});

// Also make sure it works if we're loaded after DOM is ready
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("Document already ready, initializing application immediately");
  router();
}

// Initialize the application
router();
