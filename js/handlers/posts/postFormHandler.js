import { createPost } from "../../api/posts/createPost.js";
import { loadPosts } from "./feedHandler.js";

/**
 * Set up the post form submission handler
 */
export function setupPostForm() {
  const postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", handlePostSubmit);
  }
}

/**
 * Add title field to post form
 */
export function addTitleFieldToPostForm() {
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
 * Handle post form submission
 * @param {Event} event - Form submission event
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
    window.alert = function() { /* Do nothing */ };

    try {
      const newPost = await createPost(postData);
      console.log("Post created successfully:", newPost);
      
      // Display your custom notification
      displaySuccess("Your post has been published!");
      
      form.reset();
      await loadPosts();
    } catch (innerError) {
      console.error("Error creating post:", innerError);
      displayError(`Failed to publish post: ${innerError.message || "Unknown error"}`);
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
 * Display an error message
 * @param {string} message - Error message to display
 */
export function displayError(message) {
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
 * Display a success message
 * @param {string} message - Success message to display
 */
export function displaySuccess(message) {
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
 */
export function disableForm(form) {
  form
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = true));
}

/**
 * Enable all form inputs and buttons
 * @param {HTMLFormElement} form - Form to enable
 */
export function enableForm(form) {
  form
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = false));
}