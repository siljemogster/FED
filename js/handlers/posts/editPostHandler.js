import { updatePost } from "../../api/posts/updatePost.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

/**
 * Create a modal for editing a post
 * @param {Object} post 
 * @param {Function} reloadPostsCallback 
 * @returns {HTMLDivElement} 
 */
export function createEditPostModal(post, reloadPostsCallback) {
 
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";

  const modalContent = document.createElement("div");
  modalContent.className = "bg-white p-6 rounded-lg w-full max-w-md mx-4";
  

  const form = document.createElement("form");
  form.id = "editPostForm";
  form.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Edit Post</h2>
    
    <div class="mb-4">
      <label for="editTitle" class="block text-gray-700 font-bold mb-2">Title</label>
      <input 
        type="text" 
        id="editTitle" 
        name="title" 
        value="${post.title || ''}" 
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        maxlength="100"
      >
    </div>
    
    <div class="mb-4">
      <label for="editBody" class="block text-gray-700 font-bold mb-2">Content</label>
      <textarea 
        id="editBody" 
        name="body" 
        rows="4" 
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      >${post.body}</textarea>
    </div>
    
    <div class="flex justify-end space-x-4">
      <button 
        type="button" 
        id="cancelEditBtn" 
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        class="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
      >
        Save Changes
      </button>
    </div>
  `;
  
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const titleInput = form.querySelector("#editTitle");
    const bodyTextarea = form.querySelector("#editBody");
    
    const updatedPostData = {
      title: titleInput.value.trim() || "Untitled Post",
      body: bodyTextarea.value.trim()
    };
    
    try {
      
      form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
      
    
      await updatePost(post.id, updatedPostData);
      
     
      displayMessage("#message", "success", "Post updated successfully!");
      
     
      modal.remove();
      
    
      if (reloadPostsCallback && typeof reloadPostsCallback === 'function') {
        reloadPostsCallback();
      }
    } catch (error) {
      displayMessage("#message", "error", `Failed to update post: ${error.message}`);
    } finally {
  
      form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = false);
    }
  });
  
  
  const cancelButton = form.querySelector("#cancelEditBtn");
  cancelButton.addEventListener("click", () => modal.remove());
  
 
  modalContent.appendChild(form);
  
 
  modal.appendChild(modalContent);
  
  return modal;
}

/**
 * Add edit button to a post
 * @param {HTMLElement} postElement 
 * @param {Object} post 
 * @param {Function} reloadPostsCallback 
 * @returns {HTMLButtonElement} 
 */
export function addEditPostButton(postElement, post, reloadPostsCallback) {
  const editButton = document.createElement("button");
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-600 hover:text-purple-700">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  `;
  editButton.className = "p-2 rounded-full hover:bg-gray-100";
  editButton.setAttribute("aria-label", "Edit post");
  editButton.addEventListener("click", () => {
    const editModal = createEditPostModal(post, reloadPostsCallback);
    document.body.appendChild(editModal);
  });

  return editButton;
}