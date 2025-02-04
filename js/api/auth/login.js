const loginForm = document.querySelector("#login-form");

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
    const json = await response.json();
    const acessToken = json.data.accessToken;
    addToLocalStorage('accessToken', accessToken);

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
