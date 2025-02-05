const BASE_URL = "https://v2.api.noroff.dev/api/v1/social";
import { getFromLocalStorage } from "./storage/utils.js";

const displayContainer = document.getElementById("display-container");

const BASE_API_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_API_URL}/social/posts`;

const NOROFF_API_KEY = "028fcd89-1ab6-4117-b37f-0ee32f549a9b";

async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };

    const response = await fetch(POSTS_URL, fetchOptions);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

function generatePosts(posts) {
  for (let i = 0; i < posts.length; i++) {
    const postContainer = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = posts[i].title;

    const body = document.createElement("p");
    body.textContext = posts[i].body;

    postContainer.append(title, body);
    displayContainer.append(postContainer);
  }
}

async function main() {
  const posts = await fetchPosts();
  generatePosts(posts);
}
main();
