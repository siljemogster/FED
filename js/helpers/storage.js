const TOKEN = "token";
const USERNAME = "name";
const APIKEY = "key";

export function saveToken(token) {
  localStorage.setItem(TOKEN, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN);
}
export function saveUsername(name) {
  localStorage.setItem(USERNAME, name);
}
export function getUsername() {
  return localStorage.getItem(USERNAME);
}

export function saveApiKey(key) {
  localStorage.setItem(APIKEY, key);
}

export function getApiKey() {
  return localStorage.getItem(APIKEY);
}
