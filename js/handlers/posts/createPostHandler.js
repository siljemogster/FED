import { displayMessage } from "../../ui/profile/displayMessage.js";
import { createPost } from "../../api/posts/createPost.js";

export async function createPostHandler() {
  const createPostForm = document.querySelector("#createPostForm");
  if (createPostForm) {
    createPostForm.addEventListener("submit", submitForm);
  }
}

async function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Get textarea for post body
  const body = data.body;
  
  if (!body || body.trim() === '') {
    displayMessage("#messageContainer", "error", "Post content cannot be empty");
    return;
  }
  
  const postData = {
    title: body.substring(0, 30) + "...", // Generate a title from body
    body: body
  };
  
  try {
    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    
    // Disable the form and show loading state
    form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
    submitButton.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Posting...
    `;
    
    const response = await createPost(postData);
    
    // Show success message
    displayMessage("#messageContainer", "success", "Post published successfully!");
    
    // Reset form
    form.reset();
    
    // Reload the feed to show the new post
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    displayMessage("#messageContainer", "error", error.message);
  } finally {
    // Re-enable the form
    form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = false);
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.innerHTML = "Post";
  }
}
