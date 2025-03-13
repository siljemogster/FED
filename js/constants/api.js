/**
 * API constants for Noroff Social Media API
 * @module api/constants
 */

/**
 * Base URL for the Noroff API
 * @type {string}
 */
export const BASE_URL = "https://v2.api.noroff.dev";

/**
 * Authentication login endpoint
 * @type {string}
 */
export const AUTH_LOGIN_URL = `${BASE_URL}/social/auth/login`;

/**
 * Authentication registration endpoint
 * @type {string}
 */
export const AUTH_REGISTER_URL = `${BASE_URL}/social/auth/register`;

/**
 * Posts endpoint for retrieving and creating posts
 * @type {string}
 */
export const POSTS_URL = `${BASE_URL}/social/posts`;

/**
 * API key for Noroff API authentication
 * @type {string}
 */
export const NOROFF_API_KEY = "028fcd89-1ab6-4117-b37f-0ee32f549a9b";
