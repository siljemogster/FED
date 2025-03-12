import { searchPosts } from "../../api/posts/searchPosts.js";
import { generatePosts } from "./feedHandler.js";

export default function searchPostHandler() {
  const searchButton = document.querySelector("#search-button");
  const searchInput = document.querySelector("#search-input");

  searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim();

    const displayContainer = document.getElementById("display-container");

    try {
      const posts = await searchPosts(searchTerm);
      console.log(posts);
      generatePosts(posts, displayContainer);
      //   displayPosts(posts);
    } catch (error) {
      // display error message
      console.log(error);
    }
  });
}
