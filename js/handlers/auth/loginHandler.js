import { login } from "../../api/auth/login.js";
import { saveToken, saveUsername } from "../../helpers/storage.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

/**
 * Initializes the login form handler by attaching an event listener to the login form
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Initialize the login form handler
 * loginHandler();
 * // The login form will now handle submissions
 * ```
 */
export function loginHandler() {
  const form = document.querySelector("#loginForm");
  if (form) {
    form.addEventListener("submit", submitForm);
  }
}

/**
 * Handles the login form submission event
 * @param {Event} event - The form submission event
 * @returns {Promise<void>} Promise that resolves when login is complete
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

  try {
    const response = await login(profile);

    const { data } = response;
    const { accessToken, name } = data;

    saveToken(accessToken);
    saveUsername(name);

    location.href = "/feed";
  } catch (error) {
    console.log(error);
    displayMessage("#message", "error", "Invalid email or password", error);
  }
}
