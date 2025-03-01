import { login } from "../../api/auth/login.js";
import { createApiKey } from "../../api/auth/apiKey.js";
import { saveToken, saveUsername, saveApiKey } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

export function loginHandler() {
  const form = document.querySelector("#loginForm");
  if (form) {
    form.addEventListener("submit", submitForm);
  }
}

async function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const profile = Object.fromEntries(formData);

  try {
    const response = await login(profile);
    const { data } = response;
    const { accessToken, name } = data;

    // Lagre token og brukernavn først
    saveToken(accessToken);
    saveUsername(name);
    
    console.log("Login successful, token saved");

    // Forsøk å generere API-nøkkel
    try {
      const apiKeyResponse = await fetch("https://v2.api.noroff.dev/auth/create-api-key", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      const apiData = await apiKeyResponse.json();
      console.log("API key response:", apiData);
      
      if (apiData.data && apiData.data.key) {
        localStorage.setItem("key", apiData.data.key);
        console.log("API key saved:", apiData.data.key);
      } else {
        console.error("Invalid API key response:", apiData);
      }
    } catch (apiError) {
      console.error("API key generation failed:", apiError);
      // Fortsett til feed selv om API-nøkkelgenerering feiler
    }

    // Omdirigere til feed-siden
    location.href = "/feed";
  } catch (error) {
    console.log(error);
    displayMessage("#message", "error", error.message);
  }
}
