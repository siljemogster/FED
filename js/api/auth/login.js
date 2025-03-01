import { LOGIN_URL } from "../../constants/api.js";

export async function login(profile) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  };

  const response = await fetch(LOGIN_URL, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to log in");
  }

  return json;
}