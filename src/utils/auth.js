const SESSION_KEY = 'writespace_session';

/**
 * Retrieve the current session from localStorage.
 * @returns {Object|null} The session object, or null if no session exists or on failure.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {Object} sessionObj - The session object to persist.
 * @returns {void}
 */
export function setSession(sessionObj) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  } catch (e) {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Clear the current session from localStorage.
 * @returns {void}
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // Silently fail — localStorage may be unavailable
  }
}