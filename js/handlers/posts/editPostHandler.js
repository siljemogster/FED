import { fetchPost } from "../../api/posts/fetchPost.js";
import { updatePost } from "../../api/posts/updatePost.js";
import { getQueryParam } from "../../helpers/getQueryParam.js";
import { getUsername } from "../../helpers/storage.js";

/**
 * Initializes the edit post page, fetches the post data and sets up the edit form
 * @returns {Promise<void>} Promise that resolves when the edit form is set up
 * @example
 * ```js
 * // Initialize the edit post handler when the page loads
 * document.addEventListener('DOMContentLoaded', async () => {
 *   await editPostHandler();
 * });
 * ```
 */
export async function editPostHandler() {
  // Fix the footer to the bottom of the page
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.position = "fixed";
    footer.style.bottom = "0";
    footer.style.width = "100%";
  }

  // Get main element and add more top padding
  const mainElement = document.querySelector("main");
  mainElement.style.paddingTop = "80px"; // Increased top padding for more space below nav bar
  mainElement.style.paddingBottom = "100px"; // Space for the fixed footer
  mainElement.innerHTML = "";

  // Create a container for the edit form with post-like styling
  const editContainer = document.createElement("div");
  editContainer.className = "max-w-2xl mx-auto p-4 space-y-6 mt-16"; // Increased top margin for more space
  mainElement.appendChild(editContainer);

  // Create status and buttons container (to be displayed ABOVE the form card)
  const statusContainer = document.createElement("div");
  statusContainer.className = "hidden"; // Hide initially
  statusContainer.style.marginBottom = "24px"; // Added more space below status container
  editContainer.appendChild(statusContainer);

  // Create the form card
  const formCard = document.createElement("div");
  formCard.className = "bg-white p-6 rounded-lg shadow-sm";
  editContainer.appendChild(formCard);

  // Create header with post info - Fixed SVG path
  const header = document.createElement("div");
  header.className = "flex items-center gap-3 mb-6";
  header.innerHTML = `
    <div class="flex-shrink-0">
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
    <div>
      <h3 class="font-semibold">Loading...</h3>
      <div class="text-sm text-gray-500">Editing post...</div>
    </div>
  `;
  formCard.appendChild(header);

  // Create title and form content
  const title = document.createElement("h2");
  title.className = "text-xl font-semibold mb-4";
  title.textContent = "Edit Post";
  formCard.appendChild(title);

  // Get the id from the querystring
  const id = getQueryParam("id");

  if (!id) {
    showError("No post ID provided. Please go back and select a post to edit.");
    addBackButton(formCard);
    return;
  }

  // Create the form
  const form = document.createElement("form");
  form.id = "editPostForm";
  form.className = "space-y-4";
  form.innerHTML = `
    <input type="hidden" name="id" value="${id}" />
    <div class="flex items-center justify-center py-6">
      <div class="spinner">Loading...</div>
    </div>
  `;
  formCard.appendChild(form);

  // Get post by id
  try {
    const post = await fetchPost(id);

    updateHeader(header, post);
    populateForm(form, post);
    setupUpdateHandler(form, statusContainer, post);
  } catch (error) {
    console.error("Error loading post:", error);
    showError(`Failed to load post: ${error.message || "Unknown error"}`);
    addBackButton(formCard);
  }
}

/**
 * Updates the header element with post author information
 * @param {HTMLElement} headerElement - The header DOM element to update
 * @param {Object} post - The post object with author details
 * @param {Object} [post.author] - The author object
 * @param {string} [post.author.name] - The author's username
 * @param {Object} [post.author.avatar] - The author's avatar object
 * @param {string} [post.author.avatar.url] - The URL for the author's avatar
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Update header with post author information
 * const headerElement = document.querySelector('.post-header');
 * const post = {
 *   id: '123',
 *   author: {
 *     name: 'JohnDoe',
 *     avatar: { url: 'https://example.com/avatar.jpg' }
 *   }
 * };
 * updateHeader(headerElement, post);
 * ```
 */
function updateHeader(headerElement, post) {
  const username = post.author?.name || getUsername() || "Unknown User";
  const avatar = post.author?.avatar?.url || null;

  const avatarHTML = avatar
    ? `<img src="${avatar}" alt="${username}" class="w-10 h-10 rounded-full object-cover">`
    : `<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <span class="text-purple-700 font-semibold">${username.charAt(0).toUpperCase()}</span>
      </div>`;

  headerElement.innerHTML = `
    <div class="flex-shrink-0">
      ${avatarHTML}
    </div>
    <div>
      <h3 class="font-semibold">${username}</h3>
      <div class="text-sm text-gray-500">Editing post #${post.id}</div>
    </div>
  `;
}

/**
 * Populates the edit form with post data
 * @param {HTMLFormElement} form - The form element to populate
 * @param {Object} post - The post object containing post data
 * @param {string} post.id - The post ID
 * @param {string} [post.title] - The post title
 * @param {string} [post.body] - The post content
 * @param {Object} [post.media] - The post media object
 * @param {string} [post.media.url] - The URL for the post media
 * @param {string} [post.media.alt] - The alt text for the post media
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Populate form with post data
 * const form = document.getElementById('editPostForm');
 * const post = {
 *   id: '123',
 *   title: 'My Post',
 *   body: 'Post content',
 *   media: {
 *     url: 'https://example.com/image.jpg',
 *     alt: 'My image'
 *   }
 * };
 * populateForm(form, post);
 * ```
 */
