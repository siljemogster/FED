import { fetchPost } from "../../api/posts/fetchPost.js";
import { deletePost } from "../../api/posts/deletePost.js";
import { getQueryParam } from "../../helpers/getQueryParam.js";
import { postBelongsToUser } from "../../helpers/auth.js";

export default async function singlePostHandler() {
  // Fix the footer to the bottom of the page
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.position = "fixed";
    footer.style.bottom = "0";
    footer.style.width = "100%";
  }

  // Get main element and add more top padding
  const mainElement = document.querySelector("main");
  mainElement.style.paddingTop = "80px"; // More space at the top
  mainElement.style.paddingBottom = "100px"; // Space for the fixed footer
  mainElement.innerHTML = "";
  
  // Create a container for the post with post-like styling
  const postContainer = document.createElement("div");
  postContainer.className = "max-w-2xl mx-auto p-4 space-y-6 mt-16"; // Added mt-16 for more top margin
  mainElement.appendChild(postContainer);
  
  // Create status container for messages
  const statusContainer = document.createElement("div");
  statusContainer.className = "hidden"; // Hide initially
  statusContainer.style.marginBottom = "24px";
  postContainer.appendChild(statusContainer);
  
  // Create the post card
  const postCard = document.createElement("div");
  postCard.className = "bg-white p-6 rounded-lg shadow-sm";
  postContainer.appendChild(postCard);
  
  // Add loading indicator
  postCard.innerHTML = `
    <div class="flex items-center justify-center py-12">
      <div class="spinner">Loading post...</div>
    </div>
  `;
  
  // Get the id from the querystring
  const id = getQueryParam("id");
  
  if (!id) {
    showError(postCard, "No post ID provided. Please go back and select a post to view.");
    addBackButton(postContainer);
    return;
  }
  
  // Fetch and display the post
  try {
    const post = await fetchPost(id);
    console.log("Post loaded:", post);
    
    renderPost(postCard, post);
    
    // Add back button below post
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-center mt-6";
    
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Feed";
    backButton.className = "px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600";
    backButton.addEventListener("click", () => {
      window.location.href = "/feed";
    });
    
    buttonContainer.appendChild(backButton);
    postContainer.appendChild(buttonContainer);
    
  } catch (error) {
    console.error("Error loading post:", error);
    showError(postCard, `Failed to load post: ${error.message || "Unknown error"}`);
    addBackButton(postContainer);
  }
}

