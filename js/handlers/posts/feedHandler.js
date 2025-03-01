import { displayMessage } from "../../ui/common/displayMessage.js";

export async function feedHandler() {
  console.log("Feed handler initialized");
  const container = document.getElementById("display-container");

  function main() {
    
  }
  



  if (!container) {
    console.error("Display container not found");
    return;
  }
  
  // Vis laste-indikator
  container.innerHTML = `
    <div class="max-w-2xl mx-auto p-4 text-center">
      <p class="text-gray-500">Loading posts...</p>
    </div>
  `;
  
  // Vis feilmelding og fallback til dummy-data
  setTimeout(() => {
    displayMessage("#display-container", "error", "Unable to connect to Noroff API. Showing demo content instead.");
    
    setTimeout(() => {
      console.log("Using dummy posts due to API issues");
      const dummyPosts = getDummyPosts();
      renderPosts(dummyPosts, container);
    }, 1500);
  }, 500);
}

function renderPosts(posts, container) {
  // Bygg HTML for hvert innlegg
  const postsHTML = posts.map(post => {
    // Format dato
    const createdDate = new Date(post.created || new Date());
    const timeAgo = getTimeAgo(createdDate);
    
    // Sjekk om innlegg har media
    const mediaHTML = post.media ? 
      `<img src="${post.media}" alt="Post image" class="w-full rounded-lg mb-4">` : '';
    
    return `
      <article class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <img
            src="${post.author?.avatar || 'https://via.placeholder.com/40'}"
            alt="${post.author?.name || 'User'}'s Avatar"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <h3 class="font-semibold">${post.author?.name || 'Unknown User'}</h3>
            <time datetime="${post.created || new Date()}" class="text-sm text-gray-500">${timeAgo}</time>
          </div>
        </div>
        <p class="mb-4">${post.body || post.title || 'No content'}</p>
        ${mediaHTML}
        <div class="flex items-center gap-6 text-gray-500">
          <div class="flex items-center space-x-1">
            <button class="group" data-post-id="${post.id}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
            <span class="text-gray-500">${post._count?.reactions || 0}</span>
          </div>
          <div class="flex items-center space-x-1">
            <button class="group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 text-gray-500 hover:text-purple-500 hover:fill-purple-500 group-focus:text-purple-500 group-focus:fill-purple-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
            </button>
            <span class="text-gray-500">${post._count?.comments || 0}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  container.innerHTML = `<div class="max-w-2xl mx-auto p-4 space-y-6">${postsHTML}</div>`;
}

function getDummyPosts() {
  return [
    {
      id: "dummy1",
      title: "Demo Post 1",
      body: "This is a demo post showing while we're experiencing API issues. In a real application, this would show actual posts from the Noroff API.",
      created: new Date().toISOString(),
      author: {
        name: "Demo User",
        avatar: "https://via.placeholder.com/40"
      },
      _count: {
        reactions: 15,
        comments: 3
      }
    },
    {
      id: "dummy2",
      title: "Demo Post 2",
      body: "Here's another demo post showing how the feed looks with multiple entries. This gives you an idea of what the real posts would look like.",
      created: new Date(Date.now() - 3600000).toISOString(),
      author: {
        name: "Test User",
        avatar: "https://via.placeholder.com/40"
      },
      _count: {
        reactions: 8,
        comments: 1
      }
    },
    {
      id: "dummy3",
      title: "Demo Post 3",
      body: "This is a third demo post. You can create posts, update them, and more once the API connection is working properly.",
      created: new Date(Date.now() - 7200000).toISOString(),
      author: {
        name: "Example User",
        avatar: "https://via.placeholder.com/40"
      },
      _count: {
        reactions: 32,
        comments: 5
      }
    }
  ];
}

// Hjelpefunksjon for å formatere "time ago"
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + ' years ago';
  if (interval === 1) return interval + ' year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + ' months ago';
  if (interval === 1) return interval + ' month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + ' days ago';
  if (interval === 1) return interval + ' day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + ' hours ago';
  if (interval === 1) return interval + ' hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + ' minutes ago';
  if (interval === 1) return interval + ' minute ago';
  
  return 'just now';
}