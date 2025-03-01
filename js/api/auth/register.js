import { REGISTER_URL } from "../../constants/api.js";

export async function register(profile) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  };

  const response = await fetch(REGISTER_URL, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to register");
  }

  return json;
}
