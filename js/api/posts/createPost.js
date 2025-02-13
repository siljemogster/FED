import { postsUrl } from "../../constants/api.js";
import { getApiKey, getToken } from "../../helpers/storage.js";

export async function createPost(post) {
  const media = {
    url: post.imageUrl,
    alt: post.imageAlt,
  };

  delete post.imageUrl;
  delete post.imageAlt;
  post.media = media;

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
}
