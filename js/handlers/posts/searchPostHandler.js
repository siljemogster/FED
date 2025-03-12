import { searchPosts } from "../../api/posts/searchPosts.js";
import { generatePosts } from "./feedHandler.js";

/**
 * Sets up a search handler for posts that triggers on search button click
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the search handler when the page loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   searchPostHandler();
 * });
 *
 * // After initialization, users can enter search terms and click the search button
 * // to find posts that match their query
 * ```
 */
export default function searchPostHandler() {
  const searchButton = document.querySelector("#search-button");
  const searchInput = document.querySelector("#search-input");

  searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim();

    const displayContainer = document.getElementById("display-container");

    try {
      const posts = await searchPosts(searchTerm);
      generatePosts(posts, displayContainer);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  });
}
