import { loginHandler } from "./handlers/auth/loginHandler.js";
import { registerHandler } from "./handlers/auth/registerHandler.js";

function router() {
  const pathname = window.location.pathname;

  console.log(pathname);

  switch (pathname) {
    case "/":
    case "/index.html":
      console.log("Home page");
      loginHandler();
      break;
    case "/register":
    case "/register/":
    case "/register/index.html":
      registerHandler();
      break;
  }
}

router();
