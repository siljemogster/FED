/**
 * Initializes the post sorting functionality
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize post sorting when the page loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   initSorting();
 * });
 * ```
 */
export function initSorting() {
  const sortPostsDropdown = document.getElementById("sort-posts");

  if (sortPostsDropdown) {
    // Set initial value
    sortPostsDropdown.value = "newest";

    // Wait a moment for posts to load before initial sort
    setTimeout(() => {
      sortExistingPosts("newest");
    }, 500);

    // Add event listener
    sortPostsDropdown.addEventListener("change", (event) => {
      const sortOrder = event.target.value;
      sortExistingPosts(sortOrder);
    });
  }
}

/**
 * Sorts posts that are already in the DOM by their timestamp
 * @param {string} sortOrder - The order to sort posts ("newest" or "oldest")
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Sort posts by newest first
 * sortExistingPosts("newest");
 *
 * // Sort posts by oldest first
 * sortExistingPosts("oldest");
 * ```
 */
function sortExistingPosts(sortOrder) {
  const postsContainer = document.getElementById("display-container");
  if (!postsContainer) {
    console.error("Posts container not found");
    return;
  }

  // Find the wrapper div that contains the posts
  const wrapper = postsContainer.querySelector("div.max-w-2xl");
  if (!wrapper) {
    console.error("Posts wrapper not found");
    return;
  }

  const posts = Array.from(wrapper.children);

  if (posts.length === 0) {
    return; // No posts to sort
  }

  posts.sort((a, b) => {
    // Get timestamps from data attributes
    const dateA = new Date(a.dataset.timestamp || 0);
    const dateB = new Date(b.dataset.timestamp || 0);

    if (sortOrder === "newest") {
      return dateB - dateA; // Newest first (larger date value first)
    } else {
      return dateA - dateB; // Oldest first (smaller date value first)
    }
  });

  // Clear and re-append sorted posts
  wrapper.innerHTML = "";
  posts.forEach((post) => wrapper.appendChild(post));
}
