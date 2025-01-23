const BASE_URL = "https://v2.api.noroff.dev/api/v1/social";

/**
 *
 * @param {Array} posts
 * @param {string} criteria
 * @returns {Array}
 */
function sortPosts(posts, criteria) {
  return posts.sort((a, b) => {
    switch (criteria) {
      case "popular":
        return b.likes - a.likes;
      case "comments":
        return b.comments - a.comments;
      case "recent":
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });
}

const filterSelect = document.querySelector("select");
if (filterSelect) {
  filterSelect.addEventListener("change", (event) => {
    const criteria = event.target.value;
    updateFeed(criteria);
  });
}

async function updateFeed(criteria = "recent") {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch posts");

    const posts = await response.json();
    const sortedPosts = sortPosts(posts, criteria);

    const feedContainer = document.querySelector(".space-y-6");
    feedContainer.innerHTML = "";

    sortedPosts.forEach((post) => {
      feedContainer.appendChild(createPostElement(post));
    });
  } catch (error) {
    console.error("Error updating feed:", error);
    displayMessage("#message", "error", "Failed to load posts");
  }
}

/**
 * Creates HTML element for a post
 * @param {Object} post - Post data object
 * @returns {HTMLElement} Article element for the post
 */
function createPostElement(post) {
  const article = document.createElement("article");
  article.className = "bg-white p-6 rounded-lg shadow-sm";
  article.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="w-10 h-10 rounded-full"/>
            <div>
                <h3 class="font-semibold">${post.author.name}</h3>
                <time class="text-sm text-gray-500">${formatDate(post.created)}</time>
            </div>
        </div>
        <p class="mb-4">${post.body}</p>
    `;
  return article;
}

const searchInput = document.querySelector('input[type="search"]');
if (searchInput) {
  searchInput.addEventListener("input", debounce(handleSearch, 300));
}

async function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  console.log("Search term:", searchTerm);

  const posts = await fetchPosts();
  console.log("All posts:", posts);

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm) ||
      post.body?.toLowerCase().includes(searchTerm) ||
      post.author?.name?.toLowerCase().includes(searchTerm)
  );
  console.log("Filtered posts:", filteredPosts);

  updateFeedDisplay(filteredPosts);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function updateFeedDisplay(posts) {
  const feedContainer = document.querySelector(".space-y-6");
  feedContainer.innerHTML = "";
  posts.forEach((post) => feedContainer.appendChild(createPostElement(post)));
}

async function fetchPosts() {
  const response = await fetch(`${BASE_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.round((now - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        -count,
        interval.label
      );
    }
  }

  return "just now";
}

updateFeed();
