import { getToken } from "../../helpers/storage.js";
import { API_KEY_URL } from "../../constants/api.js";

export async function createApiKey() {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token available");
  }
  
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  
  try {
    const response = await fetch(API_KEY_URL, options);
    const json = await response.json();
    
    console.log("API key response:", json);
    
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to create API key");
    }
    
    return json;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
}