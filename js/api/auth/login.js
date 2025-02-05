import { BASE_URL } from "../../constants/api.js";

export async function login(user) {
  const url = `${BASE_URL}auth/login`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(url, options);
  const json = await response.json();
  console.log(response);

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Login failed");
  }

  return json;
}
