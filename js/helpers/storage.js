/**
 * Storage helper functions for authentication
 */

const TOKEN = "accessToken";
const USERNAME = "username";

/**
 * Save access token to localStorage
 * @param {string} token - The authentication token
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN, token);
}

/**
 * Get access token from localStorage
 * @returns {string|null} The stored token or null if not found
 */
export function getToken() {
  return localStorage.getItem(TOKEN);
}

/**
 * Save username to localStorage
 * @param {string} name - The username
 */
export function saveUsername(name) {
  localStorage.setItem(USERNAME, name);
}

/**
 * Get username from localStorage
 * @returns {string|null} The stored username or null if not found
 */
export function getUsername() {
  return localStorage.getItem(USERNAME);
}

/**
 * Check if user is logged in
 * @returns {boolean} True if token exists in localStorage
 */
export function isLoggedIn() {
  return Boolean(getToken());
}

/**
 * For compatibility with existing code
 */
export const getAccessToken = getToken;
export const getFromLocalStorage = (key) => localStorage.getItem(key);