import { register } from "../../api/auth/register.js";
import { saveToken, saveUsername } from "../../storage/utils.js";
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

  console.log(profile);

  try {
    const response = await register(profile);

    const { data } = response;
    const { accessToken, name } = data;

    saveToken(accessToken);
    saveUsername(name);

    location.href = "/feed";
  } catch (error) {
    console.log(error);
    displayMessage("#message", "error", error);
  }
}
