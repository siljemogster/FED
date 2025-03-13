import { register } from "../../api/auth/register.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

/**
 * Initializes the registration form handler by attaching an event listener to the register form
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the registration form handler
 * registerHandler();
 * // The registration form will now handle submissions
 * ```
 */
export function registerHandler() {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", submitForm);
  }
}

/**
 * Handles the registration form submission event
 * @param {Event} event - The form submission event
 * @returns {Promise<void>} Promise that resolves when registration is complete
 * @example
 * ```js
 * // This function is not typically called directly but through an event listener
 * form.addEventListener("submit", submitForm);
 * ```
 */
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
