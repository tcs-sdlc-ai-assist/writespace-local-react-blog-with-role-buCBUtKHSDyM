const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieve all blog posts from localStorage.
 * @returns {Array<Object>} Array of post objects, or empty array on failure.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Save an array of blog posts to localStorage.
 * @param {Array<Object>} posts - The array of post objects to persist.
 * @returns {void}
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<Object>} Array of user objects, or empty array on failure.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Save an array of users to localStorage.
 * @param {Array<Object>} users - The array of user objects to persist.
 * @returns {void}
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // Silently fail — localStorage may be full or unavailable
  }
}