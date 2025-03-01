import { deletePost } from "../../api/posts/deletePost.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

/**

 * @param {HTMLElement} postElement 
 * @param {Object} post 
 * @param {Function} reloadPostsCallback 
 * @returns {HTMLButtonElement}
 */
export function addDeletePostButton(postElement, post, reloadPostsCallback) {

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-600 hover:text-red-800">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  `;
  deleteButton.className = "p-2 rounded-full hover:bg-gray-100";
  deleteButton.setAttribute("aria-label", "Delete post");
  deleteButton.addEventListener("click", () => {
   
    const confirmModal = document.createElement("div");
    confirmModal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
    confirmModal.innerHTML = `
      <div class="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
        <p class="mb-6 text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button id="cancelDeleteBtn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
          <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    `;
    
    const cancelBtn = confirmModal.querySelector("#cancelDeleteBtn");
    const confirmBtn = confirmModal.querySelector("#confirmDeleteBtn");
    
    cancelBtn.addEventListener("click", () => confirmModal.remove());
    
    confirmBtn.addEventListener("click", async () => {
      try {
      
        cancelBtn.disabled = true;
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `
          <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting...
        `;
        
      
        await deletePost(post.id);
        
      
        displayMessage("#message", "success", "Post deleted successfully!");
        
    
        confirmModal.remove();
        postElement.remove();
        
       
        if (reloadPostsCallback && typeof reloadPostsCallback === 'function') {
          reloadPostsCallback();
        }
      } catch (error) {
        displayMessage("#message", "error", `Failed to delete post: ${error.message}`);
        
       
        cancelBtn.disabled = false;
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = "Delete";
      }
    });
    
   
    document.body.appendChild(confirmModal);
  });

  return deleteButton;
}