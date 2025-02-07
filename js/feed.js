const BASE_API_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_API_URL}/social/posts`;
const NOROFF_API_KEY = "028fcd89-1ab6-4117-b37f-0ee32f549a9b";

import { getFromLocalStorage } from "./storage/utils.js";

const displayContainer = document.getElementById("display-container");

function isAuthenticated() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

async function fetchPosts() {
  try {
    if (!isAuthenticated()) {
      displayContainer.innerHTML =
        '<div class="text-red-600">Please log in to view posts</div>';
      return [];
    }

    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };

    const response = await fetch(POSTS_URL, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    displayContainer.innerHTML = `<div class="text-red-600 p-4">Error loading posts: ${error.message}</div>`;
    console.error(error);
    return [];
  }
}

async function createPost(postData) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    console.log("Token:", accessToken); // For debugging
    console.log("Post data:", postData); // For debugging

    const response = await fetch(POSTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("API error:", errorData); // For debugging
      throw new Error(errorData.message || "Failed to create post");
    }
    return response.json();
  } catch (error) {
    console.error("Create post error:", error);
    throw error;
  }
}

async function updatePost(postId, updateData) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const response = await fetch(`${POSTS_URL}/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error("Failed to update post");
    return response.json();
  } catch (error) {
    console.error("Update post error:", error);
    throw error;
  }
}

async function deletePost(postId) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const response = await fetch(`${POSTS_URL}/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    });

    if (!response.ok) throw new Error("Failed to delete post");
    return true;
  } catch (error) {
    console.error("Delete post error:", error);
    throw error;
  }
}

function createPostHTML(post) {
  const isAuthor = post.author.email === getFromLocalStorage("userEmail");

  return `
   <article class="bg-white p-6 rounded-lg shadow-sm mb-4" data-created="${post.created}" data-reactions="${post._count?.reactions || 0}">
     <div class="flex items-center gap-3 mb-4">
       <img src="${post.author.avatar || "default-avatar.jpg"}" 
            alt="${post.author.name}" 
            class="w-10 h-10 rounded-full">
       <div>
         <h3 class="font-semibold">${post.author.name}</h3>
         <time class="text-sm text-gray-500">${new Date(post.created).toLocaleDateString()}</time>
       </div>
       ${
         isAuthor
           ? `
         <div class="ml-auto">
           <button onclick="editPost('${post.id}')" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
           <button onclick="deletePost('${post.id}')" class="text-red-600 hover:text-red-800">Delete</button>
         </div>
       `
           : ""
       }
     </div>
     <p class="mb-4">${post.body}</p>
     ${post.media ? `<img src="${post.media}" alt="Post image" class="w-full rounded-lg mb-4">` : ""}
     <div class="flex items-center gap-6 text-gray-500">
       <div class="flex items-center space-x-1">
         <button class="group" data-post-id="${post.id}">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500">
             <path stroke-linecap="round" stroke-linejoin="round" 
                   d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
           </svg>
         </button>
         <span class="text-gray-500">${post._count?.reactions || 0}</span>
       </div>
     </div>
   </article>`;
}

function generatePosts(posts) {
  if (!displayContainer) return;
  displayContainer.innerHTML = posts
    .map((post) => createPostHTML(post))
    .join("");
}

const searchInput = document.querySelector('input[type="search"]');
const filterSelect = document.querySelector("select");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const posts = document.querySelectorAll("#display-container article");

    posts.forEach((post) => {
      const text = post.textContent.toLowerCase();
      post.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  });
}

if (filterSelect) {
  filterSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const posts = [...document.querySelectorAll("#display-container article")];

    switch (value) {
      case "recent":
        sortPosts(
          posts,
          (a, b) => new Date(b.dataset.created) - new Date(a.dataset.created)
        );
        break;
      case "popular":
        sortPosts(
          posts,
          (a, b) => Number(b.dataset.reactions) - Number(a.dataset.reactions)
        );
        break;
    }
  });
}

function sortPosts(posts, compareFn) {
  const container = document.getElementById("display-container");
  const sorted = posts.sort(compareFn);
  container.innerHTML = "";
  sorted.forEach((post) => container.appendChild(post));
}

const postForm = document.querySelector("#postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const textarea = postForm.querySelector("textarea");
    console.log("Current token:", localStorage.getItem("accessToken")); // Added this line

    const postData = {
      body: textarea.value,
    };

    try {
      await createPost(postData);
      postForm.reset();
      const posts = await fetchPosts();
      generatePosts(posts);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });
}

window.editPost = async (postId) => {
  const post = document.querySelector(`article[data-post-id="${postId}"]`);
  const body = post.querySelector("p").textContent;

  const newBody = prompt("Edit your post:", body);
  if (newBody && newBody !== body) {
    try {
      await updatePost(postId, { body: newBody });
      const posts = await fetchPosts();
      generatePosts(posts);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }
};

window.deletePost = async (postId) => {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      await deletePost(postId);
      const posts = await fetchPosts();
      generatePosts(posts);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
};

async function main() {
  if (!isAuthenticated()) return;
  const posts = await fetchPosts();
  generatePosts(posts);
}

main();
