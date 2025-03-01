/**
 * Feed page implementation
 */
import { POSTS_URL, NOROFF_API_KEY } from "./constants/api.js";
import { getToken } from "./helpers/storage.js";

// Get display container
const displayContainer = document.getElementById("display-container");

/**
 * Fetch posts from API
 * @returns {Promise<Array>} Posts array
 */
async function fetchPosts() {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("No access token found. Please log in.");
    }
    
    const fetchOptions = {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };

    const response = await fetch(POSTS_URL, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const json = await response.json();
    console.log("Posts data:", json);
    return json.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (displayContainer) {
      displayContainer.innerHTML = `
        <div class="text-red-700 bg-red-100 p-4 rounded-lg my-3" role="alert">
          Error fetching posts: ${error.message}
        </div>
      `;
    }
    return [];
  }
}

/**
 * Display posts in the container
 * @param {Array} posts - Posts to display
 */
function displayPosts(posts) {
  if (!posts || posts.length === 0) {
    displayContainer.innerHTML = '<p class="text-gray-500">No posts found</p>';
    return;
  }
  
  // Clear the container first
  displayContainer.innerHTML = '';
  
  // Add a title
  const heading = document.createElement("h1");
  heading.className = "text-2xl font-bold mb-4";
  heading.textContent = "Posts";
  displayContainer.appendChild(heading);
  
  // Display each post
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postContainer = document.createElement("div");
    postContainer.className = "border p-4 mb-4 rounded-lg shadow-sm";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = post.title;

    const body = document.createElement("p");
    body.className = "text-gray-700";
    body.textContent = post.body;  // Fixed typo: changed textContext to textContent
    
    postContainer.append(title, body);
    displayContainer.append(postContainer);
  }
}

/**
 * Main function to initialize the feed
 */
async function main() {
  console.log("Fetching posts...");
  const posts = await fetchPosts();
  console.log("Posts fetched:", posts);
  displayPosts(posts);
}

// Run the main function when the page loads
main();