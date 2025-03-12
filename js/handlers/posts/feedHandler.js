import { fetchPosts } from "../../api/posts/fetchPosts.js";
import { createPost } from "../../api/posts/createPost.js";
import { deletePost } from "../../api/posts/deletePost.js";
import { displayMessage } from "../../ui/common/displayMessage.js";
import { isLoggedIn, getUsername } from "../../helpers/storage.js";
import { postBelongsToUser } from "../../helpers/auth.js";
import filterPostHandler from "./filterPostHandler.js";

/**
 * Initializes the feed page by setting up the user interface, post form, and loading posts
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the feed handler when the page loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   feedHandler();
 * });
 * ```
 */
export function feedHandler() {
  if (!isLoggedIn()) {
    location.href = "/";
    return;
  }

  setupUserInterface();
  setupPostForm();
  loadPosts();
  setupMobileMenu();
  preventHorizontalScroll();
}

/**
 * Prevents horizontal scrolling by adding styles to the document
 * @returns {void} Does not return a value
 */
function preventHorizontalScroll() {
  // Add a style to prevent horizontal scrolling
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    html, body {
      max-width: 100%;
      overflow-x: hidden;
    }
  `;
  document.head.appendChild(styleElement);
}

/**
 * Sets up the mobile menu functionality with toggle behavior
 * @returns {void} Does not return a value
 */
function setupMobileMenu() {
  // Run after a small delay to ensure DOM is ready
  setTimeout(() => {
    // Find the mobile menu button by ID
    const mobileMenuButton = document.getElementById("mobile-menu-button");

    // Find the mobile menu by ID
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      // Add click handler specifically for the mobile menu button
      mobileMenuButton.addEventListener("click", function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle("hidden");
      });

      // Also set the onclick attribute as a fallback
      mobileMenuButton.setAttribute(
        "onclick",
        "document.getElementById('mobile-menu').classList.toggle('hidden');"
      );
    }

    // Ensure desktop menu is properly visible on larger screens
    const desktopMenu = document.querySelector(".hidden.sm\\:flex");
    if (desktopMenu) {
      // Add style to ensure desktop menu visibility on larger screens
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        @media (min-width: 640px) {
          .hidden.sm\\:flex {
            display: flex !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, 300);
}

/**
 * Sets up the user interface by updating username elements and creating the custom dropdown
 * @returns {void} Does not return a value
 */
function setupUserInterface() {
  const username = getUsername();

  const userNameElements = document.querySelectorAll(".user-name");
  if (username && userNameElements.length) {
    userNameElements.forEach((element) => {
      element.textContent = username;
    });
  }

  const logoutButtons = document.querySelectorAll("button[href='/']");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", handleLogout);
  });

  // Remove any existing custom dropdowns first
  const existingDropdowns = document.querySelectorAll(
    ".custom-dropdown, .custom-select-wrapper"
  );
  existingDropdowns.forEach((dropdown) => dropdown.remove());

  // Now add our single custom dropdown
  createCustomDropdown();
}

/**
 * Creates a custom dropdown menu for post sorting
 * @returns {void} Does not return a value
 */
function createCustomDropdown() {
  // Find the select element
  const selectElement = document.getElementById("sort-posts");
  if (!selectElement) return;

  // Create container
  const customDropdown = document.createElement("div");
  customDropdown.id = "custom-sort-dropdown"; // Give it a unique ID
  customDropdown.className =
    "custom-dropdown w-full sm:w-auto mt-2 sm:mt-0 relative";

  // Create selected option display
  const selectedOption = document.createElement("div");
  selectedOption.className =
    "selected-option px-4 py-2 bg-white border rounded-lg cursor-pointer flex items-center justify-between h-11 text-sm";
  selectedOption.innerHTML = `
    <span>${selectElement.options[selectElement.selectedIndex].text}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>
  `;

  // Create options container
  const optionsContainer = document.createElement("div");
  optionsContainer.className =
    "options-container absolute left-0 w-full mt-1 bg-white border rounded-lg shadow-lg hidden z-10";

  // Add options
  Array.from(selectElement.options).forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className =
      "option px-4 py-4 hover:bg-gray-100 cursor-pointer";
    optionElement.textContent = option.text;
    optionElement.dataset.value = option.value;

    optionElement.addEventListener("click", () => {
      selectedOption.querySelector("span").textContent =
        optionElement.textContent;
      optionsContainer.classList.add("hidden");

      // Sort the posts
      sortPosts(option.value);

      // Update original select for consistency
      selectElement.value = option.value;
    });

    optionsContainer.appendChild(optionElement);
  });

  // Toggle dropdown on click
  selectedOption.addEventListener("click", (e) => {
    e.stopPropagation();
    optionsContainer.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!customDropdown.contains(event.target)) {
      optionsContainer.classList.add("hidden");
    }
  });

  // Add to DOM
  customDropdown.appendChild(selectedOption);
  customDropdown.appendChild(optionsContainer);

  // Replace original select
  selectElement.parentNode.insertBefore(customDropdown, selectElement);
  selectElement.style.display = "none";

  // Add custom styles with a unique ID for the styles
  const styleElement = document.createElement("style");
  styleElement.id = "custom-dropdown-styles";

  // First remove any existing style elements with this ID
  const existingStyle = document.getElementById("custom-dropdown-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  styleElement.textContent = `
  .custom-dropdown {
    height: 3rem; /* 44px, equivalent to h-5 */
  }


    .custom-dropdown .selected-option {
    color: #4B5563;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    height: 2.75rem; /* 44px */
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    line-height: 1.25rem;
  }
    
  .custom-dropdown .options-container {
    width: 100%;
    box-sizing: border-box;
    top: 2.75rem; 
    margin-top: 0.25rem;
  }
  
  @media (max-width: 640px) {
    .custom-dropdown .selected-option {
      font-size: 1.125rem; 
      height: 2.75rem;
      padding: 0 1rem;
    }
  }
`;
  document.head.appendChild(styleElement);
}

/**
 * Sorts posts based on the selected sort type
 * @param {string} sortType - The type of sort to apply (e.g., "newest" or "oldest")
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Sort posts by newest first
 * sortPosts("newest");
 * ```
 */
function sortPosts(sortType) {
  // Get all posts
  const posts = document.querySelectorAll(
    "#display-container a[data-timestamp]"
  );
  const postsArray = Array.from(posts);

  // Sort posts based on selection
  if (sortType === "newest") {
    postsArray.sort((a, b) => {
      return new Date(b.dataset.timestamp) - new Date(a.dataset.timestamp);
    });
  } else {
    postsArray.sort((a, b) => {
      return new Date(a.dataset.timestamp) - new Date(b.dataset.timestamp);
    });
  }

  // Get the container
  const container = document.querySelector("#display-container .max-w-2xl");

  // Re-append posts in sorted order
  if (container) {
    postsArray.forEach((post) => {
      container.appendChild(post);
    });
  }
}

/**
 * Adds a title field to the post form
 * @returns {void} Does not return a value
 */
function addTitleFieldToPostForm() {
  const postForm = document.getElementById("postForm");
  if (!postForm) return;

  const textarea = postForm.querySelector("textarea");
  if (!textarea) return;

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.placeholder = "Add a title to your post";
  titleInput.className =
    "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 mb-3";
  titleInput.maxLength = 100;

  textarea.parentNode.insertBefore(titleInput, textarea);
}

/**
 * Sets up the post form submission handler
 * @returns {void} Does not return a value
 */
function setupPostForm() {
  const postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", handlePostSubmit);
  }
}

