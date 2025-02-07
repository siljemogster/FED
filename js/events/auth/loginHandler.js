import { login } from "../../api/auth/login.js";

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
  const data = Object.fromEntries(formData);

  console.log(data);

  try {
    const response = await login(data);
    console.log(response);
  } catch (error) {
    console.log(error); 
  }
}
