

import { BASE_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

/**
 * Fetch a user profile by username
 * @param {string} username - The username to fetch
 * @returns {Promise<Object>} - The user profile data
 */
export async function fetchUserProfile(username) {
  try {
    const accessToken = getToken();
    
    if (!accessToken) {
      throw new Error("Authentication required. Please log in.");
    }
    
    const url = `${BASE_URL}/social/profiles/${username}`;
    
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.errors?.[0]?.message || `Failed to fetch profile for ${username}`);
    }
    
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    throw error;
  }
}