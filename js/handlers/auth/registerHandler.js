import { register } from "../../api/auth/register.js";
import { saveToken, saveUsername } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

export function registerHandler() {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", submitForm);
  }
}

async function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const profile = Object.fromEntries(formData);

  if (data.bio.trim() === "") {
    delete data.bio;
  }

  if (data.avatarUrl.trim() === "") {
    delete data.avatarUrl;
  } else {
    data.avatar = {
      url: data.avatarUrl,
      alt: `${data.name}'s avatar`,
    };
    delete data.avatarUrl;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  const fieldset = form.querySelector("fieldset");

  try {
    fieldset.disabled = true;
    submitButton.textContent = "Registration...";

    const response = await register(data);

    const { accessToken, name } = response.data;

    saveToken(accessToken);
    saveUsername(name);

    displayMessage(
      "#message",
      "success",
      "Registration successful! Redirecting..."
    );

    setTimeout(() => {
      window.location.href = "/feed";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    displayMessage("#message", "error", error.message);
  } finally {
    // Re-enable form
    fieldset.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}
