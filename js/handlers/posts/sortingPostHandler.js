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
      console.log(`Sort order changed to: ${sortOrder}`);
      sortExistingPosts(sortOrder);
    });
  }
}

/**
 * Sort posts that are already in the DOM
 * @param {string} sortOrder - "newest" or "oldest"
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
    console.log("No posts to sort");
    return; // No posts to sort
  }

  console.log(`Sorting ${posts.length} posts by ${sortOrder}`);

  // Debug: Log some timestamps before sorting
  if (posts.length > 0) {
    console.log("Sample timestamps:");
    for (let i = 0; i < Math.min(3, posts.length); i++) {
      console.log(`Post ${i}: ${posts[i].dataset.timestamp}`);
    }
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

  // Debug: Log some timestamps after sorting
  if (posts.length > 0) {
    console.log("Sample timestamps after sorting:");
    for (let i = 0; i < Math.min(3, posts.length); i++) {
      console.log(`Post ${i}: ${posts[i].dataset.timestamp}`);
    }
  }

  // Clear and re-append sorted posts
  wrapper.innerHTML = "";
  posts.forEach((post) => wrapper.appendChild(post));

  console.log("Posts sorted successfully");
}
