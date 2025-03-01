import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

/**
 * Delete a post
 * @param {string} postId - ID of the post to delete
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("You must be logged in to delete a post");
    }
    
    const options = {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    
    console.log(`Deleting post ${postId}`);
    const response = await fetch(`${POSTS_URL}/${postId}`, options);
    
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.errors?.[0]?.message || "Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}