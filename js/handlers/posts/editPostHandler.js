import { fetchPost } from "../../api/posts/fetchPost.js";
import { updatePost } from "../../api/posts/updatePost.js";
import { getQueryParam } from "../../helpers/getQueryParam.js";

export async function editPostHandler() {
  // get the id from the querystring
  const id = getQueryParam("id");
  // get post by id
  try {
    const post = await fetchPost(id);
    console.log(post);
    populateForm(post);
    updatePostHandler();
  } catch (error) {
    //display error message
  }

  // add event listener to form to update post
  // or display error message
}

function populateForm(post) {
  // populate the form with the post data
  const { title, body, media, id } = post;
  // and add event listener to update post
  const form = document.querySelector("#editPostForm");
  form.id.value = id;
  form.title.value = title;
  form.body.value = body;
  form.mediaUrl.value = media?.url;
  form.mediaAlt.value = media?.alt;
}

function updatePostHandler() {
  const form = document.querySelector("#editPostForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const { title, body, mediaUrl, mediaAlt, id } = data;

    const postData = {
      title: title,
      body: body,
    };

    if (mediaUrl.trim() !== "") {
      postData.media = {
        url: mediaUrl,
        alt: mediaAlt,
      };
    }

    try {
      const response = await updatePost(id, postData);
      // display success message
    } catch (error) {
      // display error message
    }
  });
}