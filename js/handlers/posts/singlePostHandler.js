import { fetchPost } from "../../api/posts/fetchPost.js";
import { getQueryParam } from "../../helpers/getQueryParam.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

export default async function singlePostHandler() {
  // get the id from the querystring
  const postId = getQueryParam("id");

  if (!postId) {
    throw new Error("No post ID found in query string");
  }

  const postContainer = document.querySelector("#post-container");

  try {
    // api call - get post by id
    const post = await fetchPost(postId);
    // render post
    generatePost(postContainer, post);
  } catch (error) {
    // or render an error message
    displayMessage(postContainer, "error", error.message);
  }
}

function generatePost(container, post) {
  const { title, body, author, media } = post;

  container.innerHTML = "";

  const postElement = document.createElement("div");
  const titleElement = document.createElement("h1");
  titleElement.innerText = title;

  container.appendChild(titleElement);
}