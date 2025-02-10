const TOKEN = "token";
const USERNAME = "username";

export function saveToken(token) {
  localStorage.setItem(TOKEN, token);
}
export function getToken() {
  localStorage.setItem(TOKEN);
}
export function saveUsername(name) {
  localStorage.setItem(USERNAME, name);
}
export function getUsername() {
  localStorage.setItem(USERNAME);
}
