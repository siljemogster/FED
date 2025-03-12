import { POSTS_URL, NOROFF_API_KEY } from "../../constants/api.js";
import { getToken } from "../../helpers/storage.js";

export async function fetchPost(id) {
  const accessToken = getToken();

  if (!accessToken) {
    throw new Error("Authentication required. Please log in.");
  }

  let url = `${POSTS_URL}/${id}?_author=true`;

  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.errors?.[0]?.message ||
        `API request failed with status ${response.status}`
    );
  }

  const json = await response.json();
  return json.data;
}