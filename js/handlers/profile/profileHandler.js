/**
 * Handler for the profile page
 */
import { BASE_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken, getUsername } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

/**
 * Initialize the profile page
 */
export function profileHandler() {
  const profileContainer = document.getElementById("profile-container");
  const postsContainer = document.getElementById("posts-container");
  
  if (!profileContainer) {
    console.error("Profile container not found");
    return;
  }
  
  // Get username from URL or use current user's username
  const urlParams = new URLSearchParams(window.location.search);
  const profileUsername = urlParams.get("name") || getUsername();
  
  if (profileUsername) {
    loadProfile(profileUsername, profileContainer);
    
    if (postsContainer) {
      loadProfilePosts(profileUsername, postsContainer);
    }
  } else {
    displayMessage(profileContainer, "error", "No username specified");
  }
}

/**
 * Load profile information
 * @param {string} username - Username to load
 * @param {HTMLElement} container - Container to display profile in
 */
async function loadProfile(username, container) {
  try {
    // Show loading state
    container.innerHTML = `<div class="text-center py-4">Loading profile...</div>`;
    
    // Fetch profile data
    const profileData = await fetchUserProfile(username);
    
    // Display profile
    displayProfile(profileData, container);
  } catch (error) {
    displayMessage(container, "error", `Failed to load profile: ${error.message}`);
  }
}

/**
 * Fetch user profile data
 * @param {string} username - Username to fetch
 * @returns {Promise<Object>} Profile data
 */
async function fetchUserProfile(username) {
  const accessToken = getToken();
  
  if (!accessToken) {
    throw new Error("Authentication required. Please log in.");
  }
  
  const url = `${BASE_URL}/social/profiles/${username}`;
  
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY
    }
  };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.errors?.[0]?.message || `Failed to fetch profile for ${username}`);
  }
  
  const json = await response.json();
  return json.data;
}

/**
 * Display profile information
 * @param {Object} profile - Profile data
 * @param {HTMLElement} container - Container to display profile in
 */
function displayProfile(profile, container) {
  // Clear container
  container.innerHTML = "";
  
  // Create profile card
  const profileCard = document.createElement("div");
  profileCard.className = "bg-white p-6 rounded-lg shadow-sm";
  
  // Profile header with avatar and name
  const headerDiv = document.createElement("div");
  headerDiv.className = "flex flex-col md:flex-row items-center gap-4 mb-6";
  
  // Avatar
  const avatar = document.createElement("img");
  if (profile.avatar?.url) {
    avatar.src = profile.avatar.url;
  } else {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200&background=random`;
  }
  avatar.alt = profile.name;
  avatar.className = "w-32 h-32 rounded-full object-cover";
  
  // Profile info
  const infoDiv = document.createElement("div");
  infoDiv.className = "flex flex-col text-center md:text-left";
  
  const name = document.createElement("h1");
  name.className = "text-2xl font-bold";
  name.textContent = profile.name;
  
  const email = document.createElement("p");
  email.className = "text-gray-600";
  email.textContent = profile.email || "";
  
  // Append profile info elements
  infoDiv.appendChild(name);
  infoDiv.appendChild(email);
  
  // Bio section if available
  if (profile.bio) {
    const bioSection = document.createElement("div");
    bioSection.className = "mt-4";
    
    const bioHeading = document.createElement("h2");
    bioHeading.className = "text-lg font-semibold";
    bioHeading.textContent = "Bio";
    
    const bioText = document.createElement("p");
    bioText.className = "text-gray-700";
    bioText.textContent = profile.bio;
    
    bioSection.appendChild(bioHeading);
    bioSection.appendChild(bioText);
    infoDiv.appendChild(bioSection);
  }
  
  // Append header elements
  headerDiv.appendChild(avatar);
  headerDiv.appendChild(infoDiv);
  
  // Stats section
  const statsDiv = document.createElement("div");
  statsDiv.className = "flex justify-around text-center border-t border-b py-4 my-4";
  
  const createStat = (label, value) => {
    const statDiv = document.createElement("div");
    
    const statValue = document.createElement("div");
    statValue.className = "text-xl font-bold";
    statValue.textContent = value;
    
    const statLabel = document.createElement("div");
    statLabel.className = "text-sm text-gray-500";
    statLabel.textContent = label;
    
    statDiv.appendChild(statValue);
    statDiv.appendChild(statLabel);
    
    return statDiv;
  };
  
  statsDiv.appendChild(createStat("Posts", profile._count?.posts || 0));
  statsDiv.appendChild(createStat("Followers", profile._count?.followers || 0));
  statsDiv.appendChild(createStat("Following", profile._count?.following || 0));
  
  // Assemble profile card
  profileCard.appendChild(headerDiv);
  profileCard.appendChild(statsDiv);
  
  // Add to container
  container.appendChild(profileCard);
}

/**
 * Load and display posts by a specific user
 * @param {string} username - Username to load posts for
 * @param {HTMLElement} container - Container to display posts in
 */
async function loadProfilePosts(username, container) {
  try {
    // Show loading state
    container.innerHTML = `<div class="text-center py-4">Loading posts...</div>`;
    
    // Fetch user's posts
    const posts = await fetchProfilePosts(username);
    
    // Clear container
    container.innerHTML = "";
    
    // Add heading
    const heading = document.createElement("h2");
    heading.className = "text-xl font-bold mb-4";
    heading.textContent = "Posts";
    container.appendChild(heading);
    
    // Display posts
    if (posts && posts.length > 0) {
      generatePosts(posts, container);
    } else {
      container.innerHTML += '<p class="text-center text-gray-500">No posts yet</p>';
    }
  } catch (error) {
    displayMessage(container, "error", `Failed to load posts: ${error.message}`);
  }
}

/**
 * Fetch posts by a specific user
 * @param {string} username - Username to fetch posts for
 * @returns {Promise<Array>} Array of post objects
 */
async function fetchProfilePosts(username) {
  const accessToken = getToken();
  
  if (!accessToken) {
    throw new Error("Authentication required. Please log in.");
  }
  
  const url = `${BASE_URL}/social/profiles/${username}/posts`;
  
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY
    }
  };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.errors?.[0]?.message || `Failed to fetch posts for ${username}`);
  }
  
  const json = await response.json();
  return json.data;
}

// Use the same generatePosts and createInteractionElement functions as in feedHandler.js