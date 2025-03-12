import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

/**
 * Update an existing post
 * @param {string} postId - ID of the post to update
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} - The updated post data
 */
export async function updatePost(postId, postData) {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("You must be logged in to update a post");
    }
    
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify(postData)
    };
    
    console.log(`Updating post ${postId} with data:`, postData);
    const response = await fetch(`${POSTS_URL}/${postId}`, options);
    
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.errors?.[0]?.message || "Failed to update post");
    }
    
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }

}

 