function populateForm(form, post) {
  // Populate the form with the post data
  const { title, body, media, id } = post;

  // Safely get values with fallbacks to prevent undefined errors
  const postTitle = title || "";
  const postBody = body || "";
  const mediaUrl = media?.url || "";
  const mediaAlt = media?.alt || "";

  form.innerHTML = `
    <input type="hidden" name="id" value="${id}" />
    <input 
      name="title" 
      placeholder="Title" 
      required 
      value="${postTitle}" 
      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
    />
    <textarea
      name="body"
      placeholder="What's on your mind?"
      required
      minlength="1"
      maxlength="500"
      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 min-h-[100px]"
    >${postBody}</textarea>
    <input 
      name="mediaUrl" 
      placeholder="Media url" 
      value="${mediaUrl}"
      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 mb-2" 
    />
    <input 
      name="mediaAlt" 
      placeholder="Media description (Optional)" 
      value="${mediaAlt}"
      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700" 
    />
    <div class="flex mt-6">
      <button
        type="submit"
        class="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
      >
        Update
      </button>
    </div>
  `;
}

/**
 * Sets up the form submission handler for updating posts
 * @param {HTMLFormElement} form - The form element to handle
 * @param {HTMLElement} statusContainer - Container for displaying status messages
 * @param {Object} originalPost - The original post object before edits
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Set up the update handler for a post form
 * const form = document.getElementById('editPostForm');
 * const statusContainer = document.getElementById('statusMessages');
 * const post = { id: '123', title: 'Original Title', body: 'Original content' };
 * setupUpdateHandler(form, statusContainer, post);
 * ```
 */
function setupUpdateHandler(form, statusContainer, originalPost) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Show updating message above the form
    statusContainer.className = "block space-y-4 mb-8"; // Increased margin-bottom for more space
    statusContainer.innerHTML = `
      <div class="p-4 rounded-lg bg-blue-100 text-blue-700">
        Updating post...
      </div>
    `;

    // Disable form while submitting
    const formElements = form.querySelectorAll("input, textarea, button");
    formElements.forEach((el) => (el.disabled = true));

    try {
      // Get the form values directly from the elements to avoid undefined issues
      const id = form.querySelector('input[name="id"]').value;
      const title = form.querySelector('input[name="title"]').value || "";
      const body = form.querySelector('textarea[name="body"]').value || "";
      const mediaUrl = form.querySelector('input[name="mediaUrl"]').value || "";
      const mediaAlt = form.querySelector('input[name="mediaAlt"]').value || "";

      // Prepare post data
      const postData = {
        title: title,
        body: body,
      };

      // Only include media if URL is not empty
      if (mediaUrl && mediaUrl.trim() !== "") {
        postData.media = {
          url: mediaUrl,
          alt: mediaAlt,
        };
      }

      // Make the API call to update the post
      const response = await updatePost(id, postData);

      // Success state - show success message and buttons ABOVE the form
      statusContainer.innerHTML = `
        <div class="p-4 rounded-lg bg-green-100 text-green-700">
          Post updated successfully!
        </div>
        <div class="flex gap-4 mt-4">
          <button id="viewPost" class="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600">
            View Post
          </button>
          <button id="backToFeed" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
            Back to Feed
          </button>
        </div>
      `;

      // Add event listeners for the buttons
      const viewButton = statusContainer.querySelector("#viewPost");
      const backButton = statusContainer.querySelector("#backToFeed");

      viewButton.addEventListener("click", () => {
        window.location.href = `/feed/post.html?id=${id}`;
      });

      backButton.addEventListener("click", () => {
        window.location.href = "/feed";
      });

      // Re-enable form
      formElements.forEach((el) => (el.disabled = false));
    } catch (error) {
      console.error("Error updating post:", error);

      // Error state - show error message and buttons ABOVE the form
      statusContainer.innerHTML = `
        <div class="p-4 rounded-lg bg-red-100 text-red-700">
          Failed to update post: ${error.message || "Unknown error"}
        </div>
        <div class="flex gap-4 mt-4">
          <button id="tryAgain" class="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600">
            Try Again
          </button>
          <button id="backToFeedError" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
            Back to Feed
          </button>
        </div>
      `;

      // Add event listeners for the buttons
      const tryAgainButton = statusContainer.querySelector("#tryAgain");
      const backButton = statusContainer.querySelector("#backToFeedError");

      tryAgainButton.addEventListener("click", () => {
        // Hide status container and re-enable form
        statusContainer.className = "hidden";
        formElements.forEach((el) => (el.disabled = false));
      });

      backButton.addEventListener("click", () => {
        window.location.href = "/feed";
      });
    }
  });
}

/**
 * Displays an error message in the edit form
 * @param {string} message - The error message to display
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Show an error message to the user
 * showError("Failed to load post: Network error");
 * ```
 */
function showError(message) {
  const form = document.getElementById("editPostForm");
  if (form) {
    form.innerHTML = `
      <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        <p>${message}</p>
      </div>
    `;
  }
}

/**
 * Adds a back button to return to the feed page
 * @param {HTMLElement} container - The container element to add the button to
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Add a back button to the form container
 * const formContainer = document.querySelector('.form-container');
 * addBackButton(formContainer);
 * ```
 */
function addBackButton(container) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-center mt-4";

  const backButton = document.createElement("button");
  backButton.textContent = "Back to Feed";
  backButton.className =
    "px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100";
  backButton.addEventListener("click", () => {
    window.location.href = "/feed";
  });

  buttonContainer.appendChild(backButton);
  container.appendChild(buttonContainer);
}
