import { postsUrl } from "../../constants/api.js";
import { getApiKey, getToken } from "../../helpers/storage.js";



const BASE_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_URL}/social/posts`; 

const NOROFF_API_KEY = '04698e63-7e05-4498-bc94-7de0604dd75b';

async function fetchPosts() {
  try {
    const accessToken = getFromLocalSTorage('accessToken');
    const fetchOptions = {
      headers: {

      }
      Authorization; `Bearer ${accessToken},  
      'X-Noroff-API-Key': NOROFF_API_KEY,

    },
    };
    

    const response = await fetch(POSTS_URL);
    const json = await response.json();
    console.log(response); 
    console.log 

    return json.data; 
   
    }catch(error) {
console.log(error); 
  }



async function main () {
  const posts = await fetchPosts(); 
}

export async function fetchPosts() {
  const token = getToken();
  const apiKey = getApiKey();
  
/*
  if (!token) {
    throw new Error("Authentication token missing. Please log in again.");
  }
  
  // Prøv først med API-nøkkel hvis den finnes
  if (apiKey) {
    try {
      const response = await fetch(postsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey
        }
      });
      
      const json = await response.json();
      console.log("API Response with API key:", json);
      
      if (response.ok) {
        return json.data;
      }
      
      console.log("API call with API key failed, trying without...");
    } catch (error) {
      console.error("Error with API key:", error);
      console.log("Trying without API key...");
    }
  }
  
  // Fallback: Prøv uten API-nøkkel
  try {
    const response = await fetch(postsUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const json = await response.json();
    console.log("API Response without API key:", json);
    
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to fetch posts");
    }
    
    return json.data;
  } catch (error) {
    console.error("Error fetching posts without API key:", error);
    throw error;
  }
}*/