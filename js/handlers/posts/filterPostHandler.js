import { generatePosts } from "./feedHandler.js";

/**
 * Sets up a filter handler that filters posts by author name
 * @param {Array} posts - Array of post objects to filter
 * @param {HTMLElement} container - Container element where posts are displayed
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the filter handler with posts and container
 * const posts = await fetchPosts();
 * const container = document.getElementById('posts-container');
 * filterPostHandler(posts, container);
 *
 * // Now users can type in the filter input to filter posts by author name
 * ```
 */
export default function filterPostHandler(posts, container) {
  const filterInput = document.querySelector("#name-filter");

  filterInput.addEventListener("input", function (event) {
    const filterValue = event.target.value.toLowerCase();
    const filteredPosts = posts.filter(function (post) {
      if (post.author?.name.toLowerCase().includes(filterValue)) {
        return true;
      }
      return false;
    });
    generatePosts(filteredPosts, container);
  });
}
