const { sessionStorage } = window;

/* eslint-disable no-console */
export const SessionStorageApi = {
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      console.error(`Error writing to sessionStorage`, key, value);
    }
  },
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (_) {
      console.error(`Error getting from sessionStorage`, key);

      return undefined;
    }
  },
  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (_) {
      console.error(`Error removing item from sessionStorage`, key);
    }
  },
  clear() {
    try {
      sessionStorage.clear();
    } catch (_) {
      console.error('Error clearing sessionStorage');
    }
  },
};