function renderPost(container, post) {
  const { title, body, media, author, created, id } = post;
  
  // Clear container
  container.innerHTML = '';
  
  // Create header with author info
  const headerDiv = document.createElement("div");
  headerDiv.className = "flex items-center gap-3 mb-4";
  
  const authorName = author?.name || "Unknown User";
  const authorAvatar = author?.avatar?.url || null;
  
  const avatarHTML = authorAvatar 
    ? `<img src="${authorAvatar}" alt="${authorName}" class="w-10 h-10 rounded-full object-cover">`
    : `<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <span class="text-purple-700 font-semibold">${authorName.charAt(0).toUpperCase()}</span>
      </div>`;
  
  headerDiv.innerHTML = `
    <div class="flex-shrink-0">
      ${avatarHTML}
    </div>
    <div>
      <h3 class="font-semibold">${authorName}</h3>
      <div class="text-sm text-gray-500">${formatDate(created)}</div>
    </div>
  `;
  
  container.appendChild(headerDiv);
  
  // Add title if it exists
  if (title) {
    const titleElement = document.createElement("h2");
    titleElement.className = "text-xl font-bold mb-4";
    titleElement.textContent = title;
    container.appendChild(titleElement);
  }
  
  // Add body
  const bodyElement = document.createElement("p");
  bodyElement.className = "mb-6";
  bodyElement.textContent = body || "";
  container.appendChild(bodyElement);
  
  // Add media if it exists
  if (media && media.url) {
    const url = media.url.toLowerCase();
    const isVideo =
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".ogg") ||
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com");
      
    if (isVideo) {
      // Handle video content
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          const videoContainer = document.createElement("div");
          videoContainer.className = "mb-6 relative pt-[56.25%]"; // 16:9 aspect ratio
          
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.className = "absolute top-0 left-0 w-full h-full rounded-lg";
          iframe.allowFullscreen = true;
          
          videoContainer.appendChild(iframe);
          container.appendChild(videoContainer);
        }
      } else if (url.includes("vimeo.com")) {
        const videoId = extractVimeoId(url);
        if (videoId) {
          const videoContainer = document.createElement("div");
          videoContainer.className = "mb-6 relative pt-[56.25%]"; // 16:9 aspect ratio
          
          const iframe = document.createElement("iframe");
          iframe.src = `https://player.vimeo.com/video/${videoId}`;
          iframe.className = "absolute top-0 left-0 w-full h-full rounded-lg";
          iframe.allowFullscreen = true;
          
          videoContainer.appendChild(iframe);
          container.appendChild(videoContainer);
        }
      } else {
        // Direct video file
        const video = document.createElement("video");
        video.src = media.url;
        video.className = "w-full rounded-lg mb-6";
        video.controls = true;
        video.poster = media.poster || "";
        container.appendChild(video);
      }
    } else {
      // Handle image
      const image = document.createElement("img");
      image.src = media.url;
      image.alt = media.alt || title || "Post image";
      image.className = "w-full rounded-lg mb-6";
      image.onerror = function() {
        this.onerror = null;
        this.src = "https://placehold.co/600x400?text=Image+Not+Available";
      };
      container.appendChild(image);
    }
  }
  
  // Add interaction stats (likes, comments)
  const interactionDiv = document.createElement("div");
  interactionDiv.className = "flex items-center gap-6 text-gray-500 mb-6";
  
  const likeCount = post._count?.reactions || 0;
  const commentCount = post._count?.comments || 0;
  
  interactionDiv.innerHTML = `
    <div class="flex items-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-5 h-5 text-gray-500">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      <span class="text-gray-500">${likeCount} likes</span>
    </div>
    
    <div class="flex items-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-5 h-5 text-gray-500">
        <path stroke-linecap="round" stroke-linejoin="round" 
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
      </svg>
      <span class="text-gray-500">${commentCount} comments</span>
    </div>
  `;
  
  container.appendChild(interactionDiv);
  
  // Add edit and delete buttons if user owns the post
  const showAdmin = postBelongsToUser(author?.name);
  if (showAdmin) {
    const adminButtonsContainer = document.createElement("div");
    adminButtonsContainer.className = "flex flex-wrap gap-2 mt-8"; // Added mt-8 for more space above buttons
    
    // Edit button (yellow) - matches the one on feed
    const editLink = document.createElement("a");
    editLink.href = `/feed/edit.html?id=${id}`;
    editLink.textContent = "Edit";
    editLink.style.backgroundColor = "#fef08a"; // Yellow 200
    editLink.style.color = "#854d0e"; // Yellow 800
    editLink.style.padding = "4px 12px";
    editLink.style.borderRadius = "4px";
    editLink.style.fontSize = "12px";
    editLink.style.fontWeight = "500";
    editLink.style.cursor = "pointer";
    adminButtonsContainer.appendChild(editLink);
    
    // Delete button (light red) - matches the one on feed
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "#fecaca"; // Red 200
    deleteButton.style.color = "#991b1b"; // Red 800
    deleteButton.style.padding = "4px 12px";
    deleteButton.style.borderRadius = "4px";
    deleteButton.style.fontSize = "12px";
    deleteButton.style.fontWeight = "500";
    deleteButton.style.marginLeft = "8px";
    deleteButton.style.cursor = "pointer";
    deleteButton.onclick = async function(event) {
      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost(id);
          // Show success message
          const statusContainer = document.querySelector(".status-container");
          if (statusContainer) {
            statusContainer.className = "block p-4 rounded-lg bg-green-100 text-green-700 mb-4";
            statusContainer.textContent = "Post deleted successfully!";
            
            // Redirect to feed after a delay
            setTimeout(() => {
              window.location.href = "/feed";
            }, 1500);
          } else {
            window.location.href = "/feed";
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          alert(`Failed to delete post: ${error.message || "Unknown error"}`);
        }
      }
    };
    adminButtonsContainer.appendChild(deleteButton);
    
    container.appendChild(adminButtonsContainer);
  }
}

function showError(container, message) {
  container.innerHTML = `
    <div class="bg-red-100 text-red-700 p-4 rounded-lg">
      <p>${message}</p>
    </div>
  `;
}

function addBackButton(container) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-center mt-4";
  
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Feed";
  backButton.className = "px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600";
  backButton.addEventListener("click", () => {
    window.location.href = "/feed";
  });
  
  buttonContainer.appendChild(backButton);
  container.appendChild(buttonContainer);
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
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not valid
 */
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extract Vimeo video ID from URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Vimeo video ID or null if not valid
 */
function extractVimeoId(url) {
  const regExp =
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[3] : null;
}