/**
 * Handles the post form submission
 * @param {Event} event - The form submission event
 * @returns {Promise<void>} Promise that resolves when post submission is complete
 * @example
 * ```js
 * // This function is typically attached to a form's submit event
 * const form = document.getElementById("postForm");
 * form.addEventListener("submit", handlePostSubmit);
 * ```
 */
async function handlePostSubmit(event) {
  event.preventDefault();

  try {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const { title, body, mediaUrl, mediaAlt } = data;

    const postData = {
      title: title,
      body: body,
    };

    if (mediaUrl && mediaUrl.trim() !== "") {
      postData.media = {
        url: mediaUrl,
        alt: mediaAlt || "",
      };
    }

    disableForm(form);
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Posting...
      `;
    }

    // Override window.alert before creating the post
    const originalAlert = window.alert;
    window.alert = function () {
      /* Do nothing */
    };

    try {
      const newPost = await createPost(postData);

      // Display your custom notification
      displaySuccess("Your post has been published!");

      form.reset();
      await loadPosts();
    } catch (innerError) {
      console.error("Error creating post:", innerError);
      displayError(
        `Failed to publish post: ${innerError.message || "Unknown error"}`
      );
    } finally {
      // Restore the original alert function
      window.alert = originalAlert;
    }
  } catch (error) {
    console.error("Post submission error:", error);
    displayError(`Failed to publish post: ${error.message || "Unknown error"}`);
  } finally {
    enableForm(event.target);
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerHTML = "Post";
    }
  }
}

/**
 * Display an error message as a notification
 * @param {string} message - Error message to display
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Display an error notification
 * displayError("Failed to load posts: Network error");
 * ```
 */
function displayError(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className =
    "fixed top-5 right-5 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg z-50 max-w-md";
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.remove();
  }, 5000);
}

