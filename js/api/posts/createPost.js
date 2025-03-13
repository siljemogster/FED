import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

/**
 * Create a new post
 * @param {Object} postData - Post data with title, body, and optional media
 * @returns {Promise<Object>} - The created post data
 * @throws {Error} If post creation fails
 */
export async function createPost(postData) {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("You must be logged in to create a post");
    }
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify(postData)
    };
    
    console.log("Creating post with data:", postData);
    const response = await fetch(POSTS_URL, options);
    
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.errors?.[0]?.message || "Failed to create post");
    }
    
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}