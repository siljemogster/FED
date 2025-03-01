import { POSTS_URL, NOROFF_API_KEY, BASE_URL } from "../../constants/api.js";
import { getToken, getUsername } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/common/displayMessage.js";


export function profileHandler() {
  console.log("Profile handler initialized");
  

  const profileContainer = document.getElementById("profile-container");
  
  if (!profileContainer) {
    console.error("Profile container not found");
    return;
  }
  

  const postsContainer = document.getElementById("posts-container");
  
  if (!postsContainer) {
    console.error("Posts container not found");
    return;
  }
  

  loadUserProfile(profileContainer, postsContainer);
}

/**
 * Load user profile data and posts
 * @param {HTMLElement} profileContainer - Container for profile details
 * @param {HTMLElement} postsContainer - Container for user's posts
 */
async function loadUserProfile(profileContainer, postsContainer) {
  try {
   
    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get("name");
    const currentUsername = getUsername();

    const username = profileName || currentUsername;
    
    if (!username) {
      displayMessage(profileContainer, "error", "No user specified and you're not logged in");
      return;
    }
    
    console.log(`Loading profile for: ${username}`);
    
 
    const profile = await fetchUserProfile(username);
    console.log("Profile data:", profile);
    
  
    displayProfileData(profile, profileContainer);
  
    loadUserPosts(username, postsContainer);
    
  } catch (error) {
    console.error("Error loading profile:", error);
    displayMessage(profileContainer, "error", `Failed to load profile: ${error.message}`);
  }
}

/**
 * Fetch a user's profile data
 * @param {string} username - Username to fetch
 * @returns {Promise<Object>} User profile data
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || `Failed to fetch profile for ${username}`);
  }
  
  const json = await response.json();
  return json.data;
}

/**
 * Display profile data in the container
 * @param {Object} profile - Profile data
 * @param {HTMLElement} container - Container element
 */
