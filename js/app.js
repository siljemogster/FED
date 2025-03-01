import { loginHandler } from "./handlers/auth/loginHandler.js";
import { registerHandler } from "./handlers/auth/registerHandler.js";
import { feedHandler } from "./handlers/posts/feedHandler.js";
import { isLoggedIn } from "./helpers/storage.js";

/**
 * Application router - directs to appropriate handler based on current page
 */
function router() {
  const pathname = window.location.pathname;
  console.log("Current path:", pathname);

  // Authentication check for protected routes
  if ((pathname === "/feed/" || pathname === "/feed/index.html" || pathname === "/profile/" || pathname === "/profile/index.html") && !isLoggedIn()) {
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
}

/**
 * Set up global navigation event handlers
 */
function setupNavigation() {
  // Handle logout buttons
  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach(button => {
    button.addEventListener("click", () => {
      console.log("Logging out");
      localStorage.clear();
      location.href = "/";
    });
  });
  
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector("button[aria-controls='mobile-menu']");
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.classList.toggle("hidden");
      }
    });
  }
}

// Initialize the application
router();