/**
 * Display a success message as a notification
 * @param {string} message - Success message to display
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Display a success notification
 * displaySuccess("Post created successfully!");
 * ```
 */
function displaySuccess(message) {
  const messageContainer = document.createElement("div");
  messageContainer.className =
    "fixed top-5 right-5 bg-green-100 text-green-700 p-4 rounded-lg shadow-lg z-50 max-w-md";
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.remove();
  }, 5000);
}

/**
 * Disable all form inputs and buttons
 * @param {HTMLFormElement} form - Form to disable
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Disable all elements in a form during submission
 * const form = document.getElementById("myForm");
 * disableForm(form);
 * ```
 */
function disableForm(form) {
  form
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = true));
}

/**
 * Enable all form inputs and buttons
 * @param {HTMLFormElement} form - Form to enable
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Re-enable all elements in a form after submission
 * const form = document.getElementById("myForm");
 * enableForm(form);
 * ```
 */
function enableForm(form) {
  form
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = false));
}

/**
 * Handles the logout action by clearing local storage and redirecting
 * @returns {void} Does not return a value
 */
function handleLogout() {
  localStorage.clear();
  location.href = "/";
}

/**
 * Loads posts from API and displays them
 * @returns {Promise<void>} Promise that resolves when posts are loaded and displayed
 * @example
 * ```js
 * // Load and display posts
 * await loadPosts();
 * ```
 */
async function loadPosts() {
  const displayContainer = document.getElementById("display-container");

  if (!displayContainer) {
    console.error("Display container not found");
    return;
  }

  try {
    displayContainer.innerHTML = `
      <div class="max-w-2xl mx-auto p-4">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Loading posts...</p>
        </div>
      </div>
    `;

    const posts = await fetchPosts();

    displayContainer.innerHTML = "";

    if (posts && posts.length > 0) {
      generatePosts(posts, displayContainer);

      // Add try-catch around filterPostHandler to prevent it from breaking the page
      try {
        filterPostHandler(posts, displayContainer);
      } catch (filterError) {
        console.error("Filter post handler error:", filterError);
        // Continue even if filter handler fails
      }
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
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Display posts in a container
 * const posts = await fetchPosts();
 * const container = document.getElementById("postsContainer");
 * generatePosts(posts, container);
 * ```
 */
export function generatePosts(posts, container) {
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
      editLink.onclick = function (event) {
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

        document
          .getElementById("cancel-delete")
          .addEventListener("click", () => {
            confirmationOverlay.remove();
          });

        document
          .getElementById("confirm-delete")
          .addEventListener("click", async () => {
            try {
              // Override window.alert before deleting the post
              const originalAlert = window.alert;
              window.alert = function () {
                /* Do nothing */
              };

              await deletePost(post.id);
              confirmationOverlay.remove();

              // Show success message
              displaySuccess("Post deleted successfully!");

              // Restore the original alert function
              window.alert = originalAlert;

              // Reload posts
              loadPosts();
            } catch (error) {
              console.error("Error deleting post:", error);
              displayError(
                `Failed to delete post: ${error.message || "Unknown error"}`
              );
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

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not valid
 * @example
 * ```js
 * // Extract video ID from YouTube URL
 * const videoId = extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
 * // Returns: "dQw4w9WgXcQ"
 * ```
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
 * @example
 * ```js
 * // Extract video ID from Vimeo URL
 * const videoId = extractVimeoId("https://vimeo.com/123456789");
 * // Returns: "123456789"
 * ```
 */
function extractVimeoId(url) {
  const regExp =
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[3] : null;
}

/**
 * Format a date string into a relative time (e.g., "3 minutes ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 * @example
 * ```js
 * // Format a date as relative time
 * const relativeTime = formatDate("2023-04-15T14:30:00Z");
 * // Might return: "2 days ago" (depending on current date)
 * ```
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