function displayProfileData(profile, container) {
 
  const children = Array.from(container.children);
  for (let i = 1; i < children.length; i++) {
    container.removeChild(children[i]);
  }

  const nameElement = container.querySelector("h1");
  if (nameElement) {
    nameElement.textContent = profile.name;
  }
  
 
  const profileSection = document.createElement("section");
  profileSection.className = "bg-white shadow-sm rounded-b-lg px-6 pb-6";
  

  const profileWrapper = document.createElement("div");
  profileWrapper.className = "relative -mt-20 mb-4";
  
 
  const avatar = document.createElement("img");
  if (profile.avatar?.url) {
    avatar.src = profile.avatar.url;
  } else {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200&background=random`;
  }
  avatar.alt = "Profile Picture";
  avatar.className = "w-40 h-40 rounded-full border-4 border-white shadow-md object-cover";
  profileWrapper.appendChild(avatar);
  
 
  const infoWrapper = document.createElement("div");
  infoWrapper.className = "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4";
  

  const detailsDiv = document.createElement("div");
  
  const username = document.createElement("h1");
  username.className = "text-2xl font-bold text-gray-900";
  username.textContent = profile.name;
  
  const handle = document.createElement("p");
  handle.className = "text-gray-500";
  handle.textContent = `@${profile.name.toLowerCase().replace(/\s+/g, '')}`;
  
  const bio = document.createElement("p");
  bio.className = "mt-2 text-gray-600";
  bio.textContent = profile.bio || "No bio provided";
  
  detailsDiv.appendChild(username);
  detailsDiv.appendChild(handle);
  detailsDiv.appendChild(bio);
  

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "flex gap-4";
  

  if (profile.name !== getUsername()) {
    const followButton = document.createElement("button");
    followButton.className = "px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium";
    followButton.textContent = "Follow";
    actionsDiv.appendChild(followButton);
  }
  
  infoWrapper.appendChild(detailsDiv);
  infoWrapper.appendChild(actionsDiv);
  

  const statsDiv = document.createElement("div");
  statsDiv.className = "flex gap-6 mt-6 pt-6 border-t";
  
 
  const postsDiv = document.createElement("div");
  postsDiv.className = "text-center";
  const postsCount = document.createElement("div");
  postsCount.className = "font-bold text-gray-900";
  postsCount.textContent = profile._count?.posts || 0;
  const postsLabel = document.createElement("div");
  postsLabel.className = "text-sm text-gray-500";
  postsLabel.textContent = "Posts";
  postsDiv.appendChild(postsCount);
  postsDiv.appendChild(postsLabel);
  
 
  const followersDiv = document.createElement("div");
  followersDiv.className = "text-center";
  const followersCount = document.createElement("div");
  followersCount.className = "font-bold text-gray-900";
  followersCount.textContent = profile._count?.followers || 0;
  const followersLabel = document.createElement("div");
  followersLabel.className = "text-sm text-gray-500";
  followersLabel.textContent = "Followers";
  followersDiv.appendChild(followersCount);
  followersDiv.appendChild(followersLabel);
  

  const followingDiv = document.createElement("div");
  followingDiv.className = "text-center";
  const followingCount = document.createElement("div");
  followingCount.className = "font-bold text-gray-900";
  followingCount.textContent = profile._count?.following || 0;
  const followingLabel = document.createElement("div");
  followingLabel.className = "text-sm text-gray-500";
  followingLabel.textContent = "Following";
  followingDiv.appendChild(followingCount);
  followingDiv.appendChild(followingLabel);
  
  statsDiv.appendChild(postsDiv);
  statsDiv.appendChild(followersDiv);
  statsDiv.appendChild(followingDiv);
  
 
  profileSection.appendChild(profileWrapper);
  profileSection.appendChild(infoWrapper);
  profileSection.appendChild(statsDiv);
  
  
  container.appendChild(profileSection);
}

/**
 * Fetch and display user's posts
 * @param {string} username - Username to fetch posts for
 * @param {HTMLElement} container - Container element
 */
async function loadUserPosts(username, container) {
  try {
 
    container.innerHTML = `
      <div class="text-center p-4">
        <p>Loading posts...</p>
      </div>
    `;
    

    const posts = await fetchUserPosts(username);
    console.log(`Fetched ${posts.length} posts for ${username}`);
    
   
    container.innerHTML = '';
    
  
    if (posts && posts.length > 0) {
     
      const tabsNav = document.querySelector('.post-tabs');
      if (!tabsNav) {
        const tabsSection = document.createElement('section');
        tabsSection.className = 'bg-white mt-6 rounded-lg shadow-sm';
        tabsSection.innerHTML = `
          <nav class="flex border-b post-tabs">
            <button class="flex-1 py-4 px-6 text-purple-700 border-b-2 border-purple-800 font-medium">Posts</button>
            <button class="flex-1 py-4 px-6 text-gray-500 hover:text-gray-700 font-medium">Photos</button>
            <button class="flex-1 py-4 px-6 text-gray-500 hover:text-gray-700 font-medium">Liked</button>
          </nav>
        `;
        container.parentNode.insertBefore(tabsSection, container);
      }
      
     
      generateUserPosts(posts, container);
    } else {
      container.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-sm text-center">
          <p class="text-gray-500">No posts yet</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    container.innerHTML = `
      <div class="bg-red-100 text-red-700 p-4 rounded-lg">
        <p>Error loading posts: ${error.message}</p>
      </div>
    `;
  }
}

/**
 * Fetch posts for a specific user
 * @param {string} username - Username to fetch posts for
 * @returns {Promise<Array>} Array of posts
 */
async function fetchUserPosts(username) {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || `Failed to fetch posts for ${username}`);
  }
  
  const json = await response.json();
  return json.data;
}

/**
 * Generate HTML for user posts and add to container
 * @param {Array} posts - Array of post objects
 * @param {HTMLElement} container - Container element
 */
function generateUserPosts(posts, container) {
  posts.forEach(post => {
  
    const postElement = document.createElement("article");
    postElement.className = "bg-white p-6 rounded-lg shadow-sm mb-4";
    
 
    const headerDiv = document.createElement("div");
    headerDiv.className = "flex items-center gap-3 mb-4";
    
   
    const avatar = document.createElement("img");
    if (post.author?.avatar?.url) {
      avatar.src = post.author.avatar.url;
    } else {
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "User")}&background=random`;
    }
    avatar.alt = post.author?.name || "User";
    avatar.className = "w-10 h-10 rounded-full";
    
   
    const authorInfo = document.createElement("div");
    
    const authorName = document.createElement("h3");
    authorName.className = "font-semibold";
    authorName.textContent = post.author?.name || "User";
    
    const timestamp = document.createElement("time");
    timestamp.className = "text-sm text-gray-500";
    timestamp.dateTime = post.created;
    timestamp.textContent = formatDate(post.created);
    
    authorInfo.appendChild(authorName);
    authorInfo.appendChild(timestamp);
    
    headerDiv.appendChild(avatar);
    headerDiv.appendChild(authorInfo);
    
   
    let titleElement = null;
    if (post.title && post.title !== "New Post") {
      titleElement = document.createElement("h2");
      titleElement.className = "text-xl font-bold mb-2";
      titleElement.textContent = post.title;
    }
    
    const body = document.createElement("p");
    body.className = "mb-4";
    body.textContent = post.body;
    
    let mediaElement = null;
    if (post.media?.url) {
      mediaElement = document.createElement("img");
      mediaElement.src = post.media.url;
      mediaElement.alt = post.media.alt || "Post image";
      mediaElement.className = "w-full rounded-lg mb-4";
      mediaElement.onerror = function() {
        this.onerror = null;
        this.src = 'https://placehold.co/600x400?text=Image+Not+Available';
      };
    }
    
    
    const interactionsDiv = document.createElement("div");
    interactionsDiv.className = "flex items-center gap-6 text-gray-500";
    
 
    const likeDiv = document.createElement("div");
    likeDiv.className = "flex items-center space-x-1";
    
    const likeButton = document.createElement("button");
    likeButton.className = "group";
    likeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    `;
    
    const likeCount = document.createElement("span");
    likeCount.className = "text-gray-500";
    likeCount.textContent = post._count?.reactions || 0;
    
    likeDiv.appendChild(likeButton);
    likeDiv.appendChild(likeCount);
    
   
    const commentDiv = document.createElement("div");
    commentDiv.className = "flex items-center space-x-1";
    
    const commentButton = document.createElement("button");
    commentButton.className = "group";
    commentButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
      </svg>
    `;
    
    const commentCount = document.createElement("span");
    commentCount.className = "text-gray-500";
    commentCount.textContent = post._count?.comments || 0;
    
    commentDiv.appendChild(commentButton);
    commentDiv.appendChild(commentCount);
    

    const shareDiv = document.createElement("div");
    shareDiv.className = "flex items-center space-x-1";
    
    const shareButton = document.createElement("button");
    shareButton.className = "group";
    shareButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    `;
    
    const shareCount = document.createElement("span");
    shareCount.className = "text-gray-500";
    shareCount.textContent = "0";
    
    shareDiv.appendChild(shareButton);
    shareDiv.appendChild(shareCount);
    
   
    interactionsDiv.appendChild(likeDiv);
    interactionsDiv.appendChild(commentDiv);
    interactionsDiv.appendChild(shareDiv);
    
  
    postElement.appendChild(headerDiv);
    if (titleElement) postElement.appendChild(titleElement);
    postElement.appendChild(body);
    if (mediaElement) postElement.appendChild(mediaElement);
    postElement.appendChild(interactionsDiv);
    
   
    container.appendChild(postElement);
  });
}

/**
 * Format date as relative time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return "Just now";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return "Just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}