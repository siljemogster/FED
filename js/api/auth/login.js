const loginForm = document.querySelector("#login-form");

function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

const BASE_API_URL = "https://v2.api.noroff.dev";
const AUTH_REGISTER_URL = `${BASE_API_URL}/auth/login`;

async function loginUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(AUTH_REGISTER_URL, fetchOptions);
    const json = await response.JSON();
    console.log(json.accessToken);

    const acessToken = json.accessToken;
    addToLocalStorage("accessToken", accessToken);

    console.log(json);
  } catch (error) {
    console.log(error);
  }

  function onLoginFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);
    loginUser(formFields);
  }

  loginForm.addEventListener("submit", onLoginFormSubmit);
}
