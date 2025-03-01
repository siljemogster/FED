import { fetchPosts } from "../../api/posts/fetchPosts.js";
import { createPost } from "../../api/posts/createPost.js";
import { displayMessage } from "../../ui/common/displayMessage.js";
import { isLoggedIn, getUsername } from "../../helpers/storage.js";

/**
 * Initialize feed page handlers
 */
export function feedHandler() {
  console.log("Feed handler initialized");
  
  // Check if user is logged in
  if (!isLoggedIn()) {
    // Redirect to login page if not logged in
    console.log("User not logged in, redirecting to login page");
    location.href = "/";
    return;
  }

  // Set up the UI based on user data
  setupUserInterface();
  
  // Set up the post form handler if it exists
  setupPostForm();
  
  // Load and display posts
  loadPosts();
}

/**
 * Setup the user interface with user-specific data
 */
function setupUserInterface() {
  const username = getUsername();
  console.log("Current user:", username);
  
  // Set up user name in the UI if needed
  const userNameElements = document.querySelectorAll(".user-name");
  if (username && userNameElements.length) {
    userNameElements.forEach(element => {
      element.textContent = username;
    });
  }
  
  // Set up the logout button functionality
  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach(button => {
    button.addEventListener("click", handleLogout);
  });
  
  // Add title field to the post form
  addTitleFieldToPostForm();
}

/**
 * Add a title field to the post creation form
 */
function addTitleFieldToPostForm() {
  const postForm = document.getElementById("postForm");
  if (!postForm) return;
  
  const textarea = postForm.querySelector("textarea");
  if (!textarea) return;
  
  // Create title input field
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.placeholder = "Add a title to your post";
  titleInput.className = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 mb-3";
  titleInput.maxLength = 100;
  
  // Insert the title input before the textarea
  textarea.parentNode.insertBefore(titleInput, textarea);
}

/**
 * Set up the post form submission
 */
function setupPostForm() {
  const postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", handlePostSubmit);
  }
}

/**
 * Handle post form submission
 */
