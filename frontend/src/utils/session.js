import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'amazon_cart_session_id';

/**
 * Gets the cart session ID from localStorage.
 * If none exists, generates a new UUID and stores it.
 * This ID is tied to the user's anonymous cart.
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};
