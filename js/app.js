import { loginHandler } from "./handlers/auth/loginHandler.js";
import { registerHandler } from "./handlers/auth/registerHandler.js";
import { feedHandler } from "./handlers/posts/feedHandler.js";
import { createPostHandler } from "./handlers/posts/createPostHandler.js";

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
    case "/feed":
    case "/feed/":
    case "/feed/index.html":
      console.log("Feed page");
      feedHandler();
      createPostHandler(); // Also initialize the create post functionality
      break;
  }
}

router();
