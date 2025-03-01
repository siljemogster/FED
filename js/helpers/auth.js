import { getUsername } from "./storage.js";

export function postBelongsToUser(authorName) {
  const loggedInUser = getUsername();
  return loggedInUser === authorName;
}