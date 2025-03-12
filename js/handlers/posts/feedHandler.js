import { fetchPosts } from "../../api/posts/fetchPosts.js";
import { isLoggedIn } from "../../helpers/storage.js";
import { setupUserInterface, setupMobileMenu, preventHorizontalScroll } from "./uiSetup.js";
import { setupPostForm } from "./postFormHandler.js";
import { generatePosts } from "./renderPosts.js";
import filterPostHandler from "./filterPostHandler.js";

/**
 * Main feed handler function that initializes the feed page
 */
export function feedHandler() {
  console.log("Feed handler initialized");

  if (!isLoggedIn()) {
    console.log("User not logged in, redirecting to login page");
    location.href = "/";
    return;
  }

  setupUserInterface();
  setupPostForm();
  loadPosts();
  setupMobileMenu();
  preventHorizontalScroll();
}

/**
 * Load and display posts from the API
 */
export async function loadPosts() {
  const displayContainer = document.getElementById("display-container");

  if (!displayContainer) {
    console.error("Display container not found");
    return;
  }

  try {
    displayContainer.innerHTML = `
      <div class="max-w-2xl mx-auto p-4">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Loading posts...</p>
        </div>
      </div>
    `;

    console.log("Fetching posts...");
    const posts = await fetchPosts();
    console.log("Posts received:", posts);

    displayContainer.innerHTML = "";

    if (posts && posts.length > 0) {
      generatePosts(posts, displayContainer);
      
      // Add try-catch around filterPostHandler to prevent it from breaking the page
      try {
        filterPostHandler(posts, displayContainer);
      } catch (filterError) {
        console.warn("Filter post handler error:", filterError);
        // Continue even if filter handler fails
      }
    } else {
      displayContainer.innerHTML = `
        <div class="max-w-2xl mx-auto p-4">
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <p>No posts found. Be the first to post!</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    displayContainer.innerHTML = `
      <div class="max-w-2xl mx-auto p-4">
        <div class="bg-red-100 text-red-700 p-6 rounded-lg shadow-sm">
          <p>Error loading posts: ${error.message || "Unknown error"}</p>
          <button class="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg" onclick="location.reload()">
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}