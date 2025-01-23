import { register } from "../../api/auth/register.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

export function registerHandler() {
  console.log("registerHandler");
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", submitForm);
  }
}

async function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (data.bio.trim() === "") {
    delete data.bio;
  }

  if (data.avatarUrl.trim() === "") {
    delete data.avatarUrl;
  } else {
    data.avatar = {
      url: data.avatarUrl,
      alt: `${data.name} 's avatar`,
    };
    delete data.avatarUrl;
  }

  const container = document.querySelector("#message");

  console.log(data);

  const fieldset = form.querySelector("fieldset");

  try {
    fieldset.disabled = true;
    displayMessage(
      "#message",
      "success",
      "Successfully registered. Please login."
    );
    document.querySelector("#message").innerHTML = displayMessage(
      "#message",
      "success",
      "Succeccfully registered. Please login. "
    );
    form.reset();
  } catch (error) {
    console.error(error);
    displayMessage(container, "warning", error.message);
  } finally {
    fieldset.disabled = false;
  }
}
