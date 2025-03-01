import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getAccessToken } from "../../helpers/storage.js";

/**
 * Create a new post
 * @param {Object} postData - Post data with title, body, and optional media
 * @returns {Promise<Object>} - The created post data
 * @throws {Error} If post creation fails
 */
export async function createPost(postData) {
  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error("You must be logged in to create a post");
    }
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify(postData)
    };
    
    const response = await fetch(POSTS_URL, options);
    const json = await response.json();
    
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to create post");
    }
    
    return json.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}