async function handlePostSubmit(event) {
  event.preventDefault();
  
  try {
    // Get form elements
    const form = event.target;
    const titleInput = form.querySelector('input[name="title"]');
    const bodyTextarea = form.querySelector('textarea');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate input
    if (!bodyTextarea || !bodyTextarea.value.trim()) {
      displayError("Please enter some content for your post");
      return;
    }
    
    // Prepare post data
    const postData = {
      title: titleInput && titleInput.value.trim() ? titleInput.value.trim() : "New Post",
      body: bodyTextarea.value.trim()
    };
    
    // Show loading state
    const originalButtonText = submitButton.innerHTML;
    disableForm(form);
    submitButton.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Posting...
    `;
    
    // Call API to create post
    const newPost = await createPost(postData);
    console.log("Post created successfully:", newPost);
    
    // Show success message
    displaySuccess("Your post has been published!");
    
    // Reset form
    form.reset();
    
    // Reload posts to show the new post
    loadPosts();
  } catch (error) {
    displayError(`Failed to publish post: ${error.message}`);
  } finally {
    // Re-enable form
    enableForm(event.target);
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerHTML = "Post";
    }
  }
}

/**
 * Display an error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "fixed top-5 right-5 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg z-50 max-w-md";
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);
  
  // Remove after 5 seconds
  setTimeout(() => {
    messageContainer.remove();
  }, 5000);
}

/**
 * Display a success message
 * @param {string} message - Success message to display
 */
function displaySuccess(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className = "fixed top-5 right-5 bg-green-100 text-green-700 p-4 rounded-lg shadow-lg z-50 max-w-md";
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);
  
  // Remove after 5 seconds
  setTimeout(() => {
    messageContainer.remove();
  }, 5000);
}

/**
 * Disable all form inputs and buttons
 * @param {HTMLFormElement} form - Form to disable
 */
function disableForm(form) {
  form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
}

/**
 * Enable all form inputs and buttons
 * @param {HTMLFormElement} form - Form to enable
 */
function enableForm(form) {
  form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = false);
}

/**
 * Handle user logout
 */
function handleLogout() {
  console.log("Logging out...");
  localStorage.clear(); // Clear all saved data
  location.href = "/"; // Redirect to login page
}

/**
 * Load and display posts
 */
async function loadPosts() {
  const displayContainer = document.getElementById("display-container");
  
  if (!displayContainer) {
    console.error("Display container not found");
    return;
  }
  
  try {
    // Show loading state
    displayContainer.innerHTML = `
      <div class="max-w-2xl mx-auto p-4">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Loading posts...</p>
        </div>
      </div>
    `;
    
    // Fetch posts from API
    console.log("Fetching posts...");
    const posts = await fetchPosts();
    console.log("Posts received:", posts);
    
    // Clear loading message
    displayContainer.innerHTML = '';
    
    // Display the posts
    if (posts && posts.length > 0) {
      generatePosts(posts, displayContainer);
    } else {
      displayContainer.innerHTML = `
        <div class="max-w-2xl mx-auto p-4">
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <p>No posts found. Be the first to post!</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    displayContainer.innerHTML = `
      <div class="max-w-2xl mx-auto p-4">
        <div class="bg-red-100 text-red-700 p-6 rounded-lg shadow-sm">
          <p>Error loading posts: ${error.message || "Unknown error"}</p>
          <button class="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg" onclick="location.reload()">
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Generate HTML for posts and append to container
 * @param {Array} posts - Array of post objects
 * @param {HTMLElement} container - Container element to append posts to
 */
function generatePosts(posts, container) {
  console.log("Generating posts:", posts.length);
  
  // Create wrapper to match your existing structure
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-2xl mx-auto p-4 space-y-6";
  
  posts.forEach(post => {
    // Create post article element
    const postElement = document.createElement("article");
    postElement.className = "bg-white p-6 rounded-lg shadow-sm";
    
    // Create post author/header section
    const headerDiv = document.createElement("div");
    headerDiv.className = "flex items-center gap-3 mb-4";
    
    // Get author information
    const authorName = post.author?.name || "Unknown User";
    const authorAvatar = post.author?.avatar?.url || null;
    
    // Author avatar - use author's avatar if available, or generate one
    const avatar = document.createElement("img");
    if (authorAvatar) {
      avatar.src = authorAvatar;
    } else {
      // Use UI Avatars for a placeholder with the author's initials
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
    }
    avatar.alt = authorName;
    avatar.className = "w-10 h-10 rounded-full object-cover";
    avatar.onerror = function() {
      this.onerror = null;
      this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
    };
    
    // Author info
    const authorInfo = document.createElement("div");
    
    const authorNameElement = document.createElement("h3");
    authorNameElement.className = "font-semibold";
    authorNameElement.textContent = authorName;
    
    const timestamp = document.createElement("time");
    timestamp.className = "text-sm text-gray-500";
    timestamp.dateTime = post.created || new Date().toISOString();
    timestamp.textContent = formatDate(post.created);
    
    authorInfo.appendChild(authorNameElement);
    authorInfo.appendChild(timestamp);
    
    headerDiv.appendChild(avatar);
    headerDiv.appendChild(authorInfo);
    
    // Post title if present
    if (post.title) {
      const title = document.createElement("h2");
      title.className = "text-xl font-bold mb-2";
      title.textContent = post.title;
      postElement.appendChild(headerDiv);
      postElement.appendChild(title);
    } else {
      postElement.appendChild(headerDiv);
    }
    
    // Post body
    const body = document.createElement("p");
    body.className = "mb-4";
    body.textContent = post.body || "";
    postElement.appendChild(body);
    
    // Post media if present
    if (post.media) {
      if (post.media.url) {
        // Determine media type from URL
        const url = post.media.url.toLowerCase();
        const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || 
                      url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
        
        if (isVideo) {
          // Create video element for video URLs
          const videoContainer = document.createElement("div");
          videoContainer.className = "mb-4 relative pt-[56.25%]"; // 16:9 aspect ratio padding
          
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            // YouTube embed
            const videoId = extractYouTubeId(url);
            if (videoId) {
              const iframe = document.createElement("iframe");
              iframe.src = `https://www.youtube.com/embed/${videoId}`;
              iframe.className = "absolute top-0 left-0 w-full h-full rounded-lg";
              iframe.allowFullscreen = true;
              videoContainer.appendChild(iframe);
              postElement.appendChild(videoContainer);
            }
          } else if (url.includes('vimeo.com')) {
            // Vimeo embed
            const videoId = extractVimeoId(url);
            if (videoId) {
              const iframe = document.createElement("iframe");
              iframe.src = `https://player.vimeo.com/video/${videoId}`;
              iframe.className = "absolute top-0 left-0 w-full h-full rounded-lg";
              iframe.allowFullscreen = true;
              videoContainer.appendChild(iframe);
              postElement.appendChild(videoContainer);
            }
          } else {
            // Native video
            const video = document.createElement("video");
            video.src = post.media.url;
            video.className = "w-full rounded-lg mb-4";
            video.controls = true;
            video.poster = post.media.poster || '';
            postElement.appendChild(video);
          }
        } else {
          // Create image element for image URLs
          const image = document.createElement("img");
          image.src = post.media.url;
          image.alt = post.media.alt || post.title || "Post image";
          image.className = "w-full rounded-lg mb-4";
          image.onerror = function() {
            this.onerror = null;
            this.src = 'https://placehold.co/600x400?text=Image+Not+Available';
          };
          postElement.appendChild(image);
        }
      }
    }
    
    // Create interaction div (likes, comments, shares)
    const interactionDiv = document.createElement("div");
    interactionDiv.className = "flex items-center gap-6 text-gray-500";
    
    // Like interaction
    const likeCount = post._count?.reactions || 0;
    const likeDiv = document.createElement("div");
    likeDiv.className = "flex items-center space-x-1";
    likeDiv.innerHTML = `
      <button class="group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
            class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
      <span class="text-gray-500">${likeCount}</span>
    `;
    
    // Comment interaction
    const commentCount = post._count?.comments || 0;
    const commentDiv = document.createElement("div");
    commentDiv.className = "flex items-center space-x-1";
    commentDiv.innerHTML = `
      <button class="group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
            class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
      </button>
      <span class="text-gray-500">${commentCount}</span>
    `;
    
    // Share interaction
    const shareDiv = document.createElement("div");
    shareDiv.className = "flex items-center space-x-1";
    shareDiv.innerHTML = `
      <button class="group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
            class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
      </button>
      <span class="text-gray-500">0</span>
    `;
    
    // Add interactions to the div
    interactionDiv.appendChild(likeDiv);
    interactionDiv.appendChild(commentDiv);
    interactionDiv.appendChild(shareDiv);
    
    // Add the interaction div to the post
    postElement.appendChild(interactionDiv);
    
    // Add the completed post to the wrapper
    wrapper.appendChild(postElement);
  });
  
  // Append wrapper to container
  container.appendChild(wrapper);
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not valid
 */
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Extract Vimeo video ID from URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Vimeo video ID or null if not valid
 */
function extractVimeoId(url) {
  const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[3] : null;
}

/**
 * Format a date string into a relative time (e.g., "3 minutes ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
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