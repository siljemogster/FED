import { postsUrl } from "../../constants/api.js";
import { getApiKey, getToken } from "../../helpers/storage.js";

export async function createPost(post) {
  try {
    // Bare legg til media hvis imageUrl finnes
    if (post.imageUrl) {
      const media = {
        url: post.imageUrl,
        alt: post.imageAlt || "Post image",
      };
      
      delete post.imageUrl;
      delete post.imageAlt;
      post.media = media;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        "X-Noroff-API-Key": getApiKey(),
      },
      body: JSON.stringify(post),
    };

    const response = await fetch(postsUrl, options);
    const json = await response.json();
    
    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed creating post");
    }
    
    return json;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
