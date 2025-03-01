import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

/**
 * Fetch posts from the API
 * @param {Object} options - Optional parameters
 * @param {number} options.limit - Limit number of posts (default: 20)
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
export async function fetchPosts(options = {}) {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }
    
    // Build URL with any query parameters
    let url = POSTS_URL;
    const queryParams = new URLSearchParams();
    
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
    
    if (queryParams.toString()) {
      url = `${url}?${queryParams.toString()}`;
    }
    
    // Set up fetch options
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    
    console.log("Fetching from URL:", url);
    console.log("With options:", fetchOptions);
    
    // Make the API request
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.message || `API request failed with status ${response.status}`);
    }
    
    const json = await response.json();
    console.log("API response:", json);
    return json.data;
    
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}