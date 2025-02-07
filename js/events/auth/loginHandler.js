import { login } from "../../api/auth/login.js";
import { displayMessage } from "../../ui/common/displayMessage.js";

export function loginHandler() {
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const data = new FormData(form);
      const user = Object.fromEntries(data.entries());

      try {
        const response = await login(user);
        const token = response.accessToken;
        if (!token) {
          throw new Error("No token received");
        }
        localStorage.setItem("accessToken", token);
        console.log("Token saved:", token);
        window.location.href = "/feed/";
      } catch (error) {
        console.error("Login error:", error);
        displayMessage("#message", "error", error.message);
      }
    });
  }
}
