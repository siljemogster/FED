const displayContainer = document.getElementById('display-container');

const BASE_API_URL = 'https://v2.api.noroff.dev';
const POSTS_URL =`${BASE_API_URL}/social/posts`;

const NOROFF_API_KEY = 'ee8b8f0e-808a-4289-8ff6-d067e204cc45';

async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage('accessToken');
    console.log(accessToken); 
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Noroff-API-Key': NOROFF_API_KEY,
      },
    };
    const response = await fetch(POSTS_URL, fetchOptions);
    const json = await response.json();
    return json.data;
    console.log(response); 
    console.log(json); 
  } catch (error) {
    console.log(error);
  }
}

function genereatePosts(posts) {
  console.log(posts);
  for (let i = 0; i < posts.length; i++) {
    const postContainer = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = posts[i].title;



    const body = document.createElement('p');
    body.textContent = posts[i].body;

    postContainer.append(title, body);
    displayContainer.append(postContainer);

 
  }

}

async function main() {
  const posts = await fetchPosts(); 
  generatePosts(posts);
  console.log(posts);
}


main(); 