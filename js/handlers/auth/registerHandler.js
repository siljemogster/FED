import { register } from "../../api/auth/register.js";
import { saveToken, saveUsername } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/profile/displayMessage.js";

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

  if (profile.bio.trim() === "") {
    delete profile.bio;
  }

  if (profile.avatarUrl.trim() === "") {
    delete profile.avatarUrl;
  } else {
    profile.avatar = {
      url: profile.avatarUrl,
      alt: `${profile.name}'s avatar`,
    };
    delete profile.avatarUrl;
  }
  console.log(profile);

  try {
    await register(profile);
    form.reset();

    displayMessage(
      "#message",
      "success",
      "You have registred an account. <a href='/'>Login</a> to continue."
    );
  } catch (error) {
    console.log(error);
    displayMessage("#message", "error", error);
  }
}
