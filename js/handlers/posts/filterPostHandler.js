import { generatePosts } from "./feedHandler.js";

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