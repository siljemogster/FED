const TOKEN = "accessToken";
const USERNAME = "username";

/**
 * Save access token to localStorage
 * @param {string} token - The authentication token
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Save user's authentication token
 * saveToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 * ```
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN, token);
}

/**
 * Get access token from localStorage
 * @returns {string|null} The stored token or null if not found
 * @example
 * ```js
 * // Retrieve the authentication token
 * const token = getToken();
 * if (token) {
 *   // Use token for authenticated API requests
 * }
 * ```
 */
export function getToken() {
  return localStorage.getItem(TOKEN);
}

/**
 * Save username to localStorage
 * @param {string} name - The username
 * @returns {void} Does not return a value
 * @example
 * ```js
 * // Save the user's name after successful login
 * saveUsername("JohnDoe");
 * ```
 */
export function saveUsername(name) {
  localStorage.setItem(USERNAME, name);
}

/**
 * Get username from localStorage
 * @returns {string|null} The stored username or null if not found
 * @example
 * ```js
 * // Get the username to display in the UI
 * const username = getUsername();
 * if (username) {
 *   userNameElement.textContent = username;
 * }
 * ```
 */
export function getUsername() {
  return localStorage.getItem(USERNAME);
}

/**
 * Check if user is logged in
 * @returns {boolean} True if token exists in localStorage
 * @example
 * ```js
 * // Redirect to login page if user is not logged in
 * if (!isLoggedIn()) {
 *   window.location.href = "/login";
 * }
 * ```
 */
export function isLoggedIn() {
  return Boolean(getToken());
}

/**
 * Alternative function to get token for compatibility with existing code
 * @returns {string|null} The stored token or null if not found
 * @example
 * ```js
 * // Using the compatibility function to get the token
 * const token = getAccessToken();
 * ```
 */
export const getAccessToken = getToken;

/**
 * Generic function to get any value from localStorage by key
 * @param {string} key - The localStorage key to retrieve
 * @returns {string|null} The stored value or null if not found
 * @example
 * ```js
 * // Get a custom setting from localStorage
 * const theme = getFromLocalStorage("userTheme");
 * ```
 */
export const getFromLocalStorage = (key) => localStorage.getItem(key);
