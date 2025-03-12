import { postBelongsToUser } from "../../helpers/auth.js";
import { formatDate, extractYouTubeId, extractVimeoId } from "./postUtils.js";
import { deletePost } from "../../api/posts/deletePost.js";
import { displaySuccess, displayError } from "./postFormHandler.js";

/**
 * Generate HTML for posts and append to container
 * @param {Array} posts - Array of post objects
 * @param {HTMLElement} container - Container element to append posts to
 */
export function generatePosts(posts, container) {
  console.log("Generating posts:", posts);
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "max-w-2xl mx-auto p-4 space-y-6";

  posts.forEach((post) => {
    const postElement = document.createElement("a");
    postElement.className = "bg-white p-6 rounded-lg shadow-sm block";
    postElement.href = `/feed/post.html?id=${post.id}`;
    
    // Add timestamp data attribute for sorting
    postElement.dataset.timestamp = post.created;

    const headerDiv = document.createElement("div");
    headerDiv.className = "flex items-center gap-3 mb-4";

    const authorName = post.author?.name || "Unknown User";
    const authorAvatar = post.author?.avatar?.url || null;

    const avatar = document.createElement("img");
    if (authorAvatar) {
      avatar.src = authorAvatar;
    } else {
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
    }
    avatar.alt = authorName;
    avatar.className = "w-10 h-10 rounded-full object-cover";
    avatar.onerror = function () {
      this.onerror = null;
      this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
    };

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

    if (post.title) {
      const title = document.createElement("h2");
      title.className = "text-xl font-bold mb-2";
      title.textContent = post.title;
      postElement.appendChild(headerDiv);
      postElement.appendChild(title);
    } else {
      postElement.appendChild(headerDiv);
    }

    const body = document.createElement("p");
    body.className = "mb-4";
    body.textContent = post.body || "";
    postElement.appendChild(body);

    if (post.media) {
      if (post.media.url) {
        const url = post.media.url.toLowerCase();
        const isVideo =
          url.endsWith(".mp4") ||
          url.endsWith(".webm") ||
          url.endsWith(".ogg") ||
          url.includes("youtube.com") ||
          url.includes("youtu.be") ||
          url.includes("vimeo.com");

        if (isVideo) {
          const videoContainer = document.createElement("div");
          videoContainer.className = "mb-4 relative pt-[56.25%]"; // 16:9 aspect ratio padding

          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = extractYouTubeId(url);
            if (videoId) {
              const iframe = document.createElement("iframe");
              iframe.src = `https://www.youtube.com/embed/${videoId}`;
              iframe.className =
                "absolute top-0 left-0 w-full h-full rounded-lg";
              iframe.allowFullscreen = true;
              videoContainer.appendChild(iframe);
              postElement.appendChild(videoContainer);
            }
          } else if (url.includes("vimeo.com")) {
            const videoId = extractVimeoId(url);
            if (videoId) {
              const iframe = document.createElement("iframe");
              iframe.src = `https://player.vimeo.com/video/${videoId}`;
              iframe.className =
                "absolute top-0 left-0 w-full h-full rounded-lg";
              iframe.allowFullscreen = true;
              videoContainer.appendChild(iframe);
              postElement.appendChild(videoContainer);
            }
          } else {
            const video = document.createElement("video");
            video.src = post.media.url;
            video.className = "w-full rounded-lg mb-4";
            video.controls = true;
            video.poster = post.media.poster || "";
            postElement.appendChild(video);
          }
        } else {
          const image = document.createElement("img");
          image.src = post.media.url;
          image.alt = post.media.alt || post.title || "Post image";
          image.className = "w-full rounded-lg mb-4";
          image.onerror = function () {
            this.onerror = null;
            this.src = "https://placehold.co/600x400?text=Image+Not+Available";
          };
          postElement.appendChild(image);
        }
      }
    }

    const interactionDiv = document.createElement("div");
    interactionDiv.className = "flex items-center gap-6 text-gray-500";

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

    interactionDiv.appendChild(likeDiv);
    interactionDiv.appendChild(commentDiv);
    interactionDiv.appendChild(shareDiv);

    postElement.appendChild(interactionDiv);

    // Admin buttons section - only show for posts that belong to the current user
    // Use the existing postBelongsToUser function to check ownership
    const showAdmin = postBelongsToUser(post.author?.name);
    console.log("Post author:", post.author?.name, "Show admin controls:", showAdmin);
    
    if (showAdmin) {
      // Create a container for admin actions with better spacing
      // Add extra margin top (mt-8 instead of mt-4) to position buttons lower
      const adminButtonsContainer = document.createElement("div");
      adminButtonsContainer.className = "flex flex-wrap gap-2 mt-8";
      
      // Create Edit button with inline styling
      const editLink = document.createElement("a");
      editLink.href = `/feed/edit.html?id=${post.id}`;
      editLink.textContent = "Edit";
      editLink.style.backgroundColor = "#fef08a"; // Yellow 200
      editLink.style.color = "#854d0e"; // Yellow 800
      editLink.style.padding = "4px 12px";
      editLink.style.borderRadius = "4px";
      editLink.style.fontSize = "12px";
      editLink.style.fontWeight = "500";
      editLink.style.cursor = "pointer";
      editLink.style.textAlign = "center"; // Center align the text
      editLink.style.display = "inline-block"; // This ensures the text-align works properly
      editLink.onclick = function(event) {
        event.stopPropagation(); // Prevent the post link from being followed
      };
      adminButtonsContainer.appendChild(editLink);

      // Create Delete button with inline styling
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.backgroundColor = "#fecaca"; // Red 200
      deleteButton.style.color = "#991b1b"; // Red 800
      deleteButton.style.padding = "4px 12px";
      deleteButton.style.borderRadius = "4px";
      deleteButton.style.fontSize = "12px";
      deleteButton.style.fontWeight = "500";
      deleteButton.style.cursor = "pointer";
      deleteButton.onclick = async function (event) {
        event.preventDefault();
        event.stopPropagation(); // Prevent the post link from being followed
        console.log("Delete button clicked for post ID:", post.id);
        
        // Create custom confirmation instead of using browser confirm
        const confirmationOverlay = document.createElement("div");
        confirmationOverlay.style.position = "fixed";
        confirmationOverlay.style.top = "0";
        confirmationOverlay.style.left = "0";
        confirmationOverlay.style.width = "100%";
        confirmationOverlay.style.height = "100%";
        confirmationOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        confirmationOverlay.style.display = "flex";
        confirmationOverlay.style.justifyContent = "center";
        confirmationOverlay.style.alignItems = "center";
        confirmationOverlay.style.zIndex = "1000";
        
        const confirmationBox = document.createElement("div");
        confirmationBox.style.backgroundColor = "#fff";
        confirmationBox.style.padding = "24px";
        confirmationBox.style.borderRadius = "8px";
        confirmationBox.style.maxWidth = "400px";
        confirmationBox.style.width = "90%";
        confirmationBox.style.textAlign = "center";
        confirmationBox.style.margin = "0 10px";
        confirmationBox.style.boxSizing = "border-box";
        confirmationBox.innerHTML = `
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Delete Post</h3>
          <p style="margin-bottom: 20px;">Are you sure you want to delete this post?</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <button id="cancel-delete" style="padding: 8px 16px; background-color: #e5e7eb; color: #374151; border-radius: 4px; font-weight: 500;">Cancel</button>
            <button id="confirm-delete" style="padding: 8px 16px; background-color: #ef4444; color: white; border-radius: 4px; font-weight: 500;">Delete</button>
          </div>
        `;
        
        confirmationOverlay.appendChild(confirmationBox);
        document.body.appendChild(confirmationOverlay);
        
        document.getElementById("cancel-delete").addEventListener("click", () => {
          confirmationOverlay.remove();
        });
        
        document.getElementById("confirm-delete").addEventListener("click", async () => {
          try {
            // Override window.alert before deleting the post
            const originalAlert = window.alert;
            window.alert = function() { /* Do nothing */ };
            
            await deletePost(post.id);
            confirmationOverlay.remove();
            
            // Show success message
            displaySuccess("Post deleted successfully!");
            
            // Restore the original alert function
            window.alert = originalAlert;
            
            // Reload posts
            import('./feedHandler.js').then(module => {
              module.loadPosts();
            });
          } catch (error) {
            console.error("Error deleting post:", error);
            displayError(`Failed to delete post: ${error.message || "Unknown error"}`);
            confirmationOverlay.remove();
          }
        });
      };
      adminButtonsContainer.appendChild(deleteButton);
      
      postElement.appendChild(adminButtonsContainer);
    }

    wrapper.appendChild(postElement);
  });

  container.appendChild(wrapper);
}