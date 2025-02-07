import { registerHandler } from "./events/auth/registerHandler.js";
import { loginHandler } from "./events/auth/loginHandler.js";
import { fetchPosts } from "./feed.js";

function router() {
  const pathname = window.location.pathname;
  const token = localStorage.getItem("accessToken");

  switch (pathname) {
    case "/":
    case "/index.html":
      loginHandler();
      break;
    case "/register/":
      registerHandler();
      break;
    case "/feed/":
    case "/feed/index.html":
      if (!token) {
        window.location.href = "/";
        return;
      }
      fetchPosts();
      break;
    case "/profile/":
    case "/profile/index.html":
      if (!token) {
        window.location.href = "/";
        return;
      }
      break;
  }
}

router